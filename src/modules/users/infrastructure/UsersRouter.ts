import type { Router, RequestHandler } from 'express';
import type { AnyZodObject } from 'zod';
import type UsersController from './UsersController';
import type { UsersSchema } from '../application/user/UsersSchema';
import type { Rol } from '../domain/User';

interface Dependences {
  router: Router;
  controller: UsersController;
  checkSession: (arg: Rol) => RequestHandler;
  schemaValidator: (arg: AnyZodObject) => RequestHandler;
  usersSchema: UsersSchema;
}

export default class UsersRouter {
  readonly #router: Router;
  constructor({ router, controller, checkSession, schemaValidator, usersSchema }: Dependences) {
    const { auth, getUsers, getUser, postUser, putUser, deleteUser, tokenValidator } = controller;
    const { loginSchema, getOneSchema, getAllSchema, createSchema, updateSchema, deleteSchema } = usersSchema;

    this.#router = router;

    this.#router
      .post('/auth', schemaValidator(loginSchema), auth)
      .get('/auth', checkSession('user'), tokenValidator)

      // => Protected routes with middleware
      .use('/users', checkSession('admin'))

      .get('/users', schemaValidator(getAllSchema), getUsers)
      .get('/users/:_id', schemaValidator(getOneSchema), getUser)
      .post('/users', schemaValidator(createSchema), postUser)
      .put('/users/:_id', schemaValidator(updateSchema), putUser)
      .delete('/users/:_id', schemaValidator(deleteSchema), deleteUser);
  }

  get router(): Router {
    return this.#router;
  }
}
