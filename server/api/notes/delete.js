// @ts-check

import { Router } from 'express';
import { Note } from '../../db/notes.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { getInvalidIdMessage } from '../../constants/constants.js';
import { getErrorMessage, parseAsInt } from '../../utils/index.js';

const deleteNotesRouter = Router();

deleteNotesRouter.delete(
    '/:noteId',
    authMiddleware,
    /**
     * @param {import('express').Request<Record<'noteId', string>, object, object>} req
     * @param {import('express').Response<import('../../types/typedefs.js').GenericResponse>} res
     */
    async (req, res) => {
        try {
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

            const parseResult = parseAsInt(req.params.noteId);

            if (!parseResult.success) {
                res.status(400).json(getInvalidIdMessage(req.params.noteId));
                return;
            }

            // soft delete the note
            const updateResult = await Note.update(
                { deleted: true },
                {
                    where: {
                        user_id: req.decodedJwt.payload['userId'],
                        id: parseResult.parsed,
                        deleted: false
                    }
                }
            );

            console.log(updateResult);

            const updatedRows = updateResult[0];

            if (updatedRows === 0) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: `Note with id ${parseResult.parsed} for user id ${req.decodedJwt.payload['userId']} not found or is already deleted.`
                    }
                });
                return;
            }

            res.status(200).json({
                success: true
            });
        } catch (error) {
            console.log(error);

            res.status(500).json({
                success: false,
                error: {
                    message: getErrorMessage(error)
                }
            });
        }
    }
);

export default deleteNotesRouter;
