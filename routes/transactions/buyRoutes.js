const router = require("express").Router();
const Buyer = require('../../models/purchase/buyShema')
const User = require('../../models/regSchema')
const transLogs = require('../../models/purchase/transLogsModels')
const logger = require('../../logConfig')
const TransLog = require('../../TranslogerConfig')
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

router.get('/', (req, res) => {
  res.send('its now working')
})
router.post('/buy', async (req, res) => {
  let userDetails
  let findUser = await User.find({
    _id: req.body.userId
  }, (err, result) => {
    if (err) {
      res.json({
        message: "Error: User, Unverified User"
      })
    } else if (result) {
      userDetails = result
    } else {
      res.json({
        message: "Error: User, Unverified User"
      })
    }

  })
  console.log(findUser)

  let newBuyer = new Buyer({
    Type: "BUY",
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
      }
    },
    userId: req.body.userId,
    user: {
      fname: userDetails[0].fname,
      lname: userDetails[0].lname,
      email: userDetails[0].email,
      phone: userDetails[0].phone
    },
    // transactionId: req.body.transactionId,
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
      logger.info(`status:SUCCESS, user:${req.body.userId}, type:buy, give: ${req.body.giveCurrency} ${req.body.giveAmount}, recieve: ${req.body.recieveCurrency} ${req.body.recieveAmount}, transactionID:${req.body.transactionId}, referenceId:${req.body.refference}`);

      TransLog.info({
        firstname: newBuyer.user.fname,
        lastname: newBuyer.user.lastname,
        email: newBuyer.user.email,
        refference: newBuyer.transDetails.refference,
        activity: "Buy Currency",
        amount: newBuyer.give.giveAmount,
        currency: newBuyer.give.giveCurrency,
        status: newBuyer.status,
        date: Date.now
      })


      // preparing to send data to all transaction logs
      let newTransLog = new transLogs({
        Type: "BUY",
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
          }
        },
        userId: req.body.userId,
        user: {
          fname: userDetails[0].fname,
          lname: userDetails[0].lname,
          email: userDetails[0].email,
          phone: userDetails[0].phone
        },
        // transactionId: req.body.transactionId,
        // status: req.body.status,
        deliveryMethod: req.body.deliveryMethod,

      })

      newTransLog
        .save()
        .then(trans => {
          res.json({
            message: "saved successfully",
            id: newBuyer._id
          })
        })


      // this fetches the users details to get their mails
      User.find({
        _id: req.body.userId
      }, (err, result) => {
        if (err) {
          res.send(err)
        } else {
          console.log(result[0].email)
          console.log(newBuyer, 'are the current users details')

          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: '313bureau@gmail.com',
              pass: '08067713959'
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
            border-collapse: collapse;">BDC ACCOUNT NUMBER</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${newBuyer.transDetails.creditAccount.bcdAccountNumber}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">ACCOUNT HOLDER</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${newBuyer.transDetails.creditAccount.bcdAccountName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">BANK NAME</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${newBuyer.transDetails.creditAccount.bcdBankName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">PAYMENT</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${newBuyer.give.giveAmount} ${newBuyer.give.giveCurrency}</td>
            </tr>
            <tr>
            <td style="border: 1px solid black;
            border-collapse: collapse;">RECIEVED</td>
            <td style="border: 1px solid black;
            border-collapse: collapse;">${newBuyer.recieve.recieveAmount} ${newBuyer.recieve.recieveCurrency}</td>
            </tr>
            <tr>
            <td style="border: 1px solid black;
            border-collapse: collapse;">REFFERENCE</td>
            <td style="border: 1px solid black;
            border-collapse: collapse;">${newBuyer.transDetails.refference}</td>
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
          });
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
  if (!req.query.startDate || !req.query.endDate) {
    res.send({
      error: true,
      message: "please enter date range for start and end"
    })
  } else {

    filter = req.query
    filter['created_date'] = {
      $gte: req.query.startDate,
      $lte: req.query.endDate
    }
    delete filter.startDate
    delete filter.endDate
    console.log(filter)

    Buyer.find(filter, (err, result) => {
      if (err) res.send(err)
      res.send(result)
    }).sort({
      created_date: -1
    })
  }

})

// to get all the buys
router.get('/all-buys-audit', (req, res) => {
  console.log(req.query)

  Buyer.aggregate(
    [{
        '$match': {
          created_date: {
            '$gte': new Date(req.query.startDate),
            '$lt': new Date(req.query.endDate)
          }
        }
      },
      {
        $group: {
          _id: "$recieve.recieveCurrency",
          "total": {
            $sum: "$recieve.recieveAmount"
          }
        }
      }
    ],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    }
  );

})


// get all the buys made by a single user
router.get('/all-buy/:id', (req, res) => {
  if (!req.query.startDate || !req.query.endDate) {
    res.send({
      error: true,
      message: "please enter date range for start and end"
    })
  } else {
    filter = req.query
    filter['userId'] = req.params.id
    filter['created_date'] = {
      $gte: req.query.startDate,
      $lte: req.query.endDate
    }
    delete filter.startDate
    delete filter.endDate
    // res.send(filter)
    Buyer.find(filter, (err, result) => {
      if (err) res.send(err)

      res.send(result)

    }).sort({
      created_date: -1
    })
  }


})

router.get('/get-buy/:id', (req, res) => {
  Buyer.find({
    _id: req.params.id
  }, (err, result) => {
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
  Buyer.findByIdAndUpdate(req.params.id, newInfo, {
    upsert: true,
    new: true
  }, (err, result) => {
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