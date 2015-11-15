var cheerio = require("cheerio");

// Constructor
function LinkExtrator() {
}

/**
 * Returns an array with all links.
 * @param body
 */
LinkExtrator.prototype.getAllLinks = function (body) {
    var $ = cheerio.load(body);
    var links = new Array();

    $("a").each(function() {
        var link = $(this);
        var text = link.text();
        var href = link.attr("href");
        if(href){
            links.push(href);
        }
    });

    return links;
}

// export the class
module.exports = LinkExtrator;
