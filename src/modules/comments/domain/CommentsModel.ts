import { Prop, getModelForClass } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import type { IComment } from './IComment';

class Comment implements IComment {
  @Prop({ auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  movieId: string;

  @Prop({ required: true })
  byUser: string;

  @Prop({ required: true })
  lasModification: Date;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  score: number;
}

export const CommentsModel = getModelForClass(Comment);
