var cheerio = require("cheerio");
var validUrl = require('valid-url');
var isAbsoluteUrl = require('is-absolute-url');
var urlparser = require("url");
var Regex = require("regex");

// Constructor
function LinkExtrator() {
}

/**
 * Returns an array with all links.
 * @param body
 */
LinkExtrator.prototype.getAllLinks = function (url, body) {
    var baseUrl = this.getBaseUrl(url);
    var $ = cheerio.load(body);
    var links = new Array();
    var numbOfUrl = 0;
    var numbOfCleanUrl = 0;
    $("a").each(function () {
            var link = $(this);
            var href = link.attr("href");
            numbOfUrl++;
            if (href) {
                if (isAbsoluteUrl(href)) {
                    if (validUrl.isUri(href)) {
                        var cleanUrl = cleanTheUrl(href);
                        if (!isLinkSocialMedia(cleanUrl)) {
                            links.push(cleanUrl);
                            numbOfCleanUrl++;
                        }
                    }
                } else {
                    var tempUrl = baseUrl + '/' + href;
                    if (validUrl.isUri(tempUrl)) {
                        var cleanUrl = cleanTheUrl(tempUrl);
                        if (!isLinkSocialMedia(cleanUrl)) {
                            links.push(cleanUrl);
                            numbOfCleanUrl++;
                        }
                    }
                }
            }
        }
    );
    console.log(numbOfUrl);
    console.log(numbOfCleanUrl);

    return links;
}

/**
 * Return absolute base url
 * http://www.google.com/search/bara/aana
 * returns http://www.google.com
 * @param url
 * @returns {string}
 */
LinkExtrator.prototype.getBaseUrl = function (url) {
    var urlData = urlparser.parse(url);
    return urlData.protocol + '//' + urlData.host;
}

/**
 * Apply clean logic. Ex: remove last '#' from url
 * @param url
 * @returns {*}
 */
function cleanTheUrl(url) {
    var lastCharacter = url.slice(-1);
    if (lastCharacter == '#') {
        return url.substring(0, url.length - 1);
    }
    return url;
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
function isLinkFromThisDomain(link, domain) {
    if (link.indexOf(domain) > -1) {
        return true;
    } else {
        return false;
    }
}


// export the class
module.exports = LinkExtrator;
