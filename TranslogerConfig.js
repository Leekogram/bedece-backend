

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

        new transports.MongoDB({
            level:'info',
           // db: "mongodb+srv://sayil:SEYILNEN2194@cluster0-0j8cs.mongodb.net/test?retryWrites=true&w=majority",
            db: "mongodb+srv://Jinn:jinnpassword@313bdccluster.x64qt.mongodb.net/313bdcCluster?retryWrites=true&w=majority",
            collection:'TransLogs',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})
module.exports = TransLog
