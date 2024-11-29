// @ts-check

import Express from 'express';
import { configDotenv } from 'dotenv';
import { resolve, join } from 'node:path';
import { exit } from 'node:process';
import userRouter from './api/users.js';
import { connectDB, defineModels } from './db/db.js';
import bodyParser from 'body-parser';
import notesRouter from './api/notes/notes.js';
import { connectToRedis } from './redis/redis.js';

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

    const redisClient = await connectToRedis();

    if (!redisClient) {
        console.log('Failed to connect to redis...');
        exit(1);
    }

    const app = Express();

    app.use((req, _, next) => {
        req.redis = redisClient;
        next();
    });

    app.use(bodyParser.json());

    app.use('/users', userRouter);
    app.use('/notes', notesRouter);

    app.listen(process.env.PORT, () => {
        console.log(`Started server on port ${process.env.PORT}`);
    });
};

main();
