const router = require("express").Router();
const transLogs = require("../../models/purchase/transLogsModels");
const users = require("../../models/regSchema");
const logger = require("../../logConfig");
const TransLog = require("../../TranslogerConfig");
var MongoClient = require("mongodb").MongoClient;
var nodemailer = require("nodemailer");
const activity = require("../../models/activitymodels");
var addDays = require("../utility");
var removeDays = require("../utility");

router.get("/", (req, res) => {
  res.send("its now working");
});

// to get all the sells
router.get("/all-transactions", (req, res) => {
  console.log(req.query);
  let start = "";
  let end = "";
  if (!req.query.startDate || !req.query.endDate) {
    (start = removeDays(new Date(), 30)), (end = new Date());
  } else {
    (start = req.query.startDate), (end = addDays(req.query.endDate, 1));
  }
  filter = req.query;
  filter["created_date"] = {
    $gte: start,
    $lte: end,
  };
  filter["Type"] = "SELL";
  delete filter.startDate;
  delete filter.endDate;
  console.log(filter);

  transLogs
    .find(filter, (err, result) => {
      if (err) res.send(err);
      res.status(200).send({
        result: result,
      });
    })
    .sort({
      created_date: -1,
    });
});

router.get("/search", async (req, res) => {
  transLogs
    .find({ $text: { $search: req.query.search } })
    .exec(function (err, docs) {
      res.send({ doc: docs, err });
    });
});

router.get("/user-activity/:id", async (req, res) => {
  let user = await users.findOne({_id: req.params.id})
  console.log(user)
  let filter = {}
  filter["created_date"] = {
    $gte: user.login_time,
    $lte: user.logout_time,
  };
  console.log(filter)
  activity
    .find(filter, (err, result) => {
      if (err){res.send(err);} 
      res.status(200).send({
        result: result,
      });
    })
    .sort({
      created_date: -1,
    });
});

router.get("/dashboard-summary", async (req, res) => {
  let allData = await transLogs.find().count();
  let allSell = await transLogs.find({ Type: "SELL" }).count();
  let allBuy = await transLogs.find({ Type: "BUY" }).count();
  let allusers = await users.find().count();

  res.send({
    message: "Successful",
    data: {
      allTransactions: allData,
      allSell,
      allBuy,
      allusers,
    },
  });
});

module.exports = router;
