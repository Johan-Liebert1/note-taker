// @ts-check

import { getJwtFromRequest, validateJwt } from '../jwt/index.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const authMiddleware = (req, res, next) => {
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

        req.decodedJwt = jwtValidation.decodedJwt;

        next();
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to authenticate user'
            }
        });
    }
};
