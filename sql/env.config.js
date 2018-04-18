const mysql = require('mysql');



function createConnection(){
    const DBName = 'kairos_vacations'; 
    const con = mysql.createConnection({
        host: "localhost",
        user: 'root',
        password : '',
        database: DBName
    });
    con.connect(function(err){
        if(!err) {
            console.log("DB connection is done.");
        } else {
            console.log(`Error connecting with DB ${DBName}`);    
        }
    });
    return con;
};

function configureEnvironment(con){
    _createUserTable(con);
    _createEmployeeVacationsTable(con);
    _addTestUsers(con);
    _addEmployeeVacations(con);
};

function _createUserTable(con){
    const createQuery = "CREATE TABLE IF NOT EXISTS kairos_users (id INT AUTO_INCREMENT PRIMARY KEY, employee_id VARCHAR(255), name VARCHAR(255), surname VARCHAR(255), sec_surname VARCHAR(255), client VARCHAR(255), email VARCHAR(255))";
    con.query(createQuery, function(err, result){
        if(err) {
            console.error(err);
        }else{
            console.log("kairos_users has been created correctly");
        }
    });
};

function _createEmployeeVacationsTable(con){
    const createQuery = `CREATE TABLE IF NOT EXISTS employee_vacations (
        spent_vac int,
        available_vac int,
        total_vac int,
        training int,
        permission int,
        email VARCHAR(255)
    );`
    con.query(createQuery, function(err, result){
        if(err) console.error(err); return;
        console.log( 'Table employee_vacations has been created.');
    });
};

function _addEmployeeVacations(con){
    const users = __getFakeUsers();
    users.forEach(function(user){
        let insertQuery = `INSERT INTO employee_vacations (spent_vac, available_vac, total_vac, training, permission, email) VALUES (${user.vacations.spent_vac}, ${user.vacations.available_vac}, ${user.vacations.total_vac}, ${user.vacations.training}, ${user.vacations.permission}, '${user.email}')`;
        con.query(insertQuery, function(err, rslt){
            if(err) console.error(err); return;
            console.log('Employee vacations added correctly.');
        })
    });
};

function _addTestUsers(con){
    const users = __getFakeUsers();
    users.forEach(function(user){
        let insertQuery = `INSERT INTO kairos_users (employee_id, name, surname, sec_surname, client, email) VALUES ('${user.employee_id}', '${user.name}', '${user.surname}', '${user.sec_surname}', '${user.client}', '${user.email}') `;
        con.query(insertQuery, function(err, result){
            if(err) console.error(err); return;
            console.log(`User ${user.name} ${user.surname} ${user.sec_surname} added correctly.`);
        })
    });
};

function __getFakeUsers(){
    return [
        {
            name: 'Alejandro',
            surname: 'Tovar',
            sec_surname: 'Moreno',
            client: 'ING',
            employee_id: 'EM2016000747',
            email: 'alejandro.tovar@kairosds.com',
            vacations: {
                spent_vac: 0,
                available_vac: 26,
                total_vac: 28,
                training: 0,
                permission: 0
            }
        },
        {
            name: 'Pedro',
            surname: 'Pica',
            sec_surname: 'Piedra',
            client: 'BBVA',
            employee_id: 'EM2016000748',
            email: 'pedro.picapiedra@kairosds.com',
            vacations: {
                spent_vac: 0,
                available_vac: 26,
                total_vac: 28,
                training: 0,
                permission: 0
            }
        }
    ];
};

function deleteDB(con){
    const tableList = ['kairos_users', 'employee_vacations'];
    tableList.forEach(function(table){
        let dropQuery = `DROP TABLE IF EXISTS ${table}`;
        con.query(dropQuery, function(err, rslt){
            if(err) console.error(err);
            console.log(`Dropped table ${table}.`);
        })
    });
};

/**
 * Query to retrieve client information
 * @param {*} con 
 * @param {*} response 
 */
function getClientInfo(con, email, response){
    const query = `SELECT * FROM kairos_users WHERE email='${email}'`;
    con.query(query, function (error, results, fields) {
        if (error) throw error;
        response.status(200).send({rslt: 'OK', data: results[0]});
    });
};

/**
 * Query to retrieve the client vacations summary
 * @param {*} con 
 * @param {*} params 
 * @param {*} response 
 */
function getVacationsSummary(con, params, response){
    const query = `SELECT * FROM employee_vacations WHERE email='${params.employeeId}'`;
    con.query(query, function (error, results, fields) {
        if (error) throw error;
        response.status(200).send({rslt: 'OK', data: results[0]});
    });
};

module.exports = {
    connectDB: createConnection,
    configEnv: configureEnvironment,
    getClient: getClientInfo,
    getVacations: getVacationsSummary,
    cleanDB: deleteDB
};