var express = require('express');
var request = require("request");
var cheerio = require("cheerio");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    request({
        uri: "http://www.kristogodari.com",
    }, function(error, response, body) {
        var $ = cheerio.load(body);

        $("a").each(function() {
            var link = $(this);
            var text = link.text();
            var href = link.attr("href");

            console.log(text + " -> " + href);
        });
    });
});

module.exports = router;
