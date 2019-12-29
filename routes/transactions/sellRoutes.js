const router = require("express").Router();
const Seller = require('../../models/purchase/sellSchema')

router.get('/t', (req, res) => {
    res.send('its now working')
})
router.post('/sell', (req, res) => {

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
            creditAccount: req.body.creditAccount,
            refference: req.body.refference
        },

        userId: req.body.userId,
        transactionId: req.body.transactionId,
        isDelivered: req.body.isDelivered,
        deliveryMethod: req.body.deliveryMethod,
        deliveryAddress:
            req.body.deliveryAddress,



    })
    newSeller
        .save()
        .then(seller => {
            res.status(200).json({
                message: "saved successfully"
            });
            console.log("success")
        })
        .catch(err => {
            console.log(err);
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
    Seller.findByIdAndUpdate(req.params.id, newInfo, (err, result) => {
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