const router = require("express").Router();
const transLogs = require("../../models/purchase/transLogsModels");
const logger = require("../../logConfig");
const TransLog = require("../../TranslogerConfig");
var MongoClient = require("mongodb").MongoClient;
var nodemailer = require("nodemailer");
var addDays = require("../utility");

router.get("/", (req, res) => {
  res.send("its now working");
});

// to get all the sells
router.get("/all-transactions", (req, res) => {
    if (!req.query.startDate || !req.query.endDate) {
      res.send({
        error: true,
        message: "please enter date range for start and end",
      });
    } else {
      filter = req.query;
      filter["created_date"] = {
        $gte: req.query.startDate,
        $lte: addDays(req.query.endDate, 1),
      };
      delete filter.startDate;
      delete filter.endDate;
      console.log(filter);
  
      transLogs.find(filter, (err, result) => {
        if (err) res.send(err);
  
        res.status(200).send({
          result: result,
        });
      }).sort({
        created_date: -1,
      });
    }
  });

  module.exports = router;
