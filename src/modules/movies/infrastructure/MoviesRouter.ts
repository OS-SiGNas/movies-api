import type { Router, RequestHandler } from 'express';
import type { AnyZodObject } from 'zod';
import type { MovieSchema } from '../application/MovieSchema';
import type { Rol } from '../../users/domain/User';
import type MoviesController from './MoviesController';

interface Dependences {
  router: Router;
  controller: MoviesController;
  checkSession: (rol: Rol) => RequestHandler;
  schemaValidator: (schema: AnyZodObject) => RequestHandler;
  movieSchemas: MovieSchema;
}

export default class MoviesRouter {
  readonly #router: Router;
  readonly #controller: MoviesController;
  readonly #checkSession: (rol: Rol) => RequestHandler;
  readonly #validate: (schema: AnyZodObject) => RequestHandler;
  readonly #schemas: MovieSchema;
  constructor({ router, controller, checkSession, schemaValidator, movieSchemas }: Dependences) {
    this.#router = router;
    this.#controller = controller;
    this.#checkSession = checkSession;
    this.#validate = schemaValidator;
    this.#schemas = movieSchemas;
    // init endpoints
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
    const imUser = this.#checkSession('user');
    const { postMovie, putMovie, deleteMovie } = this.#controller;
    const { createSchema, deleteSchema } = this.#schemas;
    this.#router
      .post('/movies/one', imUser, this.#validate(createSchema), postMovie)
      .put('/movies/one/:_id', imUser, putMovie)
      .delete('/movies/one/:_id', imUser, this.#validate(deleteSchema), deleteMovie);
  };

  readonly #admin = (): void => {
    const imAdmin = this.#checkSession('admin');
    const { getNotApprovedMovies, putApproveMovies } = this.#controller;
    const { aproveSchema } = this.#schemas;
    this.#router
      .get('/movies/notapproved', imAdmin, getNotApprovedMovies)
      .put('/movies/notapproved', imAdmin, this.#validate(aproveSchema), putApproveMovies);
    // .get('/movies/user/:_id', isAdmin, getUserMovies)
  };

  get router(): Router {
    return this.#router;
  }
}

/*
   this.#router.post('/movies/one', checkSession('user'), schemaValidator(createSchema), postMovie);
   this.#router.put('/movies/one/:_id', checkSession('user'), putMovie);
   this.#router.delete('/movies/one/:_id', checkSession('user'), schemaValidator(deleteSchema), deleteMovie); */
