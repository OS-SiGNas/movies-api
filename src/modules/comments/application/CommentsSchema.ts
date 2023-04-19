import z from 'zod';

import type { AnyZodObject } from 'zod';

export class CommentSchema {
  readonly getOneSchema: AnyZodObject;
  readonly getByUserSchema: AnyZodObject;
  readonly getByMovieSchema: AnyZodObject;
  readonly createSchema: AnyZodObject;
  constructor() {
    const id = { length: 24, error: 'id must be a 24 hex characters' };
    const score = {
      gte: 1,
      gteError: 'min score 1 point',
      lte: 10,
      lteError: 'max score 10 point',
      error: {
        required_error: 'Score (1/10) is required',
        invalid_type_error: 'Score (1/10) must be a number',
      },
    };
    const content = { max: 3000, maxError: 'comment content too long' };
    // ----------------------------------------------
    this.getOneSchema = z.object({
      params: z.object({ _id: z.string().length(id.length, id.error) }).strict(), // .uuid()
    });
    // ----------------------------------------------
    this.getByUserSchema = z.object({
      params: z.object({ userId: z.string().length(id.length, id.error) }).strict(), // .uuid()
    });
    // ----------------------------------------------
    this.getByMovieSchema = z.object({
      params: z.object({ movieId: z.string().length(id.length, id.error) }).strict(), // .uuid()
    });
    // ----------------------------------------------
    this.createSchema = z.object({
      params: z
        .object({
          movieId: z.string().length(id.length, id.error), // .uuid(),
        })
        .strict(),
      body: z
        .object({
          score: z.number(score.error).gte(score.gte, score.gteError).lte(score.lte, score.lteError).int().positive(),
          content: z.string().min(1).max(content.max, content.maxError),
        })
        .strict(),
    });
  }
}

export const commentsSchema = new CommentSchema();
