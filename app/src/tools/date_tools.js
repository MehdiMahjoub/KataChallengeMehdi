"use strict";

const momentTZ = require('moment-timezone');

const getNaiveDate = (dateStr, timezone)  => {

    return momentTZ(dateStr).tz(timezone).format("YYYY-MM-DDTHH:mm:ss");

}


module.exports = {
    getNaiveDate: getNaiveDate
}