const router = require("express").Router();
const Buyer = require('../../models/purchase/buyShema')
const User = require('../../models/regSchema')
const logger = require('../../logConfig')
const TransLog = require ('../../TranslogerConfig')
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
    // status: req.body.status,
    deliveryMethod: req.body.deliveryMethod,

  })
  newBuyer
    .save()
    .then(buyer => {
      res.json({
        message: "saved successfully",
        id: newBuyer._id

      });
      console.log("success")
      logger.info(`status:SUCCESS, user:${req.body.userId}, type:buy, give: ${req.body.giveCurrency} ${req.body.giveAmount}, recieve: ${req.body.recieveCurrency} ${req.body.recieveAmount}, transactionID:${req.body.transactionId}`);

      TransLog.info({
        userName:newBuyer.userId, transId:newBuyer.transactionId, activity:"Buy Currency", amount:newBuyer.give.giveAmount,
        currency:newBuyer.give.giveCurrency, status:newBuyer.status, date:Date.now
      })

      // this fetches the users details to get their mails
      User.find({ _id: req.body.userId }, (err, result) => {
        if (err) { res.send(err) }
        else {
          console.log(result[0].email)

          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'sundaysayil4u@gmail.com',
              pass: 'elisha2194'
            }
          });
          var mailOptions = {
            from: 'bcd ',
            to: result[0].email,
            subject: '313BDC transactions (buy)',
            html: ` 
            <h2>313BDC</h2>
            <div> 313BDC <br>
            Babura House Plaza,<br>
            Addis Ababa Cresent,<br>
            Off Ladi Kwali Street<br>
            Wuse Zone 4, Abuja
            </div>        
            <p>Dear ${result[0].fname},  </p> you made a transaction with the following details 
            <table style="width:100%">
            <caption>Transactions</caption> <br>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">Transaction ID</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${ newBuyer._id}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">BDC ACCOUNT NUMBER</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${ newBuyer.transDetails.creditAccount.bcdAccountNumber}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">ACCOUNT HOLDER</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${ newBuyer.transDetails.creditAccount.bcdAccountName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">BANK NAME</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${ newBuyer.transDetails.creditAccount.bcdBankName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">PAYMENT</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${ newBuyer.give.giveAmount} ${newBuyer.give.giveCurrency}</td>
            </tr>
            <tr>
            <td style="border: 1px solid black;
            border-collapse: collapse;">RECIEVED</td>
            <td style="border: 1px solid black;
            border-collapse: collapse;">${ newBuyer.recieve.recieveAmount} ${newBuyer.recieve.recieveCurrency}</td>
            </tr>
          </table> <br>
          Thanks, <br>
          The 313BDC team <br>
          08031230313, 08099936398, 07058890313
         `
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