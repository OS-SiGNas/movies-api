import type { Response } from 'express';

export interface IHttpResponse {
  ok: (res: Response, data?: object, pagination?: Pagination) => Response;
  created: (res: Response, data?: object) => Response;
  badRequest: (res: Response, error?: object | string) => Response;
  unauthorized: (res: Response, error?: string) => Response;
  forbidden: (res: Response, error?: object | string) => Response;
  notFound: (res: Response, error?: string) => Response;
  unprocessable: (res: Response, error: object) => Response;
  error: (res: Response, error: unknown) => Response;
}
