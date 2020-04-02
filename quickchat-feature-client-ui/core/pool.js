const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '11111211111',
    database: "chat",
    multipleStatements: true
});

pool.getConnection((err, connection) => {
    if(err) 
        console.error("Something went wrong connecting to the database ...", err);
    
    if(connection){
        console.log("Successfully connected to the database...");
        connection.release();
    }

    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;