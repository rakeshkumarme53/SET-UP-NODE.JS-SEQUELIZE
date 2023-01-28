const loggerReqRes = require('./loggerReqRes');

module.exports = async (req, res, next) => {
    loggerReqRes.info(`Req : ${req}`);
    return next();
}