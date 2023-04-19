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
  schemas: CommentSchema;
}

export default class CommentsRouter {
  #router: Router;
  constructor({ router, controller, checkSession, schemaValidator, schemas }: Dependences) {
    this.#router = router;
    const { getComment, getMovieComments, getUserComments, postMovieComment, putComment, deleteComment } = controller;
    const { getOneSchema, getByUserSchema, getByMovieSchema, createSchema } = schemas;

    this.#router
      .get('/comments/user/:userId', checkSession('admin'), schemaValidator(getByUserSchema), getUserComments)

      // .use('/comments', checkSession('user'))
      .get('/comments/movie/:movieId', schemaValidator(getByMovieSchema), getMovieComments)
      .post('/comments/movie/:movieId', checkSession('user'), schemaValidator(createSchema), postMovieComment)

      .get('/comments/one/:_id', checkSession('user'), schemaValidator(getOneSchema), getComment)
      .put('/comments/one/:_id', checkSession('user'), putComment)
      .delete('/comments/one/:_id', checkSession('user'), deleteComment);
  }

  get router(): Router {
    return this.#router;
  }
}
