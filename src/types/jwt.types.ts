export interface JwtPayload {
  userId: string;
  email?: string;
  deviceId?: string;
  iat: number;
  exp: number;
}
