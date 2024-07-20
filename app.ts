import * as express from "express"
import { Request, Response } from "express"

/* API PLAN
- Create Models(User & Orgnisation)
- Impliment Validation for all fields in the model and return an error(422) on failure with a specified payload
-Impliment User authenticaion using the schema

-Impliment Endpoint for user Registration
-Hash the users password before storing in the database
-Return a success or fail

-Impliment Endpoint for user Login
- Use JWT returned to access [PROTECTED] routes

-Establish connections between tables

-[POST]/auth/register
-[POST]/auth/login ...allows you to interact with an organisation
-[GET]/api/users/:id -- [PROTECTED] gets a users record by id (check)
-[GET]/api/organisations -- [PROTECTED] gets all organisations belonging to the user
-[GET]/api/organisations/:orgId -- [PROTECTED] logged in user gets a single organisation record by ID
-[POST]/api/organisations: -- [PROTECTED] user creates their new organisation
-[POST]/api/organisations/:orgId/users -- adds a user to a particular organisation.

-UNIT TESTING
 */

const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const orgRoutes = require('./routes/orgRoutes');
const userRoutes = require('./routes/userRoutes');

const helpRoutes = require('./routes/helpRoutes');
import {myDataSource} from './controllers/database';

//Connect with typeOrm
myDataSource.initialize()
                .then(() => {
                    console.log("Data Source has been initialized!");
                })
                .catch((err) => {
                    console.error("Error during data source init", err);
                });

//Setup Environmental Varriables
require('dotenv').config();

//Middleware
const app = express();
//app.use(bodyParser.json());
app.use(express.json());


//Routes
app.use('/auth', authRoutes);
app.use('/api/organisations', orgRoutes);
app.use('/api/users', userRoutes);
app.use('/api/v1/topics', helpRoutes);

//Delete Later
const { sq, testDbConnection} = require('./config/db');
const Organisation = require('./models/organisation');


//Initialize server to listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    //Test DB Connection
    await testDbConnection();
    console.log(`Server is running on port ${PORT}`);
});

//API GET
app.get('/', (req, res) => {
    res.send("Hello from Node API");
});

//Create Test Instance
app.get('/org', async (req, res) => {
    try {
        const { name, description } = req.body;
        const org = await Organisation.create({name, description});
        res.status(201).json({
            status: 'success',
            message: 'Org Created Succesfully',
            data: {
                orgId: org.orgId,
                name: org.name,
                description: org.description
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});


module.exports = app;

