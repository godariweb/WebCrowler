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
MysqlOperations.prototype.insertPageData = function (websiteId, websiteUrl, contentHtml, contentText, pageViews, pageAdded, pageShares) {

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
 * Insert crawled link to db
 */
MysqlOperations.prototype.insertCrawledLinks = function (websiteId, link, callback) {

    var values = {
        website_id: websiteId,
        link: link
    };

    var query = mysqlConnection.query('INSERT INTO `links_crawled` SET ?', values, function (err, result) {
        if (err) {
            log.sqlErrorLog(err);
        }
        callback(result);
    });
}


/**
 * Get initial list of websites that need to be crowled
 */
MysqlOperations.prototype.getWebsitesList = function (callback) {
    var query = mysqlConnection.query('SELECT * FROM `website`', function (err, results) {
        callback(results);
    });
}


/**
 * Get crowled links
 */
MysqlOperations.prototype.getCrawledLinks = function (link, callback) {
    var queryString = 'SELECT * FROM `links_crawled` WHERE `link`= "' + link + '"';
    var query = mysqlConnection.query(queryString, function (err, results) {
        callback(results);
    });
}


/**
 * Get crowled links
 */
MysqlOperations.prototype.executeQuery = function (queryString, callback) {
    mysqlConnection.query(queryString, function (err, results) {
        callback(results);
    });
}

// export the class
module.exports = MysqlOperations;
