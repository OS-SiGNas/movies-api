import type { Request, Response } from 'express';
import type { IHttpResponse } from '../../shared/types';
import type { IMoviesService } from '../domain/IMoviesService';

interface Dependences {
  httpResponse: IHttpResponse;
  service: IMoviesService;
}

export default class MoviesController {
  #response: IHttpResponse;
  #service: IMoviesService;
  constructor({ httpResponse, service }: Dependences) {
    this.#response = httpResponse;
    this.#service = service;
  }

  public getMovie = async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;
    try {
      const movie = await this.#service.getOneMovie(_id);
      if (movie === null) return this.#response.notFound(res, `not found movie with id: ${_id}`);
      return this.#response.ok(res, movie);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public getMovies = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { movies, pagination } = await this.#service.getAllMovies(req.query);
      if (movies === null) return this.#response.notFound(res);
      return this.#response.ok(res, movies, pagination);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public getNotApprovedMovies = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const movies = await this.#service.findMovies({ isApproved: false });
      return this.#response.ok(res, movies);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public postMovie = async (req: Request, res: Response): Promise<Response> => {
    const byUser = req.headers.userId as string;
    try {
      const movieRegistered = await this.#service.registerMovie(byUser, req.body);
      return this.#response.ok(res, movieRegistered);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public putMovie = async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;
    try {
      const movieUpdated = await this.#service.updateMovie(_id, req.body);
      if (movieUpdated === null) return this.#response.notFound(res, `not found movie with id: ${_id}`);
      return this.#response.ok(res, movieUpdated);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public putNotApprovedMovies = async (req: Request, res: Response): Promise<Response> => {
    try {
      const aproved = await this.#service.approveMovies(req.body);
      return this.#response.ok(res, aproved);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public deleteMovie = async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;
    try {
      const movieDeleted = await this.#service.deleteMovie(_id);
      if (movieDeleted === null) return this.#response.notFound(res, `not found movie with id: ${_id}`);
      return res.sendStatus(204);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };
}
