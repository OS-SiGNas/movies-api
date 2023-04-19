import type { Request, Response } from 'express';
import type { IHttpResponse } from '../../shared/types';
import type { IUserService } from '../domain/IUsersService';
import type { Rol } from '../domain/User';

interface Dependences {
  httpResponse: IHttpResponse;
  service: IUserService;
  generateJwt: (userId: string, roles: Rol[]) => string;
}

export default class UsersController {
  readonly #response: IHttpResponse;
  readonly #service: IUserService;
  readonly #generateJwt: (userId: string, roles: Rol[]) => string;
  constructor({ httpResponse, service, generateJwt }: Dependences) {
    this.#response = httpResponse;
    this.#service = service;
    this.#generateJwt = generateJwt;
  }

  public auth = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;
    try {
      const user = await this.#service.checkUserAndPassword(username, password);
      if (user === null) return this.#response.unauthorized(res, 'Username or password is incorrect');
      const { _id, email, name, roles, telf } = user;
      const token = this.#generateJwt(_id, roles);
      return this.#response.ok(res, { token, _id, email, username, name, roles, telf });
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const newRegister = await this.#service.register(req.body);
      return this.#response.ok(res, newRegister);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public getUser = async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;
    try {
      const user = await this.#service.getOneUser({ _id });
      if (user === null) return this.#response.notFound(res);
      return this.#response.ok(res, user);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      // TODO validate req.query with zod and testrunner
      const users = await this.#service.getAllUsers({ ...req.query });
      return this.#response.ok(res, users);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public postUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userCreated = await this.#service.createUser(req.body);
      return this.#response.created(res, userCreated);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public putUser = async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;
    try {
      const user = await this.#service.updateUserById(_id, req.body);
      if (user === null) return this.#response.notFound(res, `No user with id: ${_id}`);
      return this.#response.ok(res, user);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;
    try {
      const user = await this.#service.deleteUserById(_id);
      if (user === null) return this.#response.notFound(res, `No user with id: ${_id}`);
      return res.sendStatus(204);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public tokenValidator = (_req: Request, res: Response): Response => {
    return res.sendStatus(204);
  };
}
