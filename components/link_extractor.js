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
                        if (!isLinkSocialMedia(cleanUrl) && !isLinkAResource(cleanUrl) && isLinkFromThisDomain(cleanUrl, baseUrl) && !isUrlToSendMail(cleanUrl)) {
                            links.push(cleanUrl);
                            numbOfCleanUrl++;
                        }
                    }
                } else {
                    var tempUrl = baseUrl + '/' + href;
                    if (validUrl.isUri(tempUrl)) {
                        var cleanUrl = cleanTheUrl(tempUrl);
                        if (!isLinkSocialMedia(cleanUrl) && !isLinkAResource(cleanUrl) && isLinkFromThisDomain(cleanUrl, baseUrl) && !isUrlToSendMail(cleanUrl)) {
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
    return url.split('#')[0];
}

/**
 * Check if link is used to send an email
 * http://kristogodari.com/mailto:kristo.godari@gmail.com
 * @param url
 * @returns {boolean}
 */
function isUrlToSendMail(url){
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
function isLinkFromThisDomain(link, domain) {
    if (link.indexOf(domain) > -1) {
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
