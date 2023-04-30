import { Router } from 'express';

import { jwtSecretKey, jwtSignOptions } from '../../server/Settings';
import { schemaValidator } from '../shared/SchemaValidatorMiddleware';
import { httpResponse } from '../shared/HttpResponse';
// infrastructure
import UsersRouter from './infrastructure/UsersRouter';
import UsersController from './infrastructure/UsersController';
// application
import AuthSerice from './application/auth/AuthService';
import AuthMiddleware from './application/auth/AuthMiddleware';
import UsersService from './application/user/MongoUsersRepository';
import { userSchemas } from './application/user/UsersSchema';
// domain
import model from './domain/UsersModel';

const { generateJwt, verifyJwt, comparePassword, encryptPassword } = new AuthSerice(jwtSecretKey, jwtSignOptions);
export const { checkSession } = new AuthMiddleware(httpResponse, verifyJwt);

const service = new UsersService({ model, comparePassword, encryptPassword });
const controller = new UsersController({ httpResponse, service, generateJwt });

// Module User Router
export default new UsersRouter({
  router: Router(),
  controller,
  checkSession,
  schemaValidator,
  userSchemas,
}).router;
