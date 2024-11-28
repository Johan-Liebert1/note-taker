// @ts-check

import Express from 'express';
import { configDotenv } from 'dotenv';
import { resolve, join } from 'node:path';
import { exit } from 'node:process';
import userRouter from './users.js';
import { connectDB, defineModels } from './db/db.js';
import bodyParser from 'body-parser';

export const SERVER_BASE_PATH = resolve('.');

const loadEnvironment = () => {
    const output = configDotenv({
        path: join(SERVER_BASE_PATH, 'server/.env')
    });

    if (output.error) {
        console.error(output.error);
        exit(1);
    }
};

const main = async () => {
    loadEnvironment();

    const connectDBResponse = await connectDB();

    if (!connectDBResponse.success) {
        console.log(connectDBResponse);
        // failed to connect to db, no point in continuing
        exit(1);
    }

    await defineModels(connectDBResponse.sequelize);

    const app = Express();
    app.use(bodyParser.json());

    app.use('/users', userRouter);

    app.listen(process.env.PORT, () => {
        console.log(`Started server on port ${process.env.PORT}`);
    });
};

main();
