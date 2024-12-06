// models/Employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust the path as necessary
module.exports = (sequelize, DataTypes) => {
const Employee = sequelize.define('Employee', {
    prenom: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numerodetel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fonction: {
        type: DataTypes.STRING,
        allowNull: true
    },
    file:{
        type: DataTypes.STRING,
        allowNull: true
    }
    
}, {
    tableName: 'employees',
    modelName: 'Employee' 
});
return Employee;
};

