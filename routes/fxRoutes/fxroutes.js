const router = require("express").Router();
const Rates = require('../../models/fxrates/fxRatesModel')
const logger = require('../../logConfig')

router.get('/', (req, res) => {
    res.send("i see you")
})

router.post('/currency', (req, res) => {
    let newRate = new Rates({
        currency: req.body.currency,
        rateToNaira: req.body.rateToNaira,
        rateFromNaira: req.body.rateFromNaira
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
    let newInfo = req.body
    Rates.findByIdAndUpdate(req.params.id, newInfo, {upsert: true, new: true}, (err, result) => {
        if (err) {
            console.log(err)
            logger.info( `status:FAILURE, user:Admin, type:Update Currency, currencyID:${req.params.id}`)
        } else {
            res.json({
                message: "Successfully updated",
                //  authData
                result
            })
            logger.info( `status:SUCCESS, user:Admin, type:Update Currency, currencyID:${req.params.id}`)
        }
    })
  })

  

  router.put('/delete-currency/:id', (req, res) => {
    let newInfo = req.body
    Rates.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            console.log(err)
            logger.info( `status:FAILURE, user:Admin, type:delete Currency, currencyID:${req.params.id}`)
        } else {
            res.json({
                message: "Successfully updated",
                //  authData
                result
            })
            logger.info( `status:SUCCESS, user:Admin, type:delete Currency, currencyID:${req.params.id}`)
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