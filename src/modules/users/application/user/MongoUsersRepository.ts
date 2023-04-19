import type UsersModel from '../../domain/UsersModel';
import type { IUser } from '../../domain/User';
import type { IUserService } from '../../domain/IUsersService';
import type { SearchOneUserParams, SearchAllUsersParams } from '../types';

interface Dependences {
  model: typeof UsersModel;
  comparePassword: (password: string, userMatchedPassword: string) => Promise<boolean>;
  encryptPassword: (password: string) => Promise<string>;
}

export default class MongoUsersRepository implements IUserService {
  readonly #model: typeof UsersModel;
  readonly #comparePassword: (password: string, userMatchedPassword: string) => Promise<boolean>;
  readonly #encryptPassword: (password: string) => Promise<string>;
  constructor({ model, comparePassword, encryptPassword }: Dependences) {
    this.#model = model;
    this.#comparePassword = comparePassword;
    this.#encryptPassword = encryptPassword;
  }

  public checkUserAndPassword = async (username: string, password: string): Promise<IUser | null> => {
    const userMatched = await this.getOneUser({ username });
    if (userMatched === null) return null;
    const equals = await this.#comparePassword(password, userMatched.password);
    if (!equals) return null;
    return userMatched;
  };

  public register = async (user: IUser): Promise<IUser> => {
    const encryptedPassword = await this.#encryptPassword(user.password);
    const newUser = new this.#model({ ...user, password: encryptedPassword, roles: ['user'], active: false });
    return await newUser.save();
  };

  public getOneUser = async (search: SearchOneUserParams): Promise<IUser | null> => {
    const user = await this.#model.findOne({ ...search });
    return user;
  };

  public getAllUsers = async (search: SearchAllUsersParams): Promise<IUser[]> => {
    const users = await this.#model.find({ ...search });
    return users;
  };

  public createUser = async (user: IUser): Promise<IUser> => {
    const encryptedPassword = await this.#encryptPassword(user.password);
    const newUser = new this.#model({ ...user, password: encryptedPassword });
    const userSaved = await newUser.save();
    return userSaved;
  };

  public updateUserById = async (_id: string, user: IUser): Promise<IUser | null> => {
    if (user.password !== undefined) {
      user.password = await this.#encryptPassword(user.password);
    }
    const userUpdated = await this.#model.findByIdAndUpdate(_id, user, { new: true });
    return userUpdated;
  };

  public deleteUserById = async (_id: string): Promise<IUser | null> => {
    return await this.#model.findByIdAndDelete(_id);
  };
}
