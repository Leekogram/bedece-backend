const router = require("express").Router();
const Buyer = require("../../models/purchase/buyShema");
const User = require("../../models/regSchema");
const transLogs = require("../../models/purchase/transLogsModels");
const activity = require("../../models/activitymodels");

const logger = require("../../logConfig");
const TransLog = require("../../TranslogerConfig");
var MongoClient = require("mongodb").MongoClient;
var nodemailer = require("nodemailer");
var addDays = require("../utility");
var removeDays = require("../utility");


router.get("/", (req, res) => {
  res.send("its now working");
});
router.post("/buy", async (req, res) => {
  let userDetails;
  let findUser = await User.find(
    {
      _id: req.body.userId,
    },
    (err, result) => {
      if (err) {
        res.json({
          message: "Error: User, Unverified User",
        });
      } else if (result.length > 0) {
        userDetails = result;
      } else if (result.length == 0) {
        res.json({
          message: "Error: User, Unverified User",
        });
      }
    }
  );
  console.log(findUser);

  // let newTransLog = new Buyer({
  //   Type: "BUY",
  //   give: {
  //     giveCurrency: req.body.giveCurrency,
  //     giveAmount: req.body.giveAmount,
  //   },
  //   recieve: {
  //     recieveCurrency: req.body.recieveCurrency,
  //     recieveAmount: req.body.recieveAmount,
  //   },
  //   transDetails: {
  //     creditAccount: {
  //       bcdAccountName: req.body.bcdAccountName,
  //       bcdAccountNumber: req.body.bcdAccountNumber,
  //       bcdBankName: req.body.bcdBankName,
  //     },
  //   },
  //   userId: req.body.userId,
  //   user: {
  //     fname: userDetails[0].fname,
  //     lname: userDetails[0].lname,
  //     email: userDetails[0].email,
  //     phone: userDetails[0].phone,
  //   },
  //   // transactionId: req.body.transactionId,
  //   // status: req.body.status,
  //   deliveryMethod: req.body.deliveryMethod
  // });

  let newTransLog = new transLogs({
    Type: "BUY",
    give: {
      giveCurrency: req.body.giveCurrency,
      giveAmount: req.body.giveAmount,
    },
    recieve: {
      recieveCurrency: req.body.recieveCurrency,
      recieveAmount: req.body.recieveAmount,
    },
    transDetails: {
      creditAccount: {
        bcdAccountName: req.body.bcdAccountName,
        bcdAccountNumber: req.body.bcdAccountNumber,
        bcdBankName: req.body.bcdBankName,
      },
    },
    userId: req.body.userId,
    user: {
      fname: userDetails[0].fname,
      lname: userDetails[0].lname,
      email: userDetails[0].email,
      phone: userDetails[0].phone,
    },
    // transactionId: req.body.transactionId,
    // status: req.body.status,
    deliveryMethod: req.body.deliveryMethod,
  });

  newTransLog
    .save()
    .then((buyer) => {
      res.json({
        message: "saved successfully",
        id: newTransLog._id,
      });
      console.log("success");

      let act = new activity({
        activity: "Transactions - BUY",
        userId: req.body.userId,
      })

      act.save()
     
      logger.info(
        `status:SUCCESS, user:${req.body.userId}, type:buy, give: ${req.body.giveCurrency} ${req.body.giveAmount}, recieve: ${req.body.recieveCurrency} ${req.body.recieveAmount}, transactionID:${req.body.transactionId}, referenceId:${req.body.refference}`
      );

      TransLog.info({
        firstname: newTransLog.user.fname,
        lastname: newTransLog.user.lastname,
        email: newTransLog.user.email,
        refference: newTransLog.transDetails.refference,
        activity: "Buy Currency",
        amount: newTransLog.give.giveAmount,
        currency: newTransLog.give.giveCurrency,
        status: newTransLog.status,
        date: Date.now,
      });

      User.find(
        {
          _id: req.body.userId,
        },
        (err, result) => {
          if (err) {
            res.send(err);
          } else {
            console.log(result[0].email);
            console.log(newTransLog, "are the current users details");

            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "313bureau@gmail.com",
                pass: "08067713959",
              },
            });
            var mailOptions = {
              from: "bcd ",
              to: result[0].email,
              subject: "313BDC transactions (buy)",
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
            border-collapse: collapse;">${newTransLog.transDetails.creditAccount.bcdAccountNumber}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">ACCOUNT HOLDER</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${newTransLog.transDetails.creditAccount.bcdAccountName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">BANK NAME</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${newTransLog.transDetails.creditAccount.bcdBankName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">PAYMENT</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${newTransLog.give.giveAmount} ${newTransLog.give.giveCurrency}</td>
            </tr>
            <tr>
            <td style="border: 1px solid black;
            border-collapse: collapse;">RECIEVED</td>
            <td style="border: 1px solid black;
            border-collapse: collapse;">${newTransLog.recieve.recieveAmount} ${newTransLog.recieve.recieveCurrency}</td>
            </tr>
            <tr>
            <td style="border: 1px solid black;
            border-collapse: collapse;">REFFERENCE</td>
            <td style="border: 1px solid black;
            border-collapse: collapse;">${newTransLog.transDetails.refference}</td>
            </tr>
          </table> <br>
          Thanks, <br>
          The 313BDC team <br>
          08031230313, 08099936398, 07058890313
         `,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
                // res.send(error)
              } else {
                console.log("Email sent: " + info.response);
                // res.send('Email sent, Thank You!! ');
              }
            });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      logger.info(
        `status:FAILURE, user:${req.body.userId}, type:buy, give: ${req.body.giveCurrency} ${req.body.giveAmount}, recieve: ${req.body.recieveCurrency} ${req.body.recieveAmount}, transactionID:${req.body.transactionId}`
      );
    });
});

// to get all the buys
router.get("/all-buys", (req, res) => {
  console.log(req.query);
  let start = "";
  let end = "";
  if (!req.query.startDate || !req.query.endDate) {
    (start = removeDays(new Date(), 30)), (end = new Date());
  } else {
    (start = req.query.startDate), (end = addDays(req.query.endDate, 1));
  }
  filter = req.query;
  filter["created_date"] = {
    $gte: start,
    $lte: end,
  };
  delete filter.startDate;
  delete filter.endDate;
  console.log(filter);


  transLogs
    .find(filter, (err, result) => {
      if (err) res.send(err);
      res.send(result);
    })
    .sort({
      created_date: -1,
    });
});

// to get all the buys
router.get("/all-buys-audit", (req, res) => {
  let start = "";
  let end = "";
  if (!req.query.startDate || !req.query.endDate) {
    start = removeDays(new Date(), 30), end = new Date();
  } else {
    start = new Date(req.query.startDate), end = new Date(addDays(req.query.endDate, 1));
  }

  console.log(start, end)

  transLogs.aggregate(
    [
      {
        $match: {
          created_date: {
            $gte: start,
            $lt: end,
          },
          Type: "BUY",
        },
      },
      {
        $group: {
          _id: "$recieve.recieveCurrency",
          total: {
            $sum: "$recieve.recieveAmount",
          },
        },
      },
    ],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    }
  );
});

// get all the buys made by a single user
router.get("/all-buy/:id", (req, res) => {
  console.log(req.query);
  let start = "";
  let end = "";
  if (!req.query.startDate || !req.query.endDate) {
    (start = removeDays(new Date(), 30)), (end = new Date());
  } else {
    (start = req.query.startDate), (end = addDays(req.query.endDate, 1));
  }
  filter = req.query;
  filter["created_date"] = {
    $gte: start,
    $lte: end,
  };
  filter["Type"] = "BUY";
  delete filter.startDate;
  delete filter.endDate;
  console.log(filter);

  filter = req.query;
  filter["userId"] = req.params.id;
  transLogs
    .find(filter, (err, result) => {
      if (err) res.send(err);
      res.send(result);
    })
    .sort({
      created_date: -1,
    });
});

// router.get("/search-buy", async (req, res) => {
//   Buyer.find({ $text: { $search: req.query.search } }).exec(function (
//     err,
//     docs
//   ) {
//     res.send({ doc: docs, err });
//   });
// });

router.get("/get-buy/:id", (req, res) => {
  transLogs.find(
    {
      _id: req.params.id,
    },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          result,
        });
      }
    }
  );
});

// to update a buy with its ID
router.put("/update-buy/:id", (req, res) => {
  // var newInfo = req.body
  let newInfo = req.body;
  console.log(newInfo);
  transLogs.findByIdAndUpdate(
    req.params.id,
    newInfo,
    {
      upsert: true,
      new: true,
    },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          message: "Successfully updated",
          //  authData
          result,
        });
       
        let act = new activity({
          activity: "Transactions - UPDATE BUY",
          userId: req.body.userId,
        })
        act.save()
      }
    }
  );
});

module.exports = router;
