// @ts-check
import Express, { Router } from 'express';
import { getErrorMessage } from './utils/index.js';
import { generateJwtFromUserId, getJwtFromRequest, validateJwt } from './jwt/index.js';

const notesRouter = Router();

/** @typedef {import('./types/typedefs').NoteCreateRequest} NoteCreateRequest */

notesRouter.post(
    '/create',
    /**
     * @param {import('express').Request<object, object, NoteCreateRequest>} req
     * @param {import('express').Response<import('./types/typedefs').GenericResponse<{ userId: number; }>>} res
     */
    async (req, res) => {
        try {
            const tokenFromReq = getJwtFromRequest(req);

            if (!tokenFromReq.success) {
                res.status(400).json(tokenFromReq);
                return;
            }

            const jwtValidation = validateJwt(tokenFromReq.jwt);

            if (!jwtValidation.success) {
                res.status(401).json(jwtValidation);
                return;
            }

            console.log(jwtValidation);

            res.status(201);
        } catch (error) {
            console.log(error);

            res.status(500).json({
                statusCode: 500,
                success: false,
                error: {
                    message: getErrorMessage(error)
                }
            });
        }
    }
);

export default notesRouter;
