import { environment } from '../../server/Settings';

import type { Response } from 'express';
import type { Environment } from '../../server/types';
import type { IHttpResponse } from './types';

interface Status {
  status: number;
  message: string;
}

interface Pagination {
  offset: number;
  limit: number;
}

class HttpResponse implements IHttpResponse {
  readonly #OK: Status = { status: 200, message: 'Success 👌' };
  readonly #CREATED: Status = { status: 201, message: 'Created 👌' };
  readonly #BAD_REQUEST: Status = { status: 400, message: 'Bad Request 🤦' };
  readonly #UNAUTHORIZED: Status = { status: 401, message: 'Unauthorized 🤖🔒' };
  // readonly #PAYMENT_REQUIRED: Status = { status: 402, message: 'Payment Required 🤌💳' };
  readonly #FORBIDDEN: Status = { status: 403, message: '🔒 Forbidden 🔒' };
  readonly #NOT_FOUND: Status = { status: 404, message: 'Resourse Not Found 😕' };
  // readonly #GONE: Status = { status: 410, message: 'Access to the target resource is no longer available' };
  readonly #UNPROCESABLE: Status = { status: 422, message: 'Unprocessable Content 😕 please fix and try again' };
  // readonly #LEGAL_UNAVAILABLE: Status = { status: 451, message: 'Unavailable For Legal Reasons' };
  readonly #INTERNAL_SERVER_ERROR: Status = { status: 500, message: 'Internal Server Error 🚑' };
  // readonly #UNAVAILABLE: Status = { status: 503, message: 'Service Unavailable ⏳ try later' };
  // readonly #TIMEOUT: Status = {status:504, message:'Gateway Timeout ⌛'}
  readonly #debug: boolean;
  constructor(env: Environment) {
    this.#debug = env === 'dev';
  }

  readonly #logger = (data: unknown): void => {
    if (this.#debug && data !== undefined) {
      console.log('======================  🕵️ logger  ======================');
      console.trace(data);
      console.log('====================== end logger ======================');
    }
  };

  /** Use this method for status Ok:200 */
  public ok = (res: Response, data?: object, pagination?: Pagination): Response => {
    this.#logger(data);
    const { status, message } = this.#OK;
    return res.status(status).json({ status, message, pagination, data });
  };

  /** Use this method for status Created:201 */
  public created = (res: Response, data?: object): Response => {
    this.#logger(data);
    res.status(201);
    return res.json({ ...this.#CREATED, data });
  };

  /** Use this method for status Bad Request:400 */
  public badRequest = (res: Response, error?: object | string): Response => {
    this.#logger(error);
    res.status(400);
    return res.json({ ...this.#BAD_REQUEST, error });
  };

  /** Use this method for status Unauthorized:401 */
  public unauthorized = (res: Response, error?: string): Response => {
    this.#logger(error);
    res.status(401);
    return res.json({ ...this.#UNAUTHORIZED, error });
  };

  /** Use this method for status Forbidden:403 */
  public forbidden = (res: Response, error?: object | string): Response => {
    this.#logger(error);
    res.status(403);
    return res.json({ ...this.#FORBIDDEN, error });
  };

  /** Use this method for status notFound:404 */
  public notFound = (res: Response, error?: string): Response => {
    this.#logger(error);
    res.status(404);
    return res.json({ ...this.#NOT_FOUND, error });
  };

  /** Use this method for status Unprocessable Content:422 */
  public unprocessable = (res: Response, error: object): Response => {
    this.#logger(error);
    const { status, message } = this.#UNPROCESABLE;
    return res.status(status).json({ status, message, error });
  };

  /** Use this method for handling errors status:500+ */
  public error = (res: Response, error: unknown): Response => {
    this.#logger(error);
    const { status, message } = this.#INTERNAL_SERVER_ERROR;
    return res.status(status).json({ status, message, error: String(error) });
  };
}

export const httpResponse = new HttpResponse(environment);
