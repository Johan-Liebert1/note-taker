// @ts-check
import Express, { Router } from "express";

const userRouter = Router();

/** @typedef {import('./types/typedefs').UserRegisterRequest} UserRegisterRequest */

userRouter.post(
    '/register', 
    /** 
      * @param {Express.Request<object, object, any>} req 
      * @param {Express.Response} res 
    */
    async (req, res) => {
});

export default userRouter;
