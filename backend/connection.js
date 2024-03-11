//Configuration de la connexion à la bdd
const mysql= require('mysql');
require('dotenv').config();

//Paramètre de connexion
var connection = mysql.createConnection({
    // port: process.env.DB_PORT,
    // host: process.env.DB_HOST,
    // user: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME
    port: process.env.DB_PORT,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node1',
    socket:"C:/xampp/mysql/mysql.sock"
})

connection.connect((error) => {
    if(!error){
        console.log("Connected");
    }
    else{
        console.log(error);
    }
} )

module.exports = connection;

