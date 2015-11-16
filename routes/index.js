var express = require('express');
var router = express.Router();
var urlFrontierComponent = require('../components/url_frontier');
var urlListComponent = require('../components/url_list');
var linkExtractorComponent = require('../components/link_extractor');
var websiteGetContentComponent =  require('../components/website_content_getter.js');


router.get('/', function (req, res, next) {

    var urlList = new urlListComponent();
    var urlFrontier = new urlFrontierComponent();
    var linkExtractor = new linkExtractorComponent();
    var websiteConentGetter = new websiteGetContentComponent();

    var url = urlList.get().pop();
    var content = websiteConentGetter.getContent(url, function(body){
        extractLinks(body);
    });

    // extract links and add to the url frontier.
    function extractLinks(body){
        var allLinks =  linkExtractor.getAllLinks(url, body);
        //console.log(allLinks);
        for (var i = 0; i < allLinks.length; i++) {
            urlFrontier.add(allLinks[i]);
        }
        urlFrontier.iteration();
    }
});

module.exports = router;
