const  db  = require('../db'); 
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const PublicHoliday = sequelize.define('PublicHoliday', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY, // Specific date for the holiday
            allowNull: false,
        },
        numberOfDays: {
            type: DataTypes.INTEGER, // Number of days the holiday lasts
            defaultValue: 1,
            allowNull: false,
        },
        isVariable: {
            type: DataTypes.BOOLEAN, // Whether the holiday's date changes every year
            defaultValue: false,
        },
    }, {
        tableName: 'public_holidays',
        modelName: 'PublicHoliday',
    });
    return PublicHoliday;
};
