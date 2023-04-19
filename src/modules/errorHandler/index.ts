import { httpResponse } from '../shared/HttpResponse';

import { type ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log('============ 🪲 ErrorHandler 🪲 ============');
  console.trace({ url: req.url, method: req.method });
  console.log('============   EndErrorHandler  ============');
  httpResponse.error(res, error);
  next();
};
