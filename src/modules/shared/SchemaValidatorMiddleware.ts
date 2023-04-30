import { ZodError } from 'zod';
import { httpResponse } from './HttpResponse';

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { AnyZodObject } from 'zod';
import type { IHttpResponse } from './types';

class ValidatorMiddleware {
  #response: IHttpResponse;
  constructor(httpResponse: IHttpResponse) {
    this.#response = httpResponse;
  }

  public schemaValidator =
    (schema: AnyZodObject): RequestHandler =>
    (req: Request, res: Response, next: NextFunction): undefined | Response => {
      const { body, params, query } = req;
      try {
        schema.parse({ body, params, query });
        next();
        return undefined;
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.issues.map((issues) => ({
            errorType: issues.code,
            message: issues.message,
            path: issues.path,
          }));
          return this.#response.unprocessable(res, errors);
        }
        return this.#response.error(res, error);
      }
    };
}

export const { schemaValidator } = new ValidatorMiddleware(httpResponse);
