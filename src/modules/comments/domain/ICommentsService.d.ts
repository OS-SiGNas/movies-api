import type { IComment } from './IComment';

export interface FindMovieCommentsParams {
  limit?: number;
  cursor?: string;
  movieId?: string;
}

/*
interface Pagination {
  hasMore: boolean;
  nextCursor: string;
}

interface findMovieCommentsResponse {
  pagination: Pagination;
  rating: number;
  comments: IComment[];
}
*/

export interface ICommentsService {
  getOneComment: (_id: string) => Promise<IComment | null>;
  findUserComments: (userId: string) => Promise<IComment[]>;
  // findMovieComments: (query: FindMovieCommentsParams) => Promise<findMovieCommentsResponse>;
  findMovieComments: (movieId: string) => Promise<{ rating: number; comments: IComment[] }>;
  createComment: (movieId: string, byUser: string, comment: IComment) => Promise<IComment>;
  updateComment: (_id: string, comment: IComment) => Promise<IComment | null>;
  deleteComment: (_id: string) => Promise<IComment | null>;
}
