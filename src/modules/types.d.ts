import type { RequestHandler, ErrorRequestHandler } from 'express';

export type Modules = Array<RequestHandler | ErrorRequestHandler>;
