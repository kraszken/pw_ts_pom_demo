import { faker } from "@faker-js/faker";

export interface TransactionUIData {
  amount: string;
  description: string;
}

export class TransactionFactory {
  /**
   * Generuje poprawne, losowe dane do wypełnienia formularza transakcji (UI).
   */
  public static createValidTransactionData(): TransactionUIData {
    return {
      // Cypress RWA przeważnie wymaga pełnych liczb dla prostego działania formularza
      amount: faker.number.int({ min: 10, max: 500 }).toString(),
      description: faker.lorem.words(3),
    };
  }
}
