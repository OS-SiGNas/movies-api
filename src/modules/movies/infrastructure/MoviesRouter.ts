import type { Router, RequestHandler } from 'express';
import type { AnyZodObject } from 'zod';
import type { MovieSchema } from '../application/MovieSchema';
import type { Rol } from '../../users/domain/User';
import type MoviesController from './MoviesController';

interface Dependences {
  router: Router;
  controller: MoviesController;
  checkSession: (arg: Rol) => RequestHandler;
  schemaValidator: (arg: AnyZodObject) => RequestHandler;
  schemas: MovieSchema;
}
export default class MoviesRouter {
  readonly #router: Router;
  constructor({ router, controller, checkSession, schemaValidator, schemas }: Dependences) {
    this.#router = router;

    const { getMovie, getMovies, getNotApprovedMovies, postMovie, putMovie, putNotApprovedMovies, deleteMovie } =
      controller;

    const { getAllSchema, getOneschema, createSchema, aproveSchema, deleteSchema } = schemas;

    this.#router.get('/movies/all', schemaValidator(getAllSchema), getMovies); // TODO cache
    this.#router.get('/movies/one/:_id', schemaValidator(getOneschema), getMovie); // TODO cache

    this.#router.post('/movies/one', checkSession('user'), schemaValidator(createSchema), postMovie);
    this.#router.put('/movies/one/:_id', checkSession('user'), putMovie);
    this.#router.delete('/movies/one/:_id', checkSession('user'), schemaValidator(deleteSchema), deleteMovie);

    // this.#router.get('/movies/user/:_id', checkSession('admin'), getUserMovies);
    this.#router.get('/movies/notapproved', checkSession('admin'), getNotApprovedMovies);
    this.#router.put('/movies/notapproved', checkSession('admin'), schemaValidator(aproveSchema), putNotApprovedMovies);
  }

  get router(): Router {
    return this.#router;
  }
}
