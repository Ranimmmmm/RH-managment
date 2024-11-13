// models/Employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust the path as necessary
module.exports = (sequelize, DataTypes) => {
const Employee = sequelize.define('Employee', {
    prénom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numérodetèl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fonction: {
        type: DataTypes.STRING,
        allowNull: false
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

