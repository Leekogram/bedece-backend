const router = require("express").Router();
const Tickets = require("./../models/ticket");
const activity = require("../models/activitymodels");


router.get("/", (req, res) => {
  res.send("i see you");
});

router.post("/open-tickets", (req, res) => {
  let newTicket = new Tickets(req.body);
  let message = {
    sender: req.body.sender,
    comment: req.body.comment,
  };
  newTicket["message"][0] = message;
  //  res.send(newTicket)
  newTicket
    .save()
    .then((message) => {
      res.status(200).json({
        message
      });
      console.log("success");
      let act = new activity({
        activity: "USER - OPEN TICKETS",
        userId: req.body.userId,
      })
      act.save()
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/all-tickets", (re, res) => {
  Tickets.find((err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

router.post("/add-comment/:id", (req, res) => {
  console.log(req.body)
  let newTickets = new Tickets({
    message: [
      {
        sender: req.body.sender,
        comment: req.body.comment,
      },
    ],
  });
  Tickets.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        message: newTickets.message,
      },
     
     
    },
    {new: true},
    function (err, doc) {
      if (err) {
        console.log(err);
        res.send("error occured");
      } else {
        // console.log(newdet);
        res.status(200).send({
          message: doc,
        });
      }
    }
  );
});

router.get("/close-tickets/:id", async (req, res) => {
  let x = await Tickets.findByIdAndUpdate(
    req.params.id,
    {
      active: false,
    },
    {
      new: true,
    },
    (err, doc) => {
      console.log(doc);
      if (doc) {
        res.send({
          message: "ticket closed",
          data: doc,
        });
      }
    }
  );
});

router.get("/ticket/:id", (req, res) => {
  Tickets.find({ _id: req.params.id }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json({
        result,
      });
    }
  });
});

router.get("/user-ticket/:id", (req, res) => {
  Tickets.find({ userId: req.params.id }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json({
        result,
      });
    }
  });
});

module.exports = router;
