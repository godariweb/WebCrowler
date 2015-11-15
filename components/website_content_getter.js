/**
 * Request dependencies
 * @type {request|exports|module.exports}
 */
var request = require("request");
var fs = require('fs');

/**
 * Constructor
 * @constructor
 */
function WebsiteContentGetter() {

}

/**
 * Returns the html content of a given uri.
 * If error log the errors in a file.
 */
WebsiteContentGetter.prototype.getContent = function(uri, callback)
{
    request({
        uri: uri,
    }, function (error, response, body) {
        if(!error){
             callback(body);
        }else{
            var fileName = 'logs/error_log.txt';
            fs.appendFile(fileName, error + '\r\n', function(err){
                if(err) {
                    return console.log(err);
                }
                console.log("-- An error occurred and was logged in the file " + fileName);
            })
        }
    });
}

// export the class
module.exports = WebsiteContentGetter;
