import type { IComment } from './IComment';

export interface ICommentsService {
  getOneComment: (_id: string) => Promise<IComment | null>;
  findUserComments: (userId: string) => Promise<IComment[]>;
  findMovieComments: (movieId: string) => Promise<{ rating: number; comments: IComment[] }>;
  createComment: (movieId: string, byUser: string, comment: IComment) => Promise<IComment>;
  updateComment: (_id: string, comment: IComment) => Promise<IComment | null>;
  deleteComment: (_id: string) => Promise<IComment | null>;
}
