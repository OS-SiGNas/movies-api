import { Router } from 'express';
import { checkSession } from '../users/index';
import { httpResponse } from '../shared/HttpResponse';
import { schemaValidator } from '../shared/SchemaValidatorMiddleware';
// infrastructure
import CommentsRouter from './infrastructure/CommentsRouter';
import CommentsController from './infrastructure/CommentsController';
// application
import CommentsSerice from './application/MongoCommentsRepository';
import { ratingCalculator } from './application/ratingCalculator';
import { commentsSchema as schemas } from './application/CommentsSchema';
// domain
import { CommentsModel as model } from './domain/CommentsModel';

const service = new CommentsSerice({ model, ratingCalculator });
const controller = new CommentsController({ httpResponse, service });

export default new CommentsRouter({ router: Router(), controller, checkSession, schemaValidator, schemas }).router;
