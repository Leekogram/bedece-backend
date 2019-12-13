const router = require("express").Router();
const Buyer = require('../../models/purchase/buyShema')


router.post('/', (req, res) => {
   
    let newBuyer = new Buyer({
         currency: req.body.currency,
         units: req.body.units,
         userId: req.body.userId,
         
    })
    newBuyer
    .save()
    .then(buyer => {
      res.status(200).send("succesful");
      console.log("success")
    })
    .catch(err => {
      console.log(err);
    });
  
})
module.exports = router