import { ENV } from "@config/env.config";
import { faker } from "@faker-js/faker";

export interface UserPayload {
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  email: string;
  phoneNumber: string;
  balance: number;
  avatar: string;
  defaultPrivacyLevel: "public" | "private" | "contacts";
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export class UserFactory {
  public static createRandomUserPayload(
    rolePrefix: string = "User",
  ): UserPayload {
    const uniqueId = faker.string.uuid().slice(0, 8);
    const username =
      `${rolePrefix}_${faker.internet.username()}`
        .replaceAll(/\W/g, "")
        .slice(0, 20) + uniqueId;

    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: username,
      password: ENV.USER_PASSWORD,
      email: faker.internet.email(),
      phoneNumber: faker.string.numeric(10),
      balance: 100000,
      avatar: faker.image.avatar(),
      defaultPrivacyLevel: "public",
    };
  }

  public static createUpdateProfilePayload(): UpdateProfilePayload {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phoneNumber: faker.string.numeric(10),
    };
  }
}
