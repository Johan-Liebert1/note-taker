// @ts-check

import { createClient } from 'redis';
import { MaxRetries } from '../db/db';

/** @returns {Promise<ReturnType<typeof createClient> | null>} */
export const connectToRedis = async (tries = 0) => {
    try {
        if (tries > MaxRetries) {
            return null;
        }

        const client = createClient({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: 6379
            },
            pingInterval: 5_000
        });

        await client.connect();

        return client;
    } catch (error) {
        console.log(error);

        return new Promise((res) =>
            setTimeout(async () => res(await connectToRedis(tries + 1)), 3000)
        );
    }
};
