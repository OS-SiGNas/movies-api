import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { Rol } from '../../domain/User';
import type { Payload } from '../types';
import type { IHttpResponse } from '../../../shared/types';

export default class AuthMiddleware {
  readonly #response: IHttpResponse;
  readonly #verifyJwt: (token: string) => Payload;
  constructor(httpResponse: IHttpResponse, verifyJwt: (token: string) => Payload) {
    this.#response = httpResponse;
    this.#verifyJwt = verifyJwt;
  }

  public readonly checkSession =
    (rol: Rol): RequestHandler =>
    (req: Request, res: Response, next: NextFunction): Response | undefined => {
      const { authorization } = req.headers;
      if (authorization === undefined) return this.#response.badRequest(res, 'Missing authorization headers');
      if (!authorization.includes('Bearer ')) return this.#response.badRequest(res, 'Malformed header, use "Bearer token"');
      const token = authorization.split(' ').pop();
      if (token === undefined) return this.#response.badRequest(res, 'Malformed header, use "Bearer token"');
      try {
        const payload = this.#verifyJwt(token);
        if (payload.roles.includes(rol)) {
          req.headers.userId = payload.userId;
          req.headers.userRoles = payload.roles;
          next();
          return undefined;
        } else return this.#response.forbidden(res, `Only ${rol} on this endpoint`);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'JsonWebTokenError') return this.#response.badRequest(res, error);
          if (error.name === 'TokenExpiredError') return this.#response.forbidden(res, error);
        }
        return this.#response.error(res, error);
      }
    };
}

// Payload: _id: string, roles: Rol[], iat: number, exp: number
