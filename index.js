
const express = require('express')
const app = express()
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors')
var db = mongoose.connection;
const UserRouter = require("./routes/signup-loginRoutes");
const port = 2194;
//this file is required so we can query our logs 
require('./workaround')

//this file is required so i can use the logger configuration
const logger = require('./logConfig')
var multipart = require('connect-multiparty');

var multer  = require('multer')
// set storage
var storage = multer.diskStorage({
  destination: 'uploads/'
})
 
var upload = multer({ storage: storage })

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var session = require('express-session');

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");


 //  mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useFindAndModify: false });

mongoose.connect('mongodb+srv://sayil:SEYILNEN2194@cluster0-0j8cs.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

// mongoose.connect('mongodb+srv://313Tester:313bdc@313TestCluster.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('we are connected')
});

app.use(cors())
// parse application/json
app.use(bodyParser.json())

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// for parsing multipart/form-data
 
app.use(express.static('public'));

// for express-sessions
app.use(session({secret: "sayil sunday",saveUninitialized: true,resave: true}));

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/reg', require('./routes/signup-loginRoutes'))
app.use('/test', require('./routes/sign-test'))
app.use('/trans', require('./routes/transactions/buyRoutes'))
app.use('/trans-sell', require('./routes/transactions/sellRoutes'))
app.use('/trans-logs', require('./routes/transactions/transLogsRoutes'))
app.use('/fx', require('./routes/fxRoutes/fxroutes'))
app.use('/logs', require('./routes/loggerRoutes'))
app.use('/admin', require('./routes/admin/adminRoutes'))


app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))
