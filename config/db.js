const { ssl } = require('pg/lib/defaults');
const { Sequelize } = require('sequelize');

//Setup Environmental Varriables
require('dotenv').config();
const uri = process.env.DATABASE_URI;

//Create PostgreSQL Instance
const sequelize = new Sequelize(uri,{
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    },
    logging: false
});


// Synchronize the models with the database
const syncDb = async () => {
    try {
        await sequelize.sync({ force: true }); 
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Unable to synchronize the database:', error);
    }
};

const testDbConnection = async () => {
    //Test Connection to db
    try {
        await sequelize.authenticate();
        console.log('Connection has been established succesfully.');
        await syncDb();
    } catch (error) {
        console.error('Unable to connect to the database:', error);       
    }
};

module.exports = { sq: sequelize, testDbConnection};
