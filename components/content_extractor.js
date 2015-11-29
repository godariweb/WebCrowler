var cheerio = require("cheerio");
var validUrl = require('valid-url');
var isAbsoluteUrl = require('is-absolute-url');
var urlparser = require("url");
var striptags = require('striptags');
extractor = require('unfluff');


// Constructor
function ContentExtractor() {

}

/**
 * Remove html tags and retrun  plain text
 * @param html
 */
ContentExtractor.prototype.getAllTexts = function(html){
    data = striptags(html);
    return data.replace(/\s\s+/g, ' ');
}

ContentExtractor.prototype.getParagraphs = function(){

}
ContentExtractor.prototype.getSpans = function(){

}
ContentExtractor.prototype.getH1s = function(){

}
ContentExtractor.prototype.getH2s = function(){

}
ContentExtractor.prototype.getH3s = function(){

}
ContentExtractor.prototype.getH4s = function(){

}
ContentExtractor.prototype.getH5s = function(){

}
ContentExtractor.prototype.getH6s = function(){

}

// export the class
module.exports = ContentExtractor;
