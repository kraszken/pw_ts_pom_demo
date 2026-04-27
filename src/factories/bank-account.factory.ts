import { faker } from "@faker-js/faker";

export interface BankAccountPayload {
  bankName: string;
  routingNumber: string;
  accountNumber: string;
}

export class BankAccountFactory {
  /**
   * Generates a randomized, valid bank account payload.
   */
  public static createValidBankAccount(): BankAccountPayload {
    return {
      bankName: `${faker.company.name()} Bank`,
      routingNumber: faker.string.numeric(9),
      accountNumber: faker.string.numeric(10),
    };
  }
}
