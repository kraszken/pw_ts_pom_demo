import { faker } from "@faker-js/faker";

export interface TransactionUIData {
  amount: string;
  description: string;
}

export class TransactionFactory {
  public static createValidTransactionData(): TransactionUIData {
    return {
      amount: faker.number.int({ min: 10, max: 500 }).toString(),
      description: faker.lorem.words(3),
    };
  }
}
