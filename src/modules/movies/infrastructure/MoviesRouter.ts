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
  movieSchemas: MovieSchema;
}

export default class MoviesRouter {
  readonly #router: Router;
  readonly #controller: MoviesController;
  readonly #checkSession: (arg: Rol) => RequestHandler;
  readonly #validate: (arg: AnyZodObject) => RequestHandler;
  readonly #schemas: MovieSchema;
  constructor({ router, controller, checkSession, schemaValidator, movieSchemas }: Dependences) {
    this.#router = router;
    this.#controller = controller;
    this.#checkSession = checkSession;
    this.#validate = schemaValidator;
    this.#schemas = movieSchemas;

    this.#public();
    this.#user();
    this.#admin();
  }

  readonly #public = (): void => {
    const { getMovies, getMovie } = this.#controller;
    const { getAllSchema, getOneschema } = this.#schemas;
    this.#router
      .get('/movies/all', this.#validate(getAllSchema), getMovies) // TODO cache
      .get('/movies/detail/:_id', this.#validate(getOneschema), getMovie); // TODO cache
  };

  readonly #user = (): void => {
    const { postMovie, putMovie, deleteMovie } = this.#controller;
    const { createSchema, deleteSchema } = this.#schemas;
    const imUser = this.#checkSession('user');
    this.#router
      .post('/movies/one', imUser, this.#validate(createSchema), postMovie)
      .put('/movies/one/:_id', imUser, putMovie)
      .delete('/movies/one/:_id', imUser, this.#validate(deleteSchema), deleteMovie);
  };

  readonly #admin = (): void => {
    const { getNotApprovedMovies, putApproveMovies } = this.#controller;
    const { aproveSchema } = this.#schemas;
    const imAdmin = this.#checkSession('admin');
    this.#router
      // .get('/movies/user/:_id', isAdmin, getUserMovies)
      .get('/movies/notapproved', imAdmin, getNotApprovedMovies)
      .put('/movies/notapproved', imAdmin, this.#validate(aproveSchema), putApproveMovies);
  };

  get router(): Router {
    return this.#router;
  }
}

/*
   this.#router.post('/movies/one', checkSession('user'), schemaValidator(createSchema), postMovie);
   this.#router.put('/movies/one/:_id', checkSession('user'), putMovie);
   this.#router.delete('/movies/one/:_id', checkSession('user'), schemaValidator(deleteSchema), deleteMovie); */
