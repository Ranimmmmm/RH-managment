// models/activity.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db')  // Check this path is correct relative to this file

module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define('Activity', {
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        inTime: {
            type: DataTypes.TIME,
            allowNull: true
        },
        outTime: {
            type: DataTypes.TIME,
            allowNull: true
        },
      status: {
             type: DataTypes.STRING,
            allowNull: true
        },
        numberOfMissions: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        actionDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        paidLeaveBalance: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0  // Assuming all employees start with 0 days of paid leave
        }
    }, {
        tableName: 'activities',
        modelName: 'activities' 
    });

    return Activity;
};