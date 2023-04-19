import { prop, getModelForClass } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import type { Rol, IUser } from './User';

class User implements IUser {
  // =>
  @prop({ auto: true })
  _id: Types.ObjectId;

  @prop({ required: true, unique: true })
  username: string;

  @prop({ required: true, minlength: 8 })
  password: string;

  @prop({ required: true, trim: true, unique: true })
  email: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  telf: string;

  @prop({ required: true, default: false })
  active: boolean;

  @prop({ type: String, required: true, default: [] })
  roles: Types.Array<Rol>;
}

const UsersModel = getModelForClass(User);
export default UsersModel;
