import type { IMovie } from '../domain/Movie';
import type { IMoviesService, FindMoviesParams, MoviesResponse } from '../domain/IMoviesService';
import type { MoviesModel } from '../domain/MoviesModel';

interface Dependences {
  model: typeof MoviesModel;
}

export default class MongoMoviesRepository implements IMoviesService {
  readonly #model: typeof MoviesModel;
  constructor({ model }: Dependences) {
    this.#model = model;
  }

  public getAllMovies = async ({ offset = 1, limit = 3, name }: FindMoviesParams): Promise<MoviesResponse> => {
    if (typeof limit === 'string') limit = +limit;
    if (typeof offset === 'string') offset = +offset;
    let movies: IMovie[];
    const pagination = { total: 0, offset, limit };
    if (name !== undefined) {
      pagination.total = await this.#model.count({ name });
      movies = await this.#model
        .find({ isApproved: true, name })
        .limit(limit)
        .skip((offset - 1) * limit);
    } else {
      pagination.total = await this.#model.count();
      movies = await this.#model
        .find({ isApproved: true })
        .limit(limit)
        .skip((offset - 1) * limit);
    }

    return { movies, pagination };
  };

  public findMovies = async (query: object): Promise<IMovie[]> => {
    const movies = await this.#model.find(query);
    return movies;
  };

  public getOneMovie = async (_id: string): Promise<IMovie | null> => {
    const movie = await this.#model.findOne({ _id });
    return movie;
  };

  public registerMovie = async (byUser: string, movie: IMovie): Promise<IMovie> => {
    const newMovie = new this.#model({ ...movie, byUser, isApproved: false });
    return await newMovie.save();
  };

  public updateMovie = async (id: string, movie: IMovie): Promise<IMovie | null> => {
    const movieUpdated = await this.#model.findByIdAndUpdate(id, movie, { new: true });
    return movieUpdated;
  };

  public approveMovies = async (movies: string[]): Promise<IMovie[]> => {
    const approvedList = [];
    for (let i = 0; i < movies.length; i++) {
      const element = movies[i];
      const approbed = await this.#model.findByIdAndUpdate(element, { isApproved: true }, { new: true });
      if (approbed !== null) approvedList.push(approbed);
    }
    return approvedList;
  };

  public deleteMovie = async (_id: string): Promise<IMovie | null> => {
    const movieDeleted = await this.#model.findByIdAndDelete(_id);
    return movieDeleted;
  };
}
