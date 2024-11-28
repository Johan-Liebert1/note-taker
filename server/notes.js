// @ts-check
import Express, { Router } from 'express';
import { getErrorMessage } from './utils/index.js';
import { User } from './db/db.js';
import { generateJwtFromUserId } from './jwt/index.js';

const notesRouter = Router();

notesRouter.post(
    '/create',
    /**
     * @param {import('express').Request<object, object, UserRegisterRequest>} req
     * @param {import('express').Response<import('./types/typedefs').GenericResponse<{ userId: number; }>>} res
     */
    async (req, res) => {}
);

export default notesRouter;
