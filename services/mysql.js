var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'msql',
    database : 'web_crowler'
});

module.exports = connection;
