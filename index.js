const express = require('express');
const sqlManager = require('./sql/env.config');
const bodyParser = require('body-parser');
const login = require('./request/login');
const kairosApp = express();

var port = process.env.PORT || 9080;

// Open MySql connection
const dbConn = sqlManager.connectDB();

// Config app to use body parser. Our app have to use json body.
kairosApp.use(bodyParser.json());

// Allow cross domain
kairosApp.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

kairosApp.get('/', (req, res) => res.send('Kairos Vacations App!!!!'));


kairosApp.get('/configure_environment', function(req, res){
    console.log('Entry point to configure APP Database');
    sqlManager.configEnv(dbConn);
    res.send({rslt: 'OK'});
    //should create DB
    //should create users table
    //should create users-vacations table
    //should create users-client table
    //shoukd create client-ambassadors table
});

kairosApp.get('/clean_environment', function(req, res){
    sqlManager.cleanDB(dbConn);
    res.send({rslt: 'OK'});
});

/** 
 * Entry point to do google login
 */
kairosApp.post('/login', function(req, res){
    // Login user. Verify google token and return client information.
    const requestData = req.body || {};
    if( Object.keys(requestData).length !== 0 && requestData.constructor === Object){
        login.validateToken(requestData, res);
    }else{
        res.status(500).send({rslt: 'KO'});
    }
    
    
});

/**
 * Entry point to get client information
 */
kairosApp.get('/client', function(req, res){
    const email = req.query.userEmail;
    sqlManager.getClient(dbConn, email, res);
});

/**
 * Entry point to get the client vacations summary
 */
kairosApp.get('/vacations', function(req, res){
    const params = req.query;
    sqlManager.getVacations(dbConn, params, res);
});

/*kairosApp.get('/vacations', function(req, res){
    // Should send spent vacations vs free vacations
    console.log('Entry point to retrieve vacations information about a user');
    const userId= req.query && req.query.userId;
    if( !userId ){
        // return error response 
    }
    res.set('Content-Type', 'application/json');
    // Go to DB to get information: GET * from users-vacations WHERE userId=userId
    const fakeData = {
        freeDays: 20,
        spentDays: 6
    };
    res.status(200).send(JSON.stringify(fakeData, null, 4));
});*/

kairosApp.post('/vacations', function(req, res){
    console.log('Entry point to ask for some vacations');
    // Should send userID, startDate, endDate
    const fakeData = {
        result: 'ok'
    };
    res.status(200).send(JSON.stringify(fakeData, null, 4));
});

kairosApp.post('/permission', function(req, res){
    console.log('Entry point to inform about some permission');
});

kairosApp.listen(port, () => console.log(`Kairos Vacations app listening on port ${port}!`));