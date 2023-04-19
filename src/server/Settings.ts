import dotenv from 'dotenv';

import type { SignOptions } from 'jsonwebtoken';
import type { Environment, ISettings } from './types';

dotenv.config();

class Settings implements ISettings {
  readonly #environment: Environment | undefined;
  readonly #port: string | undefined;
  readonly #mongoUriHeader: string | undefined;
  readonly #mongoCluster: string | undefined;
  readonly #secretKey: string | undefined;
  readonly #usernameTestUser: string | undefined;
  readonly #passwordTestUser: string | undefined;
  readonly #usernameTestAdmin: string | undefined;
  readonly #passwordTestAdmin: string | undefined;
  constructor(env: NodeJS.ProcessEnv) {
    // console.log('===============config===============')
    this.#environment = env.NODE_ENV as Environment | undefined;
    this.#port = env.PORT;
    this.#mongoUriHeader = env.MONGO_URI_HEADER;
    this.#mongoCluster = env.MONGO_CLUSTER;
    this.#secretKey = env.JWT_SECRET;
    this.#usernameTestUser = env.USER_TEST_USERNAME;
    this.#passwordTestUser = env.USER_TEST_PASSWORD;
    this.#usernameTestAdmin = env.ADMIN_TEST_USERNAME;
    this.#passwordTestAdmin = env.ADMIN_TEST_PASSWORD;
  }

  get environment(): Environment {
    if (this.#environment === undefined) throw new Error('NODE_ENV is undefined');
    return this.#environment;
  }

  get port(): number {
    if (this.#port === undefined) return 0;
    return +this.#port;
  }

  get dbUri(): string {
    if (this.#mongoUriHeader === undefined) throw new Error('undefined MONGO_URI_HEADER in .env');
    if (this.#mongoCluster === undefined) throw new Error('undefined MONGO_CLUSTER in .env');
    return `${this.#mongoUriHeader}${this.#mongoCluster}`;
  }

  get jwtSecretKey(): string {
    if (this.#secretKey === undefined) throw new Error('undefined JWT_SECRET in .env');
    return this.#secretKey;
  }

  get jwtSignOptions(): SignOptions {
    return {
      expiresIn: 3600,
    };
  }

  get testUserData(): { username: string; password: string } | undefined {
    // if (this.#environment !== 'test') throw new Error('testUserData is only available in test mode');
    if (this.#environment !== 'test') return undefined;
    if (this.#usernameTestUser === undefined) throw new Error('undefined USER_TEST_USERNAME in .env');
    if (this.#passwordTestUser === undefined) throw new Error('undefined USER_TEST_PASSWORD in .env');
    return {
      username: this.#usernameTestUser,
      password: this.#passwordTestUser,
    };
  }

  get testAdminData(): { username: string; password: string } | undefined {
    // if (this.#environment !== 'test') throw new Error('testUserData is only available in test mode');
    if (this.#environment !== 'test') return undefined;
    if (this.#usernameTestAdmin === undefined) throw new Error('undefined ADMIN_TEST_USERNAME in .env');
    if (this.#passwordTestAdmin === undefined) throw new Error('undefined ADMIN_TEST_PASSWORD in .env');
    return {
      username: this.#usernameTestAdmin,
      password: this.#passwordTestAdmin,
    };
  }
}

export const { environment, port, dbUri, jwtSecretKey, jwtSignOptions, testUserData, testAdminData } = new Settings(
  process.env
);
