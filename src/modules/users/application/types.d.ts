import type { JwtPayload } from 'jsonwebtoken';

export interface Payload extends JwtPayload {
  userId: string;
  roles: Rol[];
}

export interface SearchOneUserParams {
  _id?: string;
  username?: string;
  email?: string;
  telf?: string;
}

export interface SearchAllUsersParams {
  name?: string;
  active?: string;
  rol?: Rol;
}
