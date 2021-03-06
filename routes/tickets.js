const router = require("express").Router();
const Tickets = require('./../models/ticket')

router.get('/', (req, res) => {
    res.send("i see you")
})

router.post('/open-tickets', (req, res) => {
    let newTicket = new Tickets(req.body)
    //  res.send(newTicket)
    newTicket.save()
    .then(rate => {
      res.status(200).json({
        message: "saved successfully"
      });
      console.log("success")
    })
    .catch(err => {
      console.log(err);
      res.send(err)
    });
})

router.get("/all-tickets", (re, res) => {
    Tickets.find((err, result) => {
        if (err) res.send(err)
        res.send(result)
    })
})


//   get a particular Currency
  router.get('/ticket/:id', (req, res) => {
    Tickets.find({ _id: req.params.id }, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.json({
          result
        })
      }
    })
  })

  router.get('/user-ticket/:id', (req, res) => {
    Tickets.find({ userId: req.params.id }, (err, result) => {
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