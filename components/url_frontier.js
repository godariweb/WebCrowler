/**
 * UrlFrontier Class
 */

// private variable
var fifoQueue = require('fifo')();

// Constructor
function UrlFrontier() {

}

/**
 * Add new url to queue.
 */
UrlFrontier.prototype.add = function (url) {
    fifoQueue.push(url);
};


/**
 * Returns the last inserted  url in queue.
 */
UrlFrontier.prototype.get = function () {
    return fifoQueue.shift();
};


/**
 * Returns the length of the queue.
 */
UrlFrontier.prototype.length = function () {
    return fifoQueue.length;
};


// export the class
module.exports = UrlFrontier;
