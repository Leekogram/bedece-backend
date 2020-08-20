const router = require("express").Router();
const Seller = require('../../models/purchase/sellSchema')
const logger = require('../../logConfig')
const transLogs = require('../../models/purchase/transLogsModels')
const User = require('../../models/regSchema')
var nodemailer = require('nodemailer');
router.get('/t', (req, res) => {
    res.send('its now working')
})
router.post('/sell', async (req, res) => {

    var a = new Date();
    var month = ("0" + (a.getMonth() + 1)).slice(-2);
    var day = ("0" + a.getDate()).slice(-2);
    var year = a.getFullYear()
    var hours = a.getHours();
    var minutes = a.getMinutes();
    var myTime = ('0000' + (hours * 100 + minutes)).slice(-4);
    let counter

    let userDetails
    await User.find({ _id: req.body.userId }, (err, result) => {
        userDetails = result;

    })
    await Seller.find( (err, result) => {
        if (err) {
          res.json({
            message: "Error: User, Unverified User"
          })
        }
        else {
          counter = result
        }
    
      })
    console.log(userDetails[0].fname, "out")
    let newSeller = new Seller({
        pay: {
            payCurrency: req.body.payCurrency,
            payAmount: req.body.payAmount
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
            debitAccount: {
                clientAccountName: req.body.clientAccountName,
                clientAccountNumber: req.body.clientAccountNumber,
                clientBankName: req.body.clientBankName
            },
            refference:`${myTime}${day}${month}${year}313BDC${counter.length+1}`

        },

        userId: req.body.userId,
        user: {
            fname: userDetails[0].fname,
            lname: userDetails[0].lname,
            email: userDetails[0].email,
            phone: userDetails[0].phone
        },
        transactionId: req.body.transactionId,
        status: req.body.status,
        deliveryMethod: req.body.deliveryMethod,
        deliveryAddress:
            req.body.deliveryAddress,
    })

    console.log(newSeller)
    newSeller
        .save()
        .then(seller => {
            res.json({
                message: "saved successfully",
                id: newSeller._id
            });
            logger.info(`status:SUCCESS, user:${req.body.userId}, type:sell, give:${req.body.giveCurrency}${req.body.giveAmount}, recieve:${req.body.recieveCurrency}${req.body.recieveAmount}, transactionID:${req.body.transactionId}`)
            console.log("success")

            // preparing to send data to all transaction logs
            let newTransLog = new transLogs({
                Type: "SELL",
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
            User.find({ _id: req.body.userId }, (err, result) => {
                if (err) { res.send(err) }
                else {
                    // res.send(result) 
                    console.log(req.body.userId)

                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: '313bureau@gmail.com',
                            pass: '08067713959'
                        }
                    });
                    var mailOptions = {
                        from: 'bdc (sell)',
                        to: result[0].email,
                        subject: '313BDC transactions (sell)',
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
            border-collapse: collapse;">${ newSeller.transDetails.creditAccount.bcdAccountNumber}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">ACCOUNT HOLDER</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${ newSeller.transDetails.creditAccount.bcdAccountName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">BANK NAME</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${ newSeller.transDetails.creditAccount.bcdBankName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid black;
            border-collapse: collapse;">PAYMENT</td>
              <td style="border: 1px solid black;
            border-collapse: collapse;">${ newSeller.pay.payAmount} ${newSeller.pay.payCurrency}</td>
            </tr>
            <tr>
            <td style="border: 1px solid black;
            border-collapse: collapse;">RECIEVED</td>
            <td style="border: 1px solid black;
            border-collapse: collapse;">${ newSeller.recieve.recieveAmount} ${newSeller.recieve.recieveCurrency}</td>
            </tr>
            <tr>
            <td style="border: 1px solid black;
            border-collapse: collapse;">REFFERENCE</td>
            <td style="border: 1px solid black;
            border-collapse: collapse;">${ newSeller.transDetails.refference}</td>
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
            logger.info(`status:FAILURE, user:${req.body.userId}, type:buy, give:${req.body.giveCurrency}${req.body.giveAmount}, recieve:${req.body.recieveCurrency}${req.body.recieveAmount}, transactionID:${req.body.transactionId}`)
        });

})
// to get all the sells
router.get('/all-sell', (req, res) => {
    Seller.find((err, result) => {
        if (err) res.send(err)

        res.status(200).send({
            result: result
        })

    })
})

// get all the sells made by a single user
router.get('/all-sell/:id', (req, res) => {

    Seller.find({ userId: req.params.id }, (err, result) => {
        if (err) res.send(err)

        res.status(200).send({
            result: result
        })

    })
})
// get a particular sell with its ID
router.get('/get-sell/:id', (req, res) => {
    Seller.find({ _id: req.params.id }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.json({
                result
            })
        }
    })
})


// to update a sell with its ID
router.put('/update-sell/:id', (req, res) => {
    // var newInfo = req.body
    let newInfo = req.body
    console.log(req.body)
    Seller.findByIdAndUpdate(req.params.id, newInfo, { new: true }, (err, result) => {
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