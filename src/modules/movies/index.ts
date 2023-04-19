import { Router } from 'express';
import { checkSession } from '../users/index';
import { httpResponse } from '../shared/HttpResponse';
import { schemaValidator } from '../shared/SchemaValidatorMiddleware';
// infrastructure
import MoviesRouter from './infrastructure/MoviesRouter';
import MoviesController from './infrastructure/MoviesController';
import MoviesService from './application/MongoMoviesRepository';
// application
import { movieSchema as schemas } from './application/MovieSchema';
// domain
import { MoviesModel } from './domain/MoviesModel';

const service = new MoviesService({ model: MoviesModel });
const controller = new MoviesController({ httpResponse, service });

export default new MoviesRouter({ router: Router(), controller, checkSession, schemaValidator, schemas }).router;
