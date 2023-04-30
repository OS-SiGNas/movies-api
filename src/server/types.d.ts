import type { SignOptions } from 'jsonwebtoken';

type Environment = 'dev' | 'test' | 'prod';
export interface ISettings {
  environment: Environment;
  port: number;
  dbUri: string;
  jwtSecretKey: string;
  jwtSignOptions: SignOptions;
  testUserData: { username: string; password: string } | undefined;
  testAdminData: { username: string; password: string } | undefined;
}

export interface IServer {
  run: () => Promise<void>;
}

export interface DatabaseHandler {
  connect: () => Promise<void>;
}
