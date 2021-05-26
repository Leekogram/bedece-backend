const router = require("express").Router();
const Seller = require("../../models/purchase/sellSchema");
const logger = require("../../logConfig");
const transLogs = require("../../models/purchase/transLogsModels");
const User = require("../../models/regSchema");
var nodemailer = require("nodemailer");
var addDays = require("../utility");
var removeDays = require("../utility");
const activity = require("../../models/activitymodels");


router.get("/t", (req, res) => {
  res.send("its now working");
});
router.post("/sell", async (req, res) => {
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
  //   console.log(userDetails[0].fname, "out");

  let newTransLog = new transLogs({
    Type: "SELL",
    pay: {
      payCurrency: req.body.payCurrency,
      payAmount: req.body.payAmount,
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
      debitAccount: {
        clientAccountName: req.body.clientAccountName,
        clientAccountNumber: req.body.clientAccountNumber,
        clientBankName: req.body.clientBankName,
      },
    },

    userId: req.body.userId,
    user: {
      fname: userDetails[0].fname,
      lname: userDetails[0].lname,
      email: userDetails[0].email,
      phone: userDetails[0].phone,
    },
    transactionId: req.body.transactionId,
    status: req.body.status,
    deliveryMethod: req.body.deliveryMethod,
    deliveryAddress: req.body.deliveryAddress,
  });

  newTransLog
    .save()
    .then((seller) => {
      res.json({
        message: "saved successfully",
        id: newTransLog._id,
      });
      logger.info(
        `status:SUCCESS, user:${req.body.userId}, type:sell, give:${req.body.giveCurrency}${req.body.giveAmount}, recieve:${req.body.recieveCurrency}${req.body.recieveAmount}, transactionID:${req.body.transactionId}`
      );
      console.log("success");
      let act = new activity({
        activity: "Transactions - SELL",
        userId: req.body.userId,
      })
      act.save()

      // preparing to send data to all transaction logs

      // this fetches the users details to get their mails
      User.find(
        {
          _id: req.body.userId,
        },
        (err, result) => {
          if (err) {
            res.send(err);
          } else {
            // res.send(result)
            console.log(req.body.userId);

            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "313bureau@gmail.com",
                pass: "08067713959",
              },
            });
            var mailOptions = {
              from: "bdc (sell)",
              to: result[0].email,
              subject: "313BDC transactions (sell)",
              html: `
            <h2>313BDC</h2>
          
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
            border-collapse: collapse;">${newTransLog.pay.payAmount} ${newTransLog.pay.payCurrency}</td>
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
        `status:FAILURE, user:${req.body.userId}, type:buy, give:${req.body.giveCurrency}${req.body.giveAmount}, recieve:${req.body.recieveCurrency}${req.body.recieveAmount}, transactionID:${req.body.transactionId}`
      );
    });
});
// to get all the sells
router.get("/all-sell", (req, res) => {
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
  filter["Type"] = "SELL";
  delete filter.startDate;
  delete filter.endDate;
  console.log(filter);

  transLogs
    .find(filter, (err, result) => {
      if (err) {
        res.send(err);
      }

      res.status(200).send({
        result: result,
      });
    })
    .sort({
      created_date: -1,
    });
});

router.get("/all-sells-audit", (req, res) => {
  let start = "";
  let end = "";
  if (!req.query.startDate || !req.query.endDate) {
    (start = removeDays(new Date(), 30)), (end = new Date());
  } else {
    (start = new Date(req.query.startDate)),
      (end = new Date(addDays(req.query.endDate, 1)));
  }

  console.log(start, end);

  transLogs.aggregate(
    [
      {
        $match: {
          created_date: {
            $gte: start,
            $lt: end,
          },
          Type: "SELL",
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

// get all the sells made by a single user
router.get("/all-sell/:id", (req, res) => {
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
  filter["Type"] = "SELL";
  delete filter.startDate;
  delete filter.endDate;
  console.log(filter);

  filter = req.query;
  filter["userId"] = req.params.id;
  transLogs
    .find(filter, (err, result) => {
      if (err) res.send(err);

      res.status(200).send({
        result: result,
      });
    })
    .sort({
      created_date: -1,
    });
});
// get a particular sell with its ID
router.get("/get-sell/:id", (req, res) => {
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

// to update a sell with its ID
router.put("/update-sell/:id", (req, res) => {
  // var newInfo = req.body
  let newInfo = req.body;
  console.log(req.body);
  transLogs.findByIdAndUpdate(
    req.params.id,
    newInfo,
    {
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
        console.log("success");
        let act = new activity({
          activity: "Transactions - UPDATE SELL",
          userId: req.body.userId,
        })
        act.save()
      }
    }
  );
});

module.exports = router;
