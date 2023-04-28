import type { IUser } from './User';

export interface IUserService {
  /** This method returns a single document according to the search parameters
   * @param search -> Uniques user keys like _id, username, email or telf */
  getOneUser: (search: SearchOneUserParams) => Promise<IUser | null>;
  /** This method returns a array documents according to the search parameters
   * @param search -> users keys like name, active, rol */
  getAllUsers: (search: SearchAllUsersParams) => Promise<IUser[]>;
  register: (user: IUser) => Promise<IUser>;
  checkUserAndPassword: (username: string, password: string) => Promise<IUser | null>;
  createUser: (user: IUser) => Promise<IUser>;
  updateUserById: (_id: string, user: IUser) => Promise<IUser | null>;
  deleteUserById: (_id: string) => Promise<IUser | null>;
}
