import { prop, getModelForClass } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import type { IMovie } from './Movie';

class Movie implements IMovie {
  @prop({ auto: true })
  _id: Types.ObjectId;

  @prop({ required: true })
  byUser: string;

  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: false })
  average: number;

  @prop({ auto: true })
  isApproved: boolean;
}

export const MoviesModel = getModelForClass(Movie);
