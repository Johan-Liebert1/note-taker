// @ts-check
import { Router } from 'express';
import { getErrorMessage } from './utils/index.js';
import { getJwtFromRequest, validateJwt } from './jwt/index.js';
import { Note } from './db/notes.js';

const notesRouter = Router();

/** @typedef {import('./types/typedefs').NoteCreateRequest} NoteCreateRequest */

notesRouter.post(
    '/create',
    /**
     * @param {import('express').Request<object, object, NoteCreateRequest>} req
     * @param {import('express').Response<import('./types/typedefs').GenericResponse<Note>>} res
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

            const { title, note } = req.body;

            /** @type {number} */
            const userId = jwtValidation.decodedJwt.payload['userId'];

            const createdNote = await Note.create({
                user_id: userId,
                title,
                note
            });

            res.status(201).json(createdNote.toJSON());
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
