// @ts-check

import { Sequelize } from 'sequelize';
import { getErrorMessage } from '../utils/index.js';
import { defineUserModel } from './users.js';
import { defineNotesModel } from './notes.js';

export const MaxRetries = 10;

/** @typedef {import('../types/typedefs').GenericResponse<object, object>} GenericResponse */

/**
 * @param {Sequelize} sequelize
 * @returns {Promise<GenericResponse>}
 */
export const defineModels = async (sequelize) => {
    try {
        defineUserModel(sequelize);
        defineNotesModel(sequelize);

        // User.hasMany(Note);

        await sequelize.sync({ alter: true });

        return {
            success: true
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            statusCode: 500,
            error: {
                message: getErrorMessage(error)
            }
        };
    }
};

/**
 * @param {number} times
 * @returns {Promise<import('../types/typedefs').GenericResponse<{ sequelize: Sequelize }>>}
 */
export const connectDB = async (times = 0) => {
    try {
        if (times > MaxRetries) {
            return {
                success: false,
                statusCode: 500,
                error: {
                    message: `Failed to connect to database after ${MaxRetries} tries`
                }
            };
        }

        console.log('Connecting to db... Tried %d times', times);

        const sequelize = new Sequelize(
            process.env.MYSQL_DATABASE || '',
            process.env.MYSQL_USER || '',
            process.env.MYSQL_PASSWORD,
            {
                host: process.env.DB_HOST || '127.0.0.1',
                port: 3306,
                dialect: 'mysql',
                timezone: '+00:00'
            }
        );

        await sequelize.authenticate();

        console.log('Connection to DB successful');

        return {
            success: true,
            sequelize
        };
    } catch (error) {
        console.log(error);

        return new Promise((res) => setTimeout(async () => res(await connectDB(times + 1)), 3000));
    }
};
