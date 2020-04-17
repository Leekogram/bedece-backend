

const {
    createLogger, transports, format
} = require('winston');
require('winston-mongodb');

const TransLog = createLogger({
    transports: [
        new transports.File({
            filename:'Transinfo.log',
            level:"info",
            format: format.combine(format.timestamp(), format.json())
        }),

        // new transports.MongoDB({
        //     level:'info',
        //     db: "mongodb+srv://sayil:sayil2194@cluster0-knm9b.mongodb.net/test?retryWrites=true&w=majority",
        //     collection:'TransLogs',
        //     format: format.combine(format.timestamp(), format.json())
        // })
    ]
})
module.exports = TransLog
