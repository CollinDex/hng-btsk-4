"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
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
var bodyParser = require('body-parser');
var authRoutes = require('./routes/authRoutes');
var orgRoutes = require('./routes/orgRoutes');
var userRoutes = require('./routes/userRoutes');
var helpRoutes = require('./routes/helpRoutes');
var database_1 = require("./controllers/database");
//Connect with typeOrm
database_1.myDataSource.initialize()
    .then(function () {
    console.log("Data Source has been initialized!");
})
    .catch(function (err) {
    console.error("Error during data source init", err);
});
//Setup Environmental Varriables
require('dotenv').config();
//Middleware
var app = express();
//app.use(bodyParser.json());
app.use(express.json());
//Routes
app.use('/auth', authRoutes);
app.use('/api/organisations', orgRoutes);
app.use('/api/users', userRoutes);
app.use('/api/v1/topics', helpRoutes);
//Delete Later
var _a = require('./config/db'), sq = _a.sq, testDbConnection = _a.testDbConnection;
var Organisation = require('./models/organisation');
//Initialize server to listen for requests
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            //Test DB Connection
            return [4 /*yield*/, testDbConnection()];
            case 1:
                //Test DB Connection
                _a.sent();
                console.log("Server is running on port ".concat(PORT));
                return [2 /*return*/];
        }
    });
}); });
//API GET
app.get('/', function (req, res) {
    res.send("Hello from Node API");
});
//Create Test Instance
app.get('/org', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, description, org, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_1 = _a.name, description = _a.description;
                return [4 /*yield*/, Organisation.create({ name: name_1, description: description })];
            case 1:
                org = _b.sent();
                res.status(201).json({
                    status: 'success',
                    message: 'Org Created Succesfully',
                    data: {
                        orgId: org.orgId,
                        name: org.name,
                        description: org.description
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(500).json({
                    status: 'error',
                    message: error_1.message
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
module.exports = app;
