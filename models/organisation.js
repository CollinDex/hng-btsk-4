const { Sequelize, DataTypes } = require('sequelize');

const { sq } = require('../config/db');
const User = require('./user');

const Organisation = sq.define('Organisation',{
    orgId: {
        type: DataTypes.STRING,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

Organisation.belongsToMany(User, {through: 'UserOrganisations'});
User.belongsToMany(Organisation, {through: 'UserOrganisations'});


module.exports = Organisation;