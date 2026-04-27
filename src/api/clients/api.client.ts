import { ENV } from "@config/env.config";
import { faker } from "@faker-js/faker";
import {
  APIRequestContext,
  expect,
  request as playwrightRequest,
  test,
} from "@playwright/test";
import { GraphQLQueries } from "../graphql/queries";
import { Transaction, User } from "../models/types";

export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly backendUrl = ENV.API_URL;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private async withAuthenticatedContext<T>(
    username: string,
    stepDescription: string,
    action: (context: APIRequestContext) => Promise<T>,
  ): Promise<T> {
    return await test.step(`⚙️ API Context: ${stepDescription}`, async () => {
      const context = await playwrightRequest.newContext({
        baseURL: this.backendUrl,
      });

      const loginResponse = await context.post(`/login`, {
        data: { username, password: ENV.USER_PASSWORD },
      });

      expect(
        loginResponse.ok(),
        `Login Error for ${username}: ${await loginResponse.text()}`,
      ).toBeTruthy();

      try {
        return await action(context);
      } finally {
        await context.dispose();
      }
    });
  }

  public async createUniqueUser(role: string = "User"): Promise<User> {
    return await test.step(`⚙️ API: Create unique user [Role: ${role}]`, async () => {
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
    });
  }

  public async getCurrentUserId(): Promise<string> {
    return await test.step("⚙️ API: Get current user ID", async () => {
      const response = await this.request.get(`${this.backendUrl}/checkAuth`);
      expect(
        response.ok(),
        `Auth Error: ${await response.text()}`,
      ).toBeTruthy();

      const body = await response.json();
      return body.user.id;
    });
  }

  public async loginAndCreateBankAccount(username: string): Promise<void> {
    await this.withAuthenticatedContext(
      username,
      `Create Bank Account for ${username}`,
      async (context) => {
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
      },
    );
  }

  public async loginAndCreateTransaction(
    username: string,
    type: "payment" | "request",
    receiverId: string,
    amount: number,
    description: string,
  ): Promise<Transaction> {
    return await this.withAuthenticatedContext(
      username,
      `Create [${type}] transaction to ${receiverId}`,
      async (context) => {
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
        return body.transaction as Transaction;
      },
    );
  }

  public async loginAndLikeTransaction(
    username: string,
    transactionId: string,
  ): Promise<void> {
    await this.withAuthenticatedContext(
      username,
      `Like transaction ${transactionId}`,
      async (context) => {
        const likeResponse = await context.post(`/likes/${transactionId}`);
        expect(
          likeResponse.ok(),
          `Like Error: ${await likeResponse.text()}`,
        ).toBeTruthy();
      },
    );
  }
}
