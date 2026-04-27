export const GraphQLQueries = {
  CREATE_BANK_ACCOUNT: `
    mutation CreateBankAccount($bankName: String!, $routingNumber: String!, $accountNumber: String!) {
      createBankAccount(bankName: $bankName, routingNumber: $routingNumber, accountNumber: $accountNumber) {
        id
      }
    }
  `.trim(),
};
