import type { Request, Response } from 'express';
import type { IHttpResponse } from '../../shared/types';
import type { ICommentsService } from '../domain/ICommentsService';

interface Dependences {
  httpResponse: IHttpResponse;
  service: ICommentsService;
}

export default class CommentsController {
  #response: IHttpResponse;
  #service: ICommentsService;
  constructor({ httpResponse, service }: Dependences) {
    this.#response = httpResponse;
    this.#service = service;
  }

  public getComment = async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;
    try {
      const comment = await this.#service.getOneComment(_id);
      if (comment === null) return this.#response.notFound(res, `Comment ${_id} not found`);
      return this.#response.ok(res, comment);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public getMovieComments = async (req: Request, res: Response): Promise<Response> => {
    const { movieId } = req.params;
    try {
      const ratingAndComments = await this.#service.findMovieComments(movieId);
      return this.#response.ok(res, ratingAndComments);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public getUserComments = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;
    try {
      const comments = await this.#service.findUserComments(userId);
      if (comments === null) return this.#response.notFound(res, `not found comments for user ${userId}`);
      return this.#response.ok(res, comments);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public postMovieComment = async (req: Request, res: Response): Promise<Response> => {
    const { movieId } = req.params;
    const byUser = req.headers.userId as string;
    try {
      const comment = await this.#service.createComment(movieId, byUser, req.body);
      return this.#response.ok(res, comment);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public putComment = async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;
    try {
      const commentUpdated = await this.#service.updateComment(_id, req.body);
      if (commentUpdated === null) return this.#response.notFound(res, `Comment ${_id} not found`);
      return this.#response.ok(res, commentUpdated);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };

  public deleteComment = async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;
    try {
      const deletedComment = await this.#service.deleteComment(_id);
      if (deletedComment === null) return this.#response.notFound(res, `Comment ${_id} not found`);
      return res.sendStatus(204);
    } catch (error) {
      return this.#response.error(res, error);
    }
  };
}
