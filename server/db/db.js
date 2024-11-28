// @ts-check

import { Sequelize } from 'sequelize';
import { getErrorMessage } from '../utils/index.js';
import { defineUserModel, User } from './users.js';
import { defineNotesModel, Note } from './notes.js';

/** @typedef {import('../types/typedefs').GenericResponse<object, object>} GenericResponse */

/**
 * @param {Sequelize} sequelize
 * @returns {Promise<GenericResponse>}
 */
export const defineModels = async (sequelize) => {
    try {
        defineUserModel(sequelize);
        defineNotesModel(sequelize);

        User.hasMany(Note);

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

/** @returns {Promise<import('../types/typedefs').GenericResponse<{ sequelize: Sequelize }>>} */
export const connectDB = async () => {
    try {
        const sequelize = new Sequelize(
            process.env.MYSQL_DATABASE || '',
            process.env.MYSQL_USER || '',
            process.env.MYSQL_PASSWORD,
            {
                host: '127.0.0.1',
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

        return {
            success: false,
            statusCode: 500,
            error: {
                message: getErrorMessage(error)
            }
        };
    }
};
