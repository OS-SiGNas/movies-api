import { environment } from '../../server/Settings';

import type { Response } from 'express';
import type { IHttpResponse } from './types';
import type { Environment } from '../../server/types';

interface Status {
  status: number;
  message: string;
}

interface Pagination {
  cursor?: number;
  offset?: number;
  limit: number;
}

class HttpResponse implements IHttpResponse {
  readonly #debug: boolean;
  readonly #OK: Status = { status: 200, message: 'Success 👌' };
  readonly #CREATED: Status = { status: 201, message: 'Created 👌' };
  readonly #BAD_REQUEST: Status = { status: 400, message: 'Bad Request 🤦' };
  readonly #UNAUTHORIZED: Status = { status: 401, message: 'Unauthorized 🤖🔒' };
  readonly #FORBIDDEN: Status = { status: 403, message: '🔒 Forbidden 🔒' };
  readonly #NOT_FOUND: Status = { status: 404, message: 'Resourse Not Found 😕' };
  readonly #UNPROCESABLE: Status = { status: 422, message: 'Unprocessable Content 😕 please fix and try again' };
  readonly #INTERNAL_SERVER_ERROR: Status = { status: 500, message: 'Internal Server Error 🚑' };
  // readonly #PAYMENT_REQUIRED: Status = { status: 402, message: 'Payment Required 🤌💳' };
  // readonly #GONE: Status = { status: 410, message: 'Access to the target resource is no longer available' };
  // readonly #LEGAL_UNAVAILABLE: Status = { status: 451, message: 'Unavailable For Legal Reasons' };
  // readonly #UNAVAILABLE: Status = { status: 503, message: 'Service Unavailable ⏳ try later' };
  // readonly #TIMEOUT: Status = {status:504, message:'Gateway Timeout ⌛'}
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
    const { status, message } = this.#CREATED;
    return res.status(status).json({ status, message, data });
  };

  /** Use this method for status Bad Request:400 */
  public badRequest = (res: Response, error?: object | string): Response => {
    this.#logger(error);
    const { status, message } = this.#BAD_REQUEST;
    return res.status(status).json({ status, message, error });
  };

  /** Use this method for status Unauthorized:401 */
  public unauthorized = (res: Response, error?: string): Response => {
    this.#logger(error);
    const { status, message } = this.#UNAUTHORIZED;
    return res.status(status).json({ status, message, error });
  };

  /** Use this method for status Forbidden:403 */
  public forbidden = (res: Response, error?: object | string): Response => {
    this.#logger(error);
    const { status, message } = this.#FORBIDDEN;
    return res.status(status).json({ status, message, error });
  };

  /** Use this method for status notFound:404 */
  public notFound = (res: Response, error?: string): Response => {
    this.#logger(error);
    const { status, message } = this.#NOT_FOUND;
    return res.status(status).json({ status, message, error });
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
