// @ts-check

import { createClient } from 'redis';
import { MaxRetries } from '../db/db.js';
import logger from '../logger/logger.js';

/** @returns {Promise<ReturnType<typeof createClient> | null>} */
export const connectToRedis = async (tries = 0) => {
    try {
        if (tries > MaxRetries) {
            return null;
        }

        logger.info(`Tried to connect to redis ${tries} times`);

        const client = createClient({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: 6379
            },
            pingInterval: 5_000
        });

        await client.connect();

        logger.info(`Successfully connected to redis after ${tries} tries`);

        return client;
    } catch (error) {
        logger.error(error);

        return new Promise((res) =>
            setTimeout(async () => res(await connectToRedis(tries + 1)), 3000)
        );
    }
};
