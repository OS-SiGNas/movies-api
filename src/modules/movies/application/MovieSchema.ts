import { z } from 'zod';
import type { AnyZodObject } from 'zod';

export class MovieSchema {
  readonly getAllSchema: AnyZodObject;
  readonly getOneschema: AnyZodObject;
  readonly createSchema: AnyZodObject;
  readonly aproveSchema: AnyZodObject;
  readonly deleteSchema: AnyZodObject;
  constructor() {
    const id = { length: 24, error: 'id must be a 24 hex characters' };
    const name = {
      min: 2,
      max: 35,
      minError: 'Name mus be a minimun 2 characters',
      maxError: 'Name mus be a max 35 characters',
    };
    // ----------------------------------------------
    this.getAllSchema = z.object({
      query: z
        .object({
          name: z.string().min(name.min, name.minError).max(name.max, name.maxError).optional(),
          offset: z.string().min(1).max(2).optional(),
          limit: z.string().min(1).max(2).optional(),
        })
        .strict(),
    });
    // ----------------------------------------------
    this.getOneschema = z.object({
      params: z.object({ _id: z.string().length(id.length, id.error) }).strict(),
    });
    // ----------------------------------------------
    this.createSchema = z.object({
      body: z
        .object({
          name: z.string().min(name.min, name.minError).max(name.max, name.maxError),
        })
        .strict(),
    });
    // ----------------------------------------------
    this.aproveSchema = z.object({
      body: z.array(z.string().length(id.length, id.error)),
    });
    // ----------------------------------------------
    this.deleteSchema = z.object({
      params: z.object({ _id: z.string().length(id.length, id.error) }).strict(),
    });
  }
}

export const movieSchemas = new MovieSchema();
