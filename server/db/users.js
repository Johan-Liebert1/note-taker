// @ts-check

import { Sequelize, DataTypes, NOW } from 'sequelize';
import { TableNames } from './tables.js';

/** @typedef {import('../types/typedefs').GenericResponse<object, object>} GenericResponse */

/**
 * @typedef {import('../types/schema').UserType} User
 *
 * @typedef {import('sequelize').Optional<User, 'id' | 'created_at' | 'updated_at'>} CreationAttributes
 * @typedef {import('sequelize').Model<User, CreationAttributes> & User} UserModel
 */

/** @type {ReturnType<import('sequelize').Sequelize['define']>} */
export let User;

/**
 * @param {Sequelize} sequelize
 */
export const defineUserModel = (sequelize) => {
    User = sequelize.define(
        TableNames.User,
        /** @type {import('sequelize').ModelAttributes<UserModel>} */
        ({
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: NOW
            }
        }),
        /** @type {import('sequelize').ModelOptions<UserModel>} */
        ({
            timestamps: false
        })
    );
};
