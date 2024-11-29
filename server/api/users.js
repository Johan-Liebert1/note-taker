// @ts-check
import { Router } from 'express';
import { getErrorMessage } from '../utils/index.js';
import { User } from '../db/users.js';
import { generateJwtFromUserId } from '../jwt/index.js';
import { Note } from '../db/notes.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

// 5 minutes
const NotesCacheTime = 5 * 60;

const userRouter = Router();

/** @typedef {import('../types/typedefs.js').UserRegisterRequest} UserRegisterRequest */
/** @typedef {import('../types/typedefs.js').UserLoginRequest} UserLoginRequest */

userRouter.post(
    '/register',
    /**
     * @param {import('express').Request<object, object, UserRegisterRequest>} req
     * @param {import('express').Response<import('../types/typedefs.js').GenericResponse<{ userId: number; }>>} res
     */
    async (req, res) => {
        try {
            const { username, password, email } = req.body;

            if (username?.length === 0 || password?.length === 0 || email?.length === 0) {
                res.status(400).json({
                    success: false,
                    statusCode: 400,
                    error: {
                        message:
                            'Username, Password and Email should all have length greater than 0'
                    }
                });
                return;
            }

            // TODO: Hash the password here
            const result = await User.create({
                username,
                password,
                email
            });

            res.status(201).json({
                success: true,
                userId: result.toJSON().id
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                error: {
                    message: getErrorMessage(error)
                }
            });
        }
    }
);

userRouter.post(
    '/login',
    /**
     * @param {import('express').Request<object, object, UserLoginRequest>} req
     * @param {import('express').Response<import('../types/typedefs.js').GenericResponse<{ token: string; }>>} res
     */
    async (req, res) => {
        try {
            const { email, password } = req.body;

            if (email?.length === 0 || password?.length === 0) {
                res.status(400).json({
                    success: false,
                    statusCode: 400,
                    error: {
                        message: 'Password and Email should all have length greater than 0'
                    }
                });
                return;
            }

            /** @type {import('sequelize').Model<User, User> | null} */
            const user = await User.findOne({ where: { email } });

            if (!user) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: `User with email ${email} not found. Please register.`
                    }
                });

                return;
            }

            if (user.dataValues.password !== password) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: `Invalid email or password`
                    }
                });

                return;
            }

            const token = await generateJwtFromUserId(user.dataValues.id);

            res.status(200).json({
                success: true,
                token
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                error: {
                    message: getErrorMessage(error)
                }
            });
        }
    }
);

userRouter.get(
    '/notes',
    authMiddleware,
    /**
     * @typedef {import('sequelize').Model<import('../types/schema.js').NoteType>[]} AllNotes
     * @param {import('express').Request<object, object, object>} req
     * @param {import('express').Response<import('../types/typedefs.js').GenericResponse<{ notes: AllNotes }>>} res
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

            /** @type {number} */
            const userId = req.decodedJwt.payload['userId'];

            const value = await req.redis.get(`${userId}:notes`);

            if (value) {
                /** @type {AllNotes} */
                const parsedNotes = JSON.parse(value);

                res.status(200).json({
                    success: true,
                    notes: parsedNotes
                });

                return;
            }

            /** @type {AllNotes} */
            const allNotes = await Note.findAll({ where: { user_id: userId, deleted: false } });

            await req.redis.set(`${userId}:notes`, JSON.stringify(allNotes), {
                EX: NotesCacheTime
            });

            res.status(200).json({
                success: true,
                notes: allNotes
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                error: {
                    message: getErrorMessage(error)
                }
            });
        }
    }
);

export default userRouter;
