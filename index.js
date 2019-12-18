
const express = require('express')
const app = express()
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors')
var db = mongoose.connection;
const UserRouter = require("./routes/signup-loginRoutes");
const port = 2194;
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs


// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");


  // mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

mongoose.connect('mongodb+srv://sayil:sayil2194@cluster0-knm9b.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('we are connected')
});

 

// var corsOptions = {
//   origin: 'https://bcd-backend.herokuapp.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
app.use(cors())
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));



app.get('/', (req, res) => res.send('Hello World!'))
app.use('/reg', require('./routes/signup-loginRoutes'))
app.use('/trans', require('./routes/transactions/buyRoutes'))

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))