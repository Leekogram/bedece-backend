const router = require("express").Router();
const User = require('../models/regSchema')




router.get('/', (req, res) => {
    console.log("signup works");
    res.send("working")
})
router.get("/reg", (req, res) => {
    res.send("registration works");
    console.log("working");
});

router.post('/register', (req, res) => {
    res.send(req.body)
    console.log(req.body)
    
})

module.exports = router