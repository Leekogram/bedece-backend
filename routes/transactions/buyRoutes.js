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
// to get all the buys
router.get('/all-buys', (req, res)=>{
  
    Buyer.find((err, result) => {
      if (err) res.send(err)
  
      res.send(result)
   
  })
})

// get all the buys made by a single user
router.get('/all-buy/:id', (req, res)=>{
  
  Buyer.find({userId:req.params.id},(err, result) => {
    if (err) res.send(err)

    res.send(result)
 
})
})

router.get('/get-buy/:id',(req,res)=>{

  Buyer.find({_id:req.params.id},(err, result) => {
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
router.put('/update-buy/:id',(req,res)=>{
  var newInfo = req.body
  console.log(req.body)
  Buyer.findByIdAndUpdate(req.params.id,newInfo,(err, result) => {
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