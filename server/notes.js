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

notesRouter.get(
    '/:noteId',
    /**
     * @param {import('express').Request<Record<'noteId', string>, object, object>} req
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

            const noteIdFromParam = req.params.noteId;

            /** @type {import('./types/typedefs').GenericResponse} */
            const invalidIdMessage = {
                success: false,
                error: {
                    message: `${noteIdFromParam} is not a valid id.`
                }
            };

            if (Number.isNaN(noteIdFromParam)) {
                res.status(400).json(invalidIdMessage);
                return;
            }

            if (!Number.isInteger(Number(noteIdFromParam))) {
                res.status(400).json(invalidIdMessage);
                return;
            }

            const noteId = Number.parseInt(noteIdFromParam);

            /** @type {number} */
            const userId = jwtValidation.decodedJwt.payload['userId'];

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

            res.status(201).json(note.toJSON());
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
