const router = require("express").Router();
const transLogs = require("../../models/purchase/transLogsModels");
const logger = require("../../logConfig");
const TransLog = require("../../TranslogerConfig");
var MongoClient = require("mongodb").MongoClient;
var nodemailer = require("nodemailer");
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

module.exports = router;
