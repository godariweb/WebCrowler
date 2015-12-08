var fs = require('fs');

function LogService() {

}

/**
 * Logging an error
 */
LogService.prototype.logError = function (error) {
    if(error){
        var fileName = 'logs/error_log.txt';
        fs.appendFile(fileName, error + '\r\n', function(err){
            if(err) {
                return console.log(err);
            }
            console.log("-- An error occurred and was logged in the file " + fileName);
        });
    }
}

module.exports = LogService;
