import type { Types } from 'mongoose';

export interface IComment {
  _id: Types.ObjectId;
  movieId: string;
  byUser: string;
  lasModification: Date;
  score: number;
  content: string;
}
