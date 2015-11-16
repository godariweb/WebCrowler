var cheerio = require("cheerio");
var validUrl = require('valid-url');
var isAbsoluteUrl = require('is-absolute-url');
var urlparser = require("url");

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
                        //var cleanUrl = this.cleanTheUrl(href);
                        links.push(href);
                        numbOfCleanUrl++;
                    }
                } else {
                    var tempUrl = baseUrl + '/' + href;
                    if (validUrl.isUri(tempUrl)) {
                        //var cleanUrl = this.cleanTheUrl(tempUrl);
                        links.push(tempUrl);
                        numbOfCleanUrl++;
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
LinkExtrator.prototype.cleanTheUrl = function(url){
    var lastCharacter = url.slice(-1);
    if(lastCharacter == '#'){
        return url.substring(0, url.length - 1);
    }
    return url;
}

// export the class
module.exports = LinkExtrator;
