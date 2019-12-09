const express = require('express')
const app = express()
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors')
const UserRouter = require("./routes/signup-loginRoutes");
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");


 mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

// mongoose.connect('mongodb+srv://sayil:sayil2194@cluster0-knm9b.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('we are connected')
});

 

var corsOptions = {
  origin: 'https://bcd-backend.herokuapp.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

const port = 2194;

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/t', (req, res) => res.send(req.body))
app.use('/reg', require('./routes/signup-loginRoutes'))
app.use('/buy', require('./routes/purchase/buyRoutes'))

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))