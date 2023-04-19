import { sign, verify } from 'jsonwebtoken';
import { compare, genSalt, hash } from 'bcryptjs';

import type { SignOptions } from 'jsonwebtoken';
import type { Payload } from '../types';
import type { Rol } from '../../../users/domain/User';
import type { IAuthService } from '../../../users/domain/IAuthService';

export default class AuthSerice implements IAuthService {
  readonly #secretKey: string;
  readonly #options: SignOptions;
  constructor(secretKey: string, options: SignOptions) {
    this.#secretKey = secretKey;
    this.#options = options;
  }

  public readonly generateJwt = (userId: string, roles: Rol[]): string => {
    return sign({ userId, roles }, this.#secretKey, this.#options);
  };

  public readonly verifyJwt = (token: string): Payload => {
    //                    ->                          Payload type extends JwtPayload
    const payload = verify(token, this.#secretKey) as Payload | string;
    if (typeof payload === 'string') throw new Error('Verify token failed');
    return payload;
  };

  public readonly encryptPassword = async (password: string): Promise<string> => {
    const salt = await genSalt(10);
    return await hash(password, salt);
  };

  public readonly comparePassword = async (password: string, receivedPassword: string): Promise<boolean> => {
    return await compare(password, receivedPassword);
  };
}
