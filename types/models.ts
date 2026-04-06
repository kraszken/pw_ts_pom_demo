export interface User {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  defaultPrivacyLevel: string;
  balance: number;
  createdAt: string;
  modifiedAt: string;
}

export interface Transaction {
  id: string;
  uuid: string;
  source: string;
  amount: number;
  description: string;
  receiverId: string;
  senderId: string;
  privacyLevel: string;
  status: string;
  requestStatus: string;
  createdAt: string;
  modifiedAt: string;
}
