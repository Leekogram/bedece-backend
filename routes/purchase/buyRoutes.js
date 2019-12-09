const router = require("express").Router();
const Buyer = require ('../../models/purchase/buyShema')


router.post('/', (req, res)=>{
res.send('working')
})
module.exports = router