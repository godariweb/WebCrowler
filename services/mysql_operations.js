var logComponent = require('../services/log_service');
var mysqlConnection = require('../services/mysql');
var log = new logComponent();

function MysqlOperations() {
}

/**
 * Insert data to db.
 * @param websiteLink
 * @param websiteContent
 */
MysqlOperations.prototype.insertPageData = function (
    websiteId, websiteUrl, contentHtml, contentText, pageViews,  pageAdded, pageShares) {

    var values = {
        website_id: websiteId,
        uri: websiteUrl,
        content: contentHtml,
        content_text: contentText,
        added: pageAdded,
        views: pageViews,
        shares: pageShares,
    };
    var query = mysqlConnection.query('INSERT INTO page SET ?', values, function (err, result) {
        if (err) {
            log.sqlErrorLog(err);
        }
    });
}


/**
 * Get initial list of websites that need to be crowled
 */
MysqlOperations.prototype.getWebsitesList = function (callback) {
    var query = mysqlConnection.query('SELECT * FROM `website`', function(err, results) {
        callback(results);
    });
}

// export the class
module.exports = MysqlOperations;
