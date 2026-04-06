import { faker } from "@faker-js/faker";
import {
  APIRequestContext,
  expect,
  request as playwrightRequest,
} from "@playwright/test";
import { env } from "process";
import { Transaction, User } from "../types/models";

export class ApiClient {
  private request: APIRequestContext;
  private backendUrl = env.API_URL || "http://localhost:3001";

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  public async createUniqueUser(role: string = "User"): Promise<User> {
    const uniqueId = faker.string.uuid().slice(0, 8);
    const username =
      `${role}_${faker.internet.username()}`
        .replace(/[^a-zA-Z0-9_]/g, "")
        .slice(0, 20) + uniqueId;

    const response = await this.request.post(`${this.backendUrl}/users`, {
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: username,
        password: env.USERPASSWORD || "s3cret",
        email: faker.internet.email(),
        phoneNumber: faker.string.numeric(10),
        balance: 100000,
        avatar: faker.image.avatar(),
        defaultPrivacyLevel: "public",
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();

    return body.user as User;
  }

  public async getCurrentUserId(): Promise<string> {
    const response = await this.request.get(`${this.backendUrl}/checkAuth`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    return body.user.id;
  }

  public async loginAndCreateBankAccount(username: string): Promise<void> {
    const context = await playwrightRequest.newContext({
      baseURL: this.backendUrl,
    });
    const loginResponse = await context.post(`/login`, {
      data: { username, password: env.USERPASSWORD || "s3cret" },
    });
    expect(loginResponse.status()).toBe(200);

    const graphqlResponse = await context.post(`/graphql`, {
      data: {
        operationName: "CreateBankAccount",
        variables: {
          bankName: "API Bank",
          routingNumber: "123456789",
          accountNumber: "1234567890",
        },
        query:
          "mutation CreateBankAccount($bankName: String!, $routingNumber: String!, $accountNumber: String!) {\n  createBankAccount(bankName: $bankName, routingNumber: $routingNumber, accountNumber: $accountNumber) {\n    id\n  }\n}",
      },
    });
    expect(graphqlResponse.status()).toBe(200);
    await context.dispose();
  }

  public async loginAndCreateTransaction(
    username: string,
    type: "payment" | "request",
    receiverId: string,
    amount: number,
    description: string,
  ): Promise<Transaction> {
    const context = await playwrightRequest.newContext({
      baseURL: this.backendUrl,
    });
    const loginResponse = await context.post(`/login`, {
      data: { username, password: env.USERPASSWORD || "s3cret" },
    });
    expect(loginResponse.status()).toBe(200);

    const transactionResponse = await context.post(`/transactions`, {
      data: {
        transactionType: type,
        receiverId,
        amount,
        description,
        privacyLevel: "public",
      },
    });
    expect(transactionResponse.status()).toBe(200);
    const body = await transactionResponse.json();

    await context.dispose();
    return body.transaction as Transaction;
  }

  public async loginAndLikeTransaction(
    username: string,
    transactionId: string,
  ): Promise<void> {
    const context = await playwrightRequest.newContext({
      baseURL: this.backendUrl,
    });
    const loginResponse = await context.post(`/login`, {
      data: { username, password: env.USERPASSWORD || "s3cret" },
    });
    expect(loginResponse.status()).toBe(200);

    const likeResponse = await context.post(`/likes/${transactionId}`);
    expect(likeResponse.status()).toBe(200);
    await context.dispose();
  }
}
