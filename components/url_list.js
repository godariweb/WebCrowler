/**
 * UrlList Class
 * This object will contain an start url list that
 * crawler will user to start scraping.
 * @constructor
 */
function UrlList() {
    this.list = new Array();
    this.initialiseList();
}

/**
 * Populating the list with predefined start urls.
 */
UrlList.prototype.initialiseList = function () {
    //this.list.push("http://www.top-channel.tv/lajme/");
    this.list.push("http://campanii.gandul.info/plagiatorii/");
}

/**
 * Adding an new url to the predefinded list.
 */
UrlList.prototype.add = function (url) {
    this.list.push(url);
};

/**
 * Returns the url array.
 */
UrlList.prototype.get = function () {
    return this.list;
};

/**
 * Returns the url array.
 */
UrlList.prototype.length = function () {
    return this.list.length;
};


// export the class
module.exports = UrlList;
