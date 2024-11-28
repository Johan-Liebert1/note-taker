// @ts-check

import { DataTypes, Model, NOW, Sequelize } from "sequelize";
import { getErrorMessage } from "../utils/index.js";

/** @typedef {import('../types/typedefs').GenericResponse<object, object>} GenericResponse */

/** @type import("sequelize").ModelCtor<Model<any, any>> */
export let User;

/**
 * @param {Sequelize} sequelize
 * @returns {Promise<GenericResponse>}
 */
export const defineModels = async (sequelize) => {
    try {
        User = sequelize.define(
            "users",
            {
                username: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: NOW,
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: NOW,
                },
            },
            {
                timestamps: false,
            },
        );

        await sequelize.sync({ alter: true });

        return {
            success: true,
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            statusCode: 500,
            error: {
                message: getErrorMessage(error),
            },
        };
    }
};

/** @returns {Promise<import('../types/typedefs').GenericResponse<{ sequelize: Sequelize }>>} */
export const connectDB = async () => {
    try {
        const sequelize = new Sequelize(
            process.env.MYSQL_DATABASE || "",
            process.env.MYSQL_USER || "",
            process.env.MYSQL_PASSWORD,
            {
                host: "127.0.0.1",
                port: 3306,
                dialect: "mysql",
                timezone: "+00:00",
            },
        );

        await sequelize.authenticate();

        console.log("Connection to DB successful");

        return {
            success: true,
            sequelize,
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            statusCode: 500,
            error: {
                message: getErrorMessage(error),
            },
        };
    }
};
