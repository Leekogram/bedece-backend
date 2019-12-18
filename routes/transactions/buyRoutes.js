const router = require("express").Router();
const Buyer = require('../../models/purchase/buyShema')

router.get('/', (req, res)=>{
  res.send('its now working')
})
router.post('/buy', (req, res) => {
   
    let newBuyer = new Buyer({
         currency: req.body.currency,
         units: req.body.units,
         estimatedValue: req.body.estimatedValue,
         userId: req.body.userId,
         transactionId:req.body.transactionId,
         isDelivered:req.body.isDelivered,
         deliveryMethod:req.body.deliveryMethod,
         
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
router.get('/all-buys', (req, res)=>{
  
    Buyer.find((err, result) => {
      if (err) res.send(err)
  
      res.send(result)
   
  })
})


module.exports = router