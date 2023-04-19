import z from 'zod';

import type { AnyZodObject } from 'zod';

export class UsersSchema {
  readonly loginSchema: AnyZodObject;
  readonly getOneSchema: AnyZodObject;
  readonly getAllSchema: AnyZodObject;
  readonly createSchema: AnyZodObject;
  readonly updateSchema: AnyZodObject;
  readonly deleteSchema: AnyZodObject;
  constructor() {
    const id = { length: 24, error: 'id must be a 24 hex characters' };

    const username = {
      min: 3,
      max: 16,
      minError: 'username must be a minimun 3 characters',
      maxError: 'username must be a max 16 characters',
    };

    const password = {
      min: 10,
      max: 24,
      minError: 'Password need minimun 10 chars',
      maxError: 'password must be a max 24 characters',
    };

    const name = {
      min: 2,
      max: 16,
      minError: 'Name mus be a minimun 2 characters',
      maxError: 'Name mus be a max 16 characters',
    };

    // ----------------------------------------------
    this.loginSchema = z.object({
      body: z
        .object({
          username: z.string().min(username.min, username.minError).max(username.max, username.maxError),
          password: z.string().min(password.min, password.minError).max(password.max, password.maxError),
        })
        .strict(),
    });
    // ----------------------------------------------
    this.getOneSchema = z.object({
      params: z.object({ _id: z.string().length(id.length, id.error) }),
      query: z
        .object({
          username: z.string().min(username.min, username.minError).max(username.max, username.maxError).optional(),
          email: z.string().optional(),
          telf: z.string().optional(),
        })
        .strict(),
    });
    // ----------------------------------------------
    this.getAllSchema = z.object({
      query: z
        .object({
          name: z.string().min(name.min, name.minError).max(name.max, name.maxError).optional(),
          active: z.boolean().optional(),
          roles: z.string(z.enum(['admin', 'user'])).optional(),
        })
        .strict(),
    });
    // ----------------------------------------------
    this.createSchema = z.object({
      body: z
        .object({
          username: z.string().min(username.min, username.minError).max(username.max, username.maxError),
          password: z.string().min(password.min, password.minError).max(password.max, password.maxError),
          email: z.string().email(),
          name: z.string().min(name.min, name.minError).max(name.max, name.maxError),
          telf: z.string(),
          active: z.boolean(),
          roles: z.array(z.enum(['admin', 'user'])),
        })
        .strict(),
    });
    // ----------------------------------------------
    this.updateSchema = z.object({
      params: z.object({ _id: z.string().length(id.length, id.error) }),
      body: z
        .object({
          username: z.string().min(username.min, username.minError).max(username.max, username.maxError).optional(),
          password: z.string().min(password.min, password.minError).max(password.max, password.maxError).optional(),
          email: z.string().email().optional(),
          name: z.string().min(name.min, name.minError).max(name.max, name.maxError).optional(),
          telf: z.string().optional(),
          active: z.boolean().optional(),
          roles: z.array(z.enum(['admin', 'user'])).optional(),
        })
        .strict(),
    });
    // ----------------------------------------------
    this.deleteSchema = z.object({
      params: z.object({ _id: z.string().length(id.length, id.error) }),
    });
  } // end contructor
} // end class

export const usersSchema = new UsersSchema();
