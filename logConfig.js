
const {
    createLogger, transports, format
} = require('winston');
require('winston-mongodb');

const logger = createLogger({
    transports: [
        new transports.File({
            filename:'info.log',
            level:"info",
            format: format.combine(format.timestamp(), format.json())
        }),

        new transports.MongoDB({
            level:'info',
            db: "mongodb+srv://Jinn:jinnpassword@313bdccluster.x64qt.mongodb.net/313bdcCluster?retryWrites=true&w=majority",
            collection:'logs',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})


module.exports = logger;
