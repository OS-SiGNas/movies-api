import type { Types } from 'mongoose';

export interface IMovie {
  _id: Types.ObjectId;
  byUser: string;
  name: string;
  isApproved: boolean;
}
