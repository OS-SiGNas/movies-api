import type { Router, RequestHandler } from 'express';
import type { AnyZodObject } from 'zod';
import type UsersController from './UsersController';
import type { UsersSchema } from '../application/user/UsersSchema';
import type { Rol } from '../domain/User';

interface Dependences {
  router: Router;
  controller: UsersController;
  checkSession: (rol: Rol) => RequestHandler;
  schemaValidator: (schema: AnyZodObject) => RequestHandler;
  userSchemas: UsersSchema;
}

export default class UsersRouter {
  readonly #router: Router;
  readonly #controller: UsersController;
  readonly #checkSession: (rol: Rol) => RequestHandler;
  readonly #validate: (schema: AnyZodObject) => RequestHandler;
  readonly #schemas: UsersSchema;
  constructor({ router, controller, checkSession, schemaValidator, userSchemas }: Dependences) {
    this.#router = router;
    this.#controller = controller;
    this.#checkSession = checkSession;
    this.#validate = schemaValidator;
    this.#schemas = userSchemas;
    // init endpoint
    this.#public();
    this.#user();
    this.#admin();
  }

  readonly #public = (): void => {
    const { auth, register } = this.#controller;
    const { loginSchema, registerSchema } = this.#schemas;
    this.#router.post('/auth', this.#validate(loginSchema), auth);
    this.#router.post('/register', this.#validate(registerSchema), register);
  };

  readonly #user = (): void => {
    const imUser = this.#checkSession('user');
    const { tokenValidator } = this.#controller;
    this.#router.get('/auth', imUser, tokenValidator);
  };

  readonly #admin = (): void => {
    const imAdmin = this.#checkSession('admin');
    const { getUser, getUsers, postUser, putUser, deleteUser } = this.#controller;
    const { getAllSchema, getOneSchema, createSchema, updateSchema, deleteSchema } = this.#schemas;
    this.#router
      .get('/users', imAdmin, this.#validate(getAllSchema), getUsers)
      .get('/users/:_id', imAdmin, this.#validate(getOneSchema), getUser)
      .post('/users', imAdmin, this.#validate(createSchema), postUser)
      .put('/users/:_id', imAdmin, this.#validate(updateSchema), putUser)
      .delete('/users/:_id', imAdmin, this.#validate(deleteSchema), deleteUser);
  };

  get router(): Router {
    return this.#router;
  }
}
