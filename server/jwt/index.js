// @ts-check

import jwtModule from 'jsonwebtoken';
import { getErrorMessage } from '../utils';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { SERVER_BASE_PATH } from '../index.js';
import Express from 'express';

const jwtIssuer = 'respond.io';
const hourInMs = 3600 * 1000;

/**
 * @param {string} jwt
 * @returns {import('../types/typedefs').GenericResponse<{ decodedJwt: import("jsonwebtoken").Jwt }>}
 */
export const validateJwt = (jwt) => {
    try {
        const publicKey = readFileSync(path.resolve(SERVER_BASE_PATH, 'keys/public.key'));

        const decodedJwt = jwtModule.verify(jwt, publicKey, {
            algorithms: ['RS256'],
            complete: true,
            issuer: jwtIssuer,
            ignoreExpiration: false
        });

        return {
            success: true,
            decodedJwt
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            statusCode: 401,
            error: {
                message: getErrorMessage(error)
            }
        };
    }
};

/**
 * @param {number} userId
 * @returns {Promise<string>}
 */
export const generateJwtFromUserId = (userId) => {
    try {
        const privateKey = readFileSync(path.resolve(SERVER_BASE_PATH, 'keys/private.key'));

        const data = {
            userId,
            iss: jwtIssuer,
            // valid for one hour
            exp: Date.now() + hourInMs
        };

        return new Promise((resolve, reject) => {
            jwtModule.sign(data, privateKey, { algorithm: 'RS256' }, function (err, token) {
                if (err !== null) {
                    reject(err);
                    return;
                }

                // @ts-ignore
                resolve(token);
            });
        });
    } catch (error) {
        return new Promise((_, reject) => reject(error));
    }
};

/**
 * @param {Express.Request} request
 * @returns {import("../types/typedefs").GenericResponse<{ jwt: string }>}
 */
export const getJwtFromRequest = (request) => {
    try {
        const authHeader = request.headers.authorization || request.headers.Authorization;

        // check jwt anyway if present or not
        if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            return {
                success: false,
                statusCode: 400,
                error: { message: 'Incorrect auth header' }
            };
        }

        return {
            success: true,
            jwt: authHeader.split(' ')[1]
        };
    } catch {
        return {
            success: false,
            statusCode: 500,
            error: {
                message: 'Could not get JWT from auth headers'
            }
        };
    }
};
