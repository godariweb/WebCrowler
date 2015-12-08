function MysqlOperations() {
}


/**
 * Insert data to db.
 * @param websiteLink
 * @param websiteContent
 */
function saveHtmlConent() {


    var values = {
        url: websiteLink,
        content: websiteContent
    };

    var query = mysqlConnection.query('INSERT INTO posts SET ?', values, function (err, result) {
        if (err) {
            var fileName = 'logs/mysql_error_log.txt';
            fs.appendFile(fileName, err + '\r\n', function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("-- An error occurred and was logged in the file " + fileName);
            })
        }
    });

    //console.log(query.sql);

}



// export the class
module.exports = MysqlOperations;
