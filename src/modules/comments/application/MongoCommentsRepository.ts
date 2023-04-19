import type { ICommentsService } from '../domain/ICommentsService';
import type { CommentsModel } from '../domain/CommentsModel';
import type { IComment } from '../domain/IComment';

interface Dependences {
  model: typeof CommentsModel;
  ratingCalculator: (comments: IComment[]) => number;
}

export default class MongoCommentsRepository implements ICommentsService {
  #model: typeof CommentsModel;
  #ratingCalculator: (comments: IComment[]) => number;
  constructor({ model, ratingCalculator }: Dependences) {
    this.#model = model;
    this.#ratingCalculator = ratingCalculator;
  }

  public getOneComment = async (_id: string): Promise<IComment | null> => {
    return await this.#model.findOne({ _id });
  };

  public findUserComments = async (userId: string): Promise<IComment[]> => {
    const comments = await this.#model.find({ byUser: userId });
    return comments;
  };

  public findMovieComments = async (movieId: string): Promise<{ rating: number; comments: IComment[] }> => {
    const comments = await this.#model.find({ movieId });
    const rating = this.#ratingCalculator(comments);
    return { rating, comments };
  };

  public createComment = async (movieId: string, byUser: string, comment: IComment): Promise<IComment> => {
    const newComment = new this.#model({ ...comment, movieId, byUser, lasModification: new Date() });
    return await newComment.save();
  };

  public updateComment = async (_id: string, comment: IComment): Promise<IComment | null> => {
    return await this.#model.findByIdAndUpdate(_id, comment);
  };

  public deleteComment = async (_id: string): Promise<IComment | null> => {
    return await this.#model.findByIdAndDelete(_id);
  };
}
