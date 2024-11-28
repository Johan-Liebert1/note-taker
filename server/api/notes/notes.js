// @ts-check
import { Router } from 'express';
import { getErrorMessage, parseAsInt } from '../../utils/index.js';
import { Note } from '../../db/notes.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import createNotesRouter from './create.js';
import updateNotesRouter from './update.js';
import { getInvalidIdMessage } from '../../constants/constants.js';

const notesRouter = Router();

notesRouter.get(
    '/:noteId',
    authMiddleware,
    /**
     * @param {import('express').Request<Record<'noteId', string>, object, object>} req
     * @param {import('express').Response<import('../../types/typedefs.js').GenericResponse<Note>>} res
     */
    async (req, res) => {
        try {
            const noteIdFromParam = req.params.noteId;

            const parseResult = parseAsInt(noteIdFromParam);

            if (!parseResult.success) {
                res.status(400).json(getInvalidIdMessage(noteIdFromParam));
                return;
            }

            const noteId = parseResult.parsed;

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

            const note = await Note.findOne({ where: { user_id: userId, id: noteId } });

            if (!note) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: `Note with id ${noteId} not found for user with id ${userId}.`
                    }
                });
                return;
            }

            console.log(note);

            res.status(200).json(note.toJSON());
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

notesRouter.use('/', createNotesRouter);
notesRouter.use('/update', updateNotesRouter);

export default notesRouter;
