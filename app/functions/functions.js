function getTime() {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000); // UTC time
    var offset = 7; // UTC +7 hours
    var gmt7 = new Date(utc + (3600000 * (offset - d.getTimezoneOffset() / 60)));
    return gmt7;
}

module.exports = {
    getTime
};