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
var logComponent = require('../services/log_service');
var fs = require('fs');
var risComponent = require('../components/rewind_input_steram.js');
var async = require('async');

/**
 * Initializing variables
 */
var router = express.Router();
var urlList = new urlListComponent();
var urlFrontier = new urlFrontierComponent();
var linkExtractor = new linkExtractorComponent();
var websiteConentGetter = new websiteGetContentComponent();
var contentExtractor = new contentExtractorComponent();
var ris = new risComponent();
var log = new logComponent();


var currentCrawlingUrl = null;

/**
 * Index route.
 */
router.get('/', function (req, res, next) {
    getNextWebsiteFromListAndStartCrawling();
});

/**
 * Start with the initial url list, get next website, add it to the
 * urlFrontier and start crawling.
 */
function getNextWebsiteFromListAndStartCrawling() {
    urlFrontier.clear();
    urlFrontier.add(urlList.get().pop());
    console.log('Starting to crawl.... :)');
    startCrawling();
}

/**
 * Get next url from urlFrontier and get the content.
 */
function startCrawling() {
    console.log('Url frontier length: ' + urlFrontier.length());
    if (urlFrontier.length() > 0) {
        var link = urlFrontier.get();
        getLinkContentAndStartProcessing(link);
    } else {
        if (urlList.length() > 0) {
            getNextWebsiteFromListAndStartCrawling();
        } else {
            console.log('-- Job done. All websites from initial list crawled. ;)');
            console.log('-- Proud of me master? :)');
        }
    }
}

/**
 * Get website content and start processign
 * @param url
 */
function getLinkContentAndStartProcessing(url) {
    console.log('Getting content from : ' + url);
    currentCrawlingUrl = url;
    websiteConentGetter.getContent(url, processWebsiteContent);
}

/**
 * Process website content
 * @param websiteContent
 * @param websiteUrl
 */
function processWebsiteContent(websiteContent) {
    ris.setContent(websiteContent);
    //console.log('Content getted: ' + ris.getContent());
    async.parallel([
            function (callback) {
                extractHtml(ris.getContent(), callback)
            },
            function (callback) {
                extractText(ris.getContent(), callback)
            },
            function (callback) {
                extractLinks(ris.getContent(), callback)
            },
            function (callback) {
                extractPageViews(ris.getContent(), callback)
            },
            function (callback) {
                extractDate(ris.getContent(), callback)
            },
            function (callback) {
                extractShares(ris.getContent(), callback)
            },
        ],
        function (err, results) {
            if (!err) {
                processParalelResults(results);
                startCrawling();
            } else {
                log.logError(err);
            }
        }
    );
}

/**
 * Retrun the html content.
 */
function extractHtml(content, callback) {
    callback(null, content);
}

/**
 * Extract only text from content.
 */
function extractText(content, callback) {
    // put here code do extract text
    callback(null, "Test content.");
}

/**
 * Extract links from content.
 */
function extractLinks(content, callback) {
    contentLinks = linkExtractor.getAllLinks(currentCrawlingUrl, content);
    callback(null, contentLinks);
}

/**
 * Extract how may users have viewed the page.
 */
function extractPageViews(content, callback) {
    // put here code do extract vews
    callback(null, 2566);
}

/**
 * Extract the date the page was created.
 * YYYY-MM-DD HH:MM:SS
 */
function extractDate(content, callback) {
    // put here code do extract date
    callback(null, "2015-05-20 05:03:20");
}

/**
 * Extract how many users have shared the page.
 */
function extractShares(content, callback) {
    // put here code do extract vews
    callback(null, 356);
}


/**
 * Add data to database and add lins to url frontier.
 */
function processParalelResults(results) {
    saveDataToSQL(results);
    addExtractedLinksToUrlFrontier(results[2]);
}

/**
 * Add extracted links to urlFrontier
 */
function addExtractedLinksToUrlFrontier(links) {
    for (var i = 0; i < links.length; i++) {
        if (!urlFrontier.isLinkInQueue(links[i])) {
            urlFrontier.add(links[i]);
        }
    }
}

/**
 * Insert data in database
 * @param data
 */
function saveDataToSQL(data){
    // to do adding data to sql
}

module.exports = router;
