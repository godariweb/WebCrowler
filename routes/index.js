/**
 * Requiring files
 * @type {*|exports|module.exports}
 */
var express = require('express');
var urlFrontierComponent = require('../components/url_frontier');
var urlListComponent = require('../components/url_list');
var linkExtractorComponent = require('../components/link_extractor');
var websiteGetContentComponent = require('../components/website_content_getter.js');
var contentExtractorComponent = require('../components/content_extractor.js');
var mysqlConnection = require('../services/mysql');
var fs = require('fs');

/**
 * Initializing variables
 */
var router = express.Router();
var urlList = new urlListComponent();
var urlFrontier = new urlFrontierComponent();
var linkExtractor = new linkExtractorComponent();
var websiteConentGetter = new websiteGetContentComponent();
var contentExtractor = new contentExtractorComponent();

/**
 * Index route.
 */
router.get('/', function (req, res, next) {

    var url = urlList.get().pop();
    urlFrontier.clear();
    urlFrontier.add(url);
    console.log('Url frontier length: ' + urlFrontier.length());
    recursiveCrowl();

    function recursiveCrowl() {
        if (urlFrontier.length() > 0) {
            var urlToCrowl = urlFrontier.get();
            console.log('---- Url wich is processed now : ' + urlToCrowl);
            websiteConentGetter.getContent(urlToCrowl, function (body) {
                extractLinks(urlToCrowl, body);
                var plainText = contentExtractor.getAllTexts(body);
                insertDataToDb(urlToCrowl, plainText);
                console.log('Url frontier length: ' + urlFrontier.length());
                recursiveCrowl();
            });
        }
    }

});


/**
 * Extract links and add to the url frontier.
 * @param url
 * @param body
 */
function extractLinks(url, body) {
    var allLinks = linkExtractor.getAllLinks(url, body);
    //console.log(allLinks);
    for (var i = 0; i < allLinks.length; i++) {
        if(!urlFrontier.isLinkInQueue(allLinks[i])){
            urlFrontier.add(allLinks[i]);
        }
    }
    //urlFrontier.iteration();
}

/**
 * Insert data to db.
 * @param websiteLink
 * @param websiteContent
 */
function insertDataToDb(websiteLink, websiteContent) {


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

module.exports = router;
