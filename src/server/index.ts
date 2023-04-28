import Express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

import Server from './Server';
import { dbUri, environment, port } from './Settings';
import MongoRepository from './MongoRepository';
import modules from '../modules';

import type { RequestHandler } from 'express';

const database = new MongoRepository(mongoose, dbUri, environment);

const logger = environment === 'dev' ? morgan('dev') : morgan('common');

const middlewares: RequestHandler[] = [logger, json(), cors()];

export const server = new Server({ app: Express(), environment, port, database, middlewares, modules });
