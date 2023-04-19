export interface IAuthService {
  generateJwt: (userId: string, roles: Rol[]) => string;
  verifyJwt: (token: string) => Payload;
  encryptPassword: (password: string) => Promise<string>;
  comparePassword: (password: string, receivedPassword: string) => Promise<boolean>;
}
