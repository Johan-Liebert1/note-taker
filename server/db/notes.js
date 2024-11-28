// @ts-check

import { Sequelize, DataTypes, NOW } from 'sequelize';
import { TableNames } from './tables.js';

/** @typedef {import('../types/typedefs').GenericResponse<object, object>} GenericResponse */

/**
 * @typedef {import('../types/schema').NoteType} Note
 *
 * @typedef {import('sequelize').Optional<Note, 'id' | 'created_at' | 'updated_at'>} CreationAttributes
 * @typedef {import('sequelize').Model<Note, CreationAttributes> & Note} NoteModel
 */

/** @type {ReturnType<import('sequelize').Sequelize['define']>} */
export let Note;

/**
 * @param {Sequelize} sequelize
 */
export const defineNotesModel = (sequelize) => {
    Note = sequelize.define(
        TableNames.Notes,
        /** @type {import('sequelize').ModelAttributes<NoteModel>} */
        ({
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            message: {
                type: DataTypes.STRING,
                allowNull: true
            },
            deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: TableNames.User,
                    key: 'id'
                }
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
        /** @type {import('sequelize').ModelOptions<NoteModel>} */
        ({
            timestamps: false
        })
    );
};
