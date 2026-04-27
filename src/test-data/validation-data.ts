export const ValidationData = {
  userSettings: {
    invalid: {
      firstName: "Abc",
      lastName: "Abc",
      emailNoDomain: "abc@bob.",
      phoneTooShort: "615-555-",
    },
    expectedErrors: {
      firstNameMissing: "Enter a first name",
      lastNameMissing: "Enter a last name",
      emailMissing: "Enter an email address",
      emailInvalid: "Must contain a valid email address",
      phoneMissing: "Enter a phone number",
      phoneInvalid: "Phone number is not valid",
    },
  },
  bankAccounts: {
    invalid: {
      bankNameTooShort: "The",
      routingNumberTooShort: "12345678",
      accountNumberTooShort: "12345678",
      accountNumberTooLong: "1234567891111",
    },
    expectedErrors: {
      bankNameMissing: "Enter a bank name",
      bankNameLength: "Must contain at least 5 characters",
      routingNumberMissing: "Enter a valid bank routing number",
      routingNumberLength: "Must contain a valid routing number",
      accountNumberMissing: "Enter a valid bank account number",
      accountNumberMinLength: "Must contain at least 9 digits",
      accountNumberMaxLength: "Must contain no more than 12 digits",
    },
  },
  login: {
    invalid: {
      passwordTooShort: "asd",
      wrongPassword: "wrongpassword",
      nonExistingUser: "nonExistingUser",
    },
    expectedErrors: {
      usernameMissing: "Username is required",
      passwordLength: "Password must contain at least 4 characters",
      invalidCredentials: "Username or password is invalid",
    },
  },
  transaction: {
    invalid: {
      amount: "43",
    },
    expectedErrors: {
      amountInvalid: "Please enter a valid amount",
      descriptionMissing: "Please enter a note",
    },
  },
};
