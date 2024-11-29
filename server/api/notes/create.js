// @ts-check
import { Router } from 'express';
import { getErrorMessage } from '../../utils/index.js';
import { Note } from '../../db/notes.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import logger from '../../logger/logger.js';

const createNotesRouter = Router();

/** @typedef {import('../../types/typedefs.js').NoteCreateRequest} NoteCreateRequest */

createNotesRouter.post(
    '/create',
    authMiddleware,
    /**
     * @param {import('express').Request<object, object, NoteCreateRequest>} req
     * @param {import('express').Response<import('../../types/typedefs.js').GenericResponse<Note>>} res
     */
    async (req, res) => {
        try {
            const { title, message } = req.body;

            if (!req.decodedJwt) {
                // this is only for sanity check
                // as auth middleware should catch this
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'Failed to decode user token.'
                    }
                });

                return;
            }

            /** @type {number} */
            const userId = req.decodedJwt.payload['userId'];

            const createdNote = await Note.create({
                user_id: userId,
                title,
                message
            });

            res.status(201).json(createdNote.toJSON());
        } catch (error) {
            logger.error(error);

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

export default createNotesRouter;
