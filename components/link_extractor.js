var cheerio = require("cheerio");
var validUrl = require('valid-url');
var isAbsoluteUrl = require('is-absolute-url');
var urlparser = require("url");
var mysqlOperationsComponent = require('../services/mysql_operations');
var async = require('async');
var Regex = require("regex");
var mysqlOperations = new mysqlOperationsComponent();
var baseUrl = '';
// Constructor
function LinkExtrator() {
}


/**
 * Returns an array with all links.
 * @param body
 */
LinkExtrator.prototype.getAllLinks = function (url, body) {
    baseUrl = getBaseUrl(url);
    var links = new Array();
    var $ = cheerio.load(body);
    $("a").each(function () {
        var linkHref = $(this).attr("href");
        if (linkHref) {
            console.log("Original link:" + linkHref);
            linkHref = cleanLink(linkHref);
            console.log("Cleaned link:" + linkHref);
            if (checkIfIsValid(linkHref)) {
                console.log("Valid link:" + linkHref);

                async.waterfall([
                    function(callback) {
                        mysqlOperations.getCrawledLinks(linkHref, function (results) {
                            console.log("Get crawl link:" + linkHref);
                            console.log("Query results:" + results);
                            callback(null, results);
                        });
                    },
                    function(results, callback) {
                        if (results.length > 0) {
                            links.push(linkHref);
                            callback(null, null);
                        }else{
                            callback(null, 'three');
                        }
                    },
                    function(result, callback) {
                        if(result != null){
                            console.log("Link not crawled add link to db:" + linkHref);
                            mysqlOperations.insertCrawledLinks(global.currentWebsiteId, linkHref, function(result){
                                callback(null, 'done');
                            });
                        }else{
                            callback(null, 'done');
                        }
                    }
                ], function (err, result) {
                    // result now equals 'done'
                });
            }
        }
    });

    return links;
}


function checkIfLinkCrowled(linkHref, callback) {
    mysqlOperations.getCrawledLinks(linkHref, function (results) {
        console.log("Get crawl link:" + linkHref);
        console.log("Query results:" + results);
        if (results.length > 0) {
            callback(true);
        } else {
            console.log("Link not crawled add link to db:" + linkHref);
            mysqlOperations.insertCrawledLinks(global.currentWebsiteId, linkHref, function(result){
                callback(false);
            });
        }
    });
}

/**
 * Returns the cleaned link
 * @param body
 */
function cleanLink(link) {
    url = getAbsoluteLink(link);
    return url.split('#')[0];
}

/**
 * Detects rather link is absolute and relatieve and
 * if it is relative converts it to absolute.
 * @param link
 */
function getAbsoluteLink(link) {
    if (isAbsoluteUrl(link)) {
        return link;
    } else {
        return baseUrl + '/' + link;
    }
}

/**
 * Return true if link is valid
 * @param link
 * @returns {boolean}
 */
function checkIfIsValid(link) {
    if (!isLinkSocialMedia(link)
        && !isLinkAResource(link)
        && isLinkFromThisDomain(link)
        && !isUrlToSendMail(link)
    ) {
        return true;
    } else {
        return false;
    }
}

/**
 * Return absolute base url
 * http://www.google.com/search/bara/aana
 * returns http://www.google.com
 * @param url
 * @returns {string}
 */
function getBaseUrl(url) {
    var urlData = urlparser.parse(url);
    return urlData.protocol + '//' + urlData.host;
}


/**
 * Check if link is used to send an email
 * http://kristogodari.com/mailto:kristo.godari@gmail.com
 * @param url
 * @returns {boolean}
 */
function isUrlToSendMail(url) {
    if (url.indexOf('mailto') > -1) {
        return true;
    } else {
        return false;
    }
}
/**
 *
 * @param url
 */
function isLinkSocialMedia(url) {
    var socialMediaLinks = [
        'google.com',
        'facebook.com',
        'youtube.com',
        'linkedin.com',
        'flickr.com',
        'twitter.com',
        'instagram.com',
        'pinterest.com',
        'qzone.qq.com',
        'vk.com',
        'tumblr.com',
        'renren.com',
        'bebo.com',
        'tagged.com',
        'orcut.com',
        'netlog.com',
        'goodreads.com',
        'soundcloud.com',
        'about.me',
        'ask.fm'
    ];

    var socialMedia = [];

    socialMediaLinks.forEach(checkIfSocialMedia);

    function checkIfSocialMedia(element, index, array) {
        if (url.indexOf(element) > -1) {
            socialMedia.push(element);
        }
    }

    if (socialMedia.length > 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check if link is from domain.
 * @param url
 */
function isLinkFromThisDomain(link) {
    if (link.indexOf(baseUrl) > -1) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check if link is a resource ex: image, pdf, doc...
 * @param link
 * @returns {boolean}
 */
function isLinkAResource(link) {
    var staticFilesLink = [
        '.css',
        '.js',
        '.avi',
        '.doc',
        '.docx',
        '.ppt',
        '.pptx',
        '.exe',
        '.gif',
        '.jpg',
        '.jpeg',
        '.mid',
        '.midi',
        '.mp3',
        '.mpg',
        '.mpeg',
        '.qt',
        '.pdf',
        '.png',
        '.ram',
        '.rar',
        '.zip',
        '.tiff',
        '.wav',
    ];

    var staticFilesLinks = [];

    staticFilesLink.forEach(checkIfStaticFiles);

    function checkIfStaticFiles(element, index, array) {
        if (link.match(element + "$")) {
            staticFilesLinks.push(element);
        }
    }

    if (staticFilesLinks.length > 0) {
        return true;
    } else {
        return false;
    }
}


// export the class
module.exports = LinkExtrator;
