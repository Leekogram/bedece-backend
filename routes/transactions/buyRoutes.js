const router = require("express").Router();
const Buyer = require('../../models/purchase/buyShema')

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
      creditAccount: req.body.creditAccount,
      refference: req.body.refference
    },
    userId: req.body.userId,
    transactionId: req.body.transactionId,
    isDelivered: req.body.isDelivered,
    deliveryMethod: req.body.deliveryMethod,

  })
  newBuyer
    .save()
    .then(buyer => {
      res.status(200).json({
        message: "saved successfully"
      });
      console.log("success")
    })
    .catch(err => {
      console.log(err);
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
  Buyer.findByIdAndUpdate(req.params.id, newInfo, {upsert: true, new: true}, (err, result) => {
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