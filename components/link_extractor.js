var cheerio = require("cheerio");
var isAbsoluteUrl = require('is-absolute-url');
var urlparser = require("url");
var mysqlOperationsComponent = require('../services/mysql_operations');
var async = require('async');
var mysqlOperations = new mysqlOperationsComponent();
var baseUrl = '';

// Constructor
function LinkExtrator() {
}


/**
 * Returns an array with all links.
 * @param body
 */
LinkExtrator.prototype.getAllLinks = function (url, body, mainCallback) {
    baseUrl = getBaseUrl(url);
    var finalLinks = [];

    var links = [];
    var i = 0;
    var sqlQuery = "SELECT ";
    var $ = cheerio.load(body);

    $("a").each(function () {
        var href = $(this).attr("href");
        if (href) {
            var linkHref = cleanLink(href);
            if (checkIfIsValid(linkHref)) {
                links[i] = linkHref;
                sqlQuery += '(SELECT  count(`link`) FROM  `links_crawled`  WHERE  `link` =  "' + mysql_real_escape_string(linkHref) + '") as "' + i + '",';
                i++;
            }
        }
    });

    if (links.length > 0) {
        sqlQuery = sqlQuery.substring(0, sqlQuery.length - 1);
        sqlQuery += ' FROM `links_crawled` GROUP BY "1";';

        // console.log(sqlQuery);
        async.series([
                function (callback) {
                    mysqlOperations.executeQuery(sqlQuery, function (results) {
                        var j = 0;
                        for (var key in results[0]) {
                            if (results[0][key] == 0) {
                                finalLinks[j] = links[key];
                                j++;
                            }
                        }
                        callback(null);
                    });
                }
            ],
            function (err, results) {
                return mainCallback(null, finalLinks);
            });
    } else {
        return mainCallback(null, finalLinks);
    }
}


function checkIfLinkCrowled(linkHref) {
    mysqlOperations.getCrawledLinks(linkHref, function (results) {
        if (results.length > 0) {
            return true;
        } else {
            mysqlOperations.insertCrawledLinks(global.currentWebsiteId, linkHref, function (result) {
                return false;
            });
        }
    });
}


/**
 * Returns the cleaned link
 * @param body
 */
function cleanLink(link) {
    var url = getAbsoluteLink(link);
    url = url.split('#')[0];
    if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
    }
    return url;
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


function mysql_real_escape_string(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\" + char; // prepends a backslash to backslash, percent,
                                    // and double/single quotes
        }
    });
}

// export the class
module.exports = LinkExtrator;
