// @ts-check
import { Router } from 'express';
import { getErrorMessage } from './utils/index.js';
import { User } from './db/users.js';
import { generateJwtFromUserId } from './jwt/index.js';

const userRouter = Router();

/** @typedef {import('./types/typedefs').UserRegisterRequest} UserRegisterRequest */
/** @typedef {import('./types/typedefs').UserLoginRequest} UserLoginRequest */

userRouter.post(
    '/register',
    /**
     * @param {import('express').Request<object, object, UserRegisterRequest>} req
     * @param {import('express').Response<import('./types/typedefs').GenericResponse<{ userId: number; }>>} res
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
     * @param {import('express').Response<import('./types/typedefs').GenericResponse<{ token: string; }>>} res
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

export default userRouter;
