const router = require("express").Router();
const Rates = require('../../models/fxrates/fxRatesModel')


router.get('/', (req, res) => {
    res.send("i see you")
})

router.post('/currency', (req, res) => {
    let newRate = new Rates({
        currency: req.body.currency,
        rateToNaira: req.body.rateToNaira
    })
   
    newRate
    .save()
    .then(rate => {
      res.status(200).json({
        message: "saved successfully"
      });
      console.log("success")
    })
    .catch(err => {
      console.log(err);
    });
})

router.get("/all-currency", (re, res) => {
    Rates.find((err, result) => {
        if (err) res.send(err)

        res.send(result)

    })
})

// to update a currency's rates with its ID
router.put('/update-currency/:id', (req, res) => {
    // var newInfo = req.body
    let newInfo = req.body
    console.log(newInfo)
    Rates.findByIdAndUpdate(req.params.id, newInfo, {upsert: true, new: true}, (err, result) => {
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

//   get a particular Currency
  router.get('/get-currency/:id', (req, res) => {
    Rates.find({ _id: req.params.id }, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.json({
          result
        })
      }
    })
  })


module.exports = router