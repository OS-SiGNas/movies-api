import type { IMovie } from './Movie';

export interface FindMoviesParams {
  offset?: number;
  limit?: number;
  name?: string | null;
}

export interface MoviesResponse {
  pagination: { limit: number; offset: number; total: number };
  movies: IMovie[];
}

export interface IMoviesService {
  getAllMovies: (query: FindMoviesParams) => Promise<MoviesResponse>;
  findMovies: (query: object) => Promise<IMovie[]>;
  getOneMovie: (id: string) => Promise<IMovie | null>;
  registerMovie: (byUser: string, movie: IMovie) => Promise<IMovie>;
  updateMovie: (id: string, movie: Imovie) => Promise<IMovie | null>;
  approveMovies: (movies: string[]) => Promise<IMovie[]>;
  deleteMovie: (id: string) => Promise<IMovie | null>;
}
