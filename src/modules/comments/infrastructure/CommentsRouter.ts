import type { Router, RequestHandler } from 'express';
import type { AnyZodObject } from 'zod';
import type CommentsController from './CommentsController';
import type { CommentSchema } from '../application/CommentsSchema';
import type { Rol } from '../../users/domain/User';

interface Dependences {
  router: Router;
  controller: CommentsController;
  checkSession: (arg: Rol) => RequestHandler;
  schemaValidator: (arg: AnyZodObject) => RequestHandler;
  commentSchemas: CommentSchema;
}

export default class CommentsRouter {
  readonly #router: Router;
  readonly #controller: CommentsController;
  readonly #checkSession: (arg: Rol) => RequestHandler;
  readonly #validate: (arg: AnyZodObject) => RequestHandler;
  readonly #schemas: CommentSchema;
  constructor({ router, controller, checkSession, schemaValidator, commentSchemas }: Dependences) {
    this.#router = router;
    this.#controller = controller;
    this.#checkSession = checkSession;
    this.#validate = schemaValidator;
    this.#schemas = commentSchemas;

    this.#public();
    this.#user();
    this.#admin();
  }

  readonly #public = (): void => {
    const { getMovieComments } = this.#controller;
    const { getByMovieSchema } = this.#schemas;
    this.#router.get('/comments/movie/:movieId', this.#validate(getByMovieSchema), getMovieComments);
    // .use('/comments', checkSession('user'))
  };

  readonly #user = (): void => {
    const { getComment, putComment, deleteComment, postMovieComment } = this.#controller;
    const { getOneSchema, createSchema } = this.#schemas;
    const imUser = this.#checkSession('user');
    this.#router
      .get('/comments/one/:_id', imUser, this.#validate(getOneSchema), getComment)
      .put('/comments/one/:_id', imUser, putComment)
      .delete('/comments/one/:_id', imUser, deleteComment)
      .post('/comments/movie/:movieId', imUser, this.#validate(createSchema), postMovieComment);
  };

  readonly #admin = (): void => {
    const { getUserComments } = this.#controller;
    const { getByUserSchema } = this.#schemas;
    const imAdmin = this.#checkSession('admin');
    this.#router.get('/comments/user/:userId', imAdmin, this.#validate(getByUserSchema), getUserComments);
  };

  get router(): Router {
    return this.#router;
  }
}
