import { ENV } from "@config/env.config";
import { faker } from "@faker-js/faker";
import {
  APIRequestContext,
  expect,
  request as playwrightRequest,
} from "@playwright/test";
import { GraphQLQueries } from "../graphql/queries";
import { Transaction, User } from "../models/types";

export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly backendUrl = ENV.API_URL;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  public async createUniqueUser(role: string = "User"): Promise<User> {
    const uniqueId = faker.string.uuid().slice(0, 8);
    const username =
      `${role}_${faker.internet.username()}`
        .replaceAll(/\W/g, "")
        .slice(0, 20) + uniqueId;

    const response = await this.request.post(`${this.backendUrl}/users`, {
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: username,
        password: ENV.USER_PASSWORD,
        email: faker.internet.email(),
        phoneNumber: faker.string.numeric(10),
        balance: 100000,
        avatar: faker.image.avatar(),
        defaultPrivacyLevel: "public",
      },
    });

    expect(
      response.ok(),
      `API Error creating user: ${await response.text()}`,
    ).toBeTruthy();

    const body = await response.json();
    return body.user as User;
  }

  public async getCurrentUserId(): Promise<string> {
    const response = await this.request.get(`${this.backendUrl}/checkAuth`);
    expect(response.ok(), `Auth Error: ${await response.text()}`).toBeTruthy();

    const body = await response.json();
    return body.user.id;
  }

  public async loginAndCreateBankAccount(username: string): Promise<void> {
    const context = await playwrightRequest.newContext({
      baseURL: this.backendUrl,
    });
    const loginResponse = await context.post(`/login`, {
      data: { username, password: ENV.USER_PASSWORD },
    });
    expect(
      loginResponse.ok(),
      `Login Error: ${await loginResponse.text()}`,
    ).toBeTruthy();

    const graphqlResponse = await context.post(`/graphql`, {
      data: {
        operationName: "CreateBankAccount",
        variables: {
          bankName: "API Bank",
          routingNumber: "123456789",
          accountNumber: "1234567890",
        },
        query: GraphQLQueries.CREATE_BANK_ACCOUNT,
      },
    });
    expect(
      graphqlResponse.ok(),
      `GraphQL Error: ${await graphqlResponse.text()}`,
    ).toBeTruthy();

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
      data: { username, password: ENV.USER_PASSWORD },
    });
    expect(
      loginResponse.ok(),
      `Login Error: ${await loginResponse.text()}`,
    ).toBeTruthy();

    const transactionResponse = await context.post(`/transactions`, {
      data: {
        transactionType: type,
        receiverId,
        amount,
        description,
        privacyLevel: "public",
      },
    });
    expect(
      transactionResponse.ok(),
      `Transaction Error: ${await transactionResponse.text()}`,
    ).toBeTruthy();

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
      data: { username, password: ENV.USER_PASSWORD },
    });
    expect(
      loginResponse.ok(),
      `Login Error: ${await loginResponse.text()}`,
    ).toBeTruthy();

    const likeResponse = await context.post(`/likes/${transactionId}`);
    expect(
      likeResponse.ok(),
      `Like Error: ${await likeResponse.text()}`,
    ).toBeTruthy();

    await context.dispose();
  }
}
