const winston = require('winston');
const { createLogger, format, transports } = require('winston');

const path = require('path');
const config = require('./config_tool')(path.join(__dirname, 'config/env'));
const { combine, timestamp, label, printf, json } = format;
const dateTools = require('./date_tools');
const DailyRotateFile = require("winston-daily-rotate-file");


const myFormat = printf(({ level, message, label, timestamp, tags }) => {
    let dateTZ = dateTools.getNaiveDate(timestamp, "Europe/paris");
    return `${dateTZ} ${level} ${config.get("logger:application")} [${tags}] ${message}`;
});

let logger;

module.exports.getLogger = function (mylabel) {

    if (!logger) {
        logger = createLogger({
            format: combine(
                label({ label: mylabel }),
                timestamp(),
                json(),
                myFormat
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    datePattern: 'YYYY-MM-DD',
                    filename: path.join(__dirname, '../../logs', 'cataloge-%DATE%.log'),
                    zippedArchive: true,
                    maxFiles: '5d'
                })
            ]
        });
    }


    return logger;
}
