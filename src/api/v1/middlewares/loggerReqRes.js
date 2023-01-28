const { createLogger, transports, format } = require('winston');

const TimeUtils = require('../helpers/TimeUtils');

const customFormat = format.combine(format.timestamp(), format.printf((info) => {
    return `${info.timestamp} - [${info.level.toUpperCase().padEnd(7)}] - ${info.message}`
}));

const today = TimeUtils.getIST().toISOString().slice(0,10);

const loggerReqRes = createLogger({
    format: customFormat,
    transports: [
        new transports.File({ filename: `fasttrack-log/${today}.log` })
    ]
});

module.exports = loggerReqRes;