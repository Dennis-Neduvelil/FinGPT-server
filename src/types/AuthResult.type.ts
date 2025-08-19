export type AuthResult = Promise<{
  userId: string;
  accessToken: string;
}>;
