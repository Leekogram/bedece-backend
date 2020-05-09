
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
            db: "mongodb+srv://sayil:SEYILNEN2194@cluster0-0j8cs.mongodb.net/test?retryWrites=true&w=majority",
            collection:'logs',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})


module.exports = logger;
