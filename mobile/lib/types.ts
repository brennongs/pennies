export interface User {
  id: string;
  username: string;
  sessionId: string;
  balance: number;
}

export interface Transaction {
  message: string;
  sessionId: string;
}