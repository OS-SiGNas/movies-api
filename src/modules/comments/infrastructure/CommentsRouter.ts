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
      // .use('/comment', checkSession('user'))
      .get('comment/movie/:movieId', schemaValidator(getByMovieSchema), getMovieComments)
      .post('comment/movie/:movieId', checkSession('user'), schemaValidator(createSchema), postMovieComment)
      .get('/comment/user/:userId', checkSession('admin'), schemaValidator(getByUserSchema), getUserComments)

      .get('/comment/one/:_id', checkSession('user'), schemaValidator(getOneSchema), getComment)
      .put('/comment/one/:_id', checkSession('user'), putComment)
      .delete('/comment/one/:_id', checkSession('user'), deleteComment);
  }

  get router(): Router {
    return this.#router;
  }
}
