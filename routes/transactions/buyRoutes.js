const router = require("express").Router();
const Buyer = require('../../models/purchase/buyShema')
const User = require('../../models/regSchema')
const logger = require('../../logConfig')
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.get('/', (req, res) => {
  res.send('its now working')
})
router.post('/buy', (req, res) => {

  let newBuyer = new Buyer({
    give: {
      giveCurrency: req.body.giveCurrency,
      giveAmount: req.body.giveAmount
    },
    recieve: {
      recieveCurrency: req.body.recieveCurrency,
      recieveAmount: req.body.recieveAmount
    },
    transDetails: {
      creditAccount: {
        bcdAccountName: req.body.bcdAccountName,
        bcdAccountNumber: req.body.bcdAccountNumber,
        bcdBankName: req.body.bcdBankName
      },
      refference: req.body.refference
    },
    userId: req.body.userId,
    transactionId: req.body.transactionId,
    status: req.body.status,
    deliveryMethod: req.body.deliveryMethod,

  })
  newBuyer
    .save()
    .then(buyer => {
      res.status(200).json({
        message: "saved successfully"
      });
      console.log("success")
      logger.info(`status:SUCCESS, user:${req.body.userId}, type:buy, give: ${req.body.giveCurrency} ${req.body.giveAmount}, recieve: ${req.body.recieveCurrency} ${req.body.recieveAmount}, transactionID:${req.body.transactionId}`);

      // this fetches the users details to get their mails
      User.find({ _id: req.body.userId }, (err, result) => {
        if (err) { res.send(err) }
        else {
          //  res.send(result[0].email) 

          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'sundaysayil4u@gmail.com',
              pass: 'sayil2194'
            }
          });
          var mailOptions = {
            from: 'sundaysayil4u@gmail.com',
            to: result[0].email,
            subject: 'Sending Email using Node.js',
            html: `<h1>hi ${result[0].fname} ${result[0].lname}  </h1> <br><p> you made a purchase of with the following details </p>  <br>
          <p> ${newBuyer}</p>
      <p>in the following projects: ${req.body.interests}</p><br>
      phone:${req.body.phone}`
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              // res.send(error)
            } else {
              console.log('Email sent: ' + info.response);
              // res.send('Email sent, Thank You!! ');
            }
          });;
        }

      })

    })
    .catch(err => {
      console.log(err);
      logger.info(`status:FAILURE, user:${req.body.userId}, type:buy, give: ${req.body.giveCurrency} ${req.body.giveAmount}, recieve: ${req.body.recieveCurrency} ${req.body.recieveAmount}, transactionID:${req.body.transactionId}`)


    });





})
// to get all the buys
router.get('/all-buys', (req, res) => {
  Buyer.find((err, result) => {
    if (err) res.send(err)
    res.send(result)
  })
})


// get all the buys made by a single user
router.get('/all-buy/:id', (req, res) => {

  Buyer.find({ userId: req.params.id }, (err, result) => {
    if (err) res.send(err)

    res.send(result)

  })
})

router.get('/get-buy/:id', (req, res) => {
  Buyer.find({ _id: req.params.id }, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        result
      })
    }
  })
})


// to update a buy with its ID
router.put('/update-buy/:id', (req, res) => {
  // var newInfo = req.body
  let newInfo = req.body
  console.log(newInfo)
  Buyer.findByIdAndUpdate(req.params.id, newInfo, { upsert: true, new: true }, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        message: "Successfully updated",
        //  authData
        result
      })
    }
  })
})


module.exports = router