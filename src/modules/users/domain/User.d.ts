export type Rol = 'admin' | 'user';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  name: string;
  telf: string;
  active: boolean;
  roles: Array<Rol>;
}
