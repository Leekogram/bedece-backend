const router = require("express").Router();
const Trans = require('../../models/purchase/transLogsModels')
const Buyer = require('../../models/purchase/buyShema')
const Seller = require('../../models/purchase/sellSchema')


var json2xls = require('json2xls');
const xl = require('excel4node');
const mongoose = require("mongoose");

router.use(json2xls.middleware);
router.get('/', (req, res) => {
  console.log("signup works");
  res.send("working")
})

router.get('/logs', (req, res) => {
  Trans.find((err, result) => {
    if (err) res.send(err)
    res.send(result)
  }).sort({ created_date: -1 })
})

router.get('/user-logs/:uid', (req, res) => {

  Trans.find({ userId: req.params.uid }, (err, result) => {
    if (err) res.send(err)
    res.send(result)
  }).sort({ created_date: -1 })
})

router.get('/user-logs-status/:uid', (req, res) => {

  Trans.find({ userId: req.params.uid, status: req.query.status }, (err, result) => {
    if (err) res.send(err)
    res.send(result)
  }).sort({ created_date: -1 })
})

router.get('/user-trans-logs', (req, res) => {
  let status
  if (!req.query.status) {
    status = "pending"
  } else {
    status = req.query.status
  }
  console.log(status)
  Trans.find({ userId: req.query.uid, status }, (err, result) => {
    if (err) res.send(err)
    res.send(result)
  }).sort({ created_date: -1 })
})

router.get('/search', async (req, res) => {
  Trans.find({ $text: { $search: req.query.search } })
    .exec(function (err, docs) {
      res.send({ doc: docs, err })
    })
}

)


router.get('/excel', function (req, res) {
  Trans.find((err, result) => {
    if (err) res.send(err)
    // res.send(result)

    const createSheet = () => {

      return new Promise(resolve => {

        // setup workbook and sheet
        var wb = new xl.Workbook();

        var ws = wb.addWorksheet('Sheet');

        // Add a title row

        ws.cell(1, 1)
          .string('Trans Type')

        ws.cell(1, 2)
          .string('User Full Name')

        // ws.cell(1, 3)
        //   .string('User ID')

        ws.cell(1, 3)
          .string('User Phone')

        ws.cell(1, 4)
          .string('User Email')

        ws.cell(1, 5)
          .string('Give amount')


        ws.cell(1, 6)
          .string('Get amount')


        ws.cell(1, 7)
          .string('Credited BCD Account')


        ws.cell(1, 8)
          .string('REFERENCE')


        // add data from json

        for (let i = 0; i < result.length; i++) {

          let row = i + 2

          ws.cell(row, 1)
            .string(result[i].Type)

          ws.cell(row, 2)
            .string(result[i].user.fname)

          // ws.cell(row, 3)
          //   .string(result[i].userId)

          ws.cell(row, 3)
            .string(result[i].user.phone)

          ws.cell(row, 4)
            .string(result[i].user.email)

          ws.cell(row, 5)
            .string(result[i].give.giveAmount + " " + result[i].give.giveCurrency)

          ws.cell(row, 6)
            .string(result[i].recieve.recieveAmount + " " + result[i].recieve.recieveCurrency)

          ws.cell(row, 7)
            .string(result[i].transDetails.creditAccount.bcdAccountName + " " + result[i].transDetails.creditAccount.bcdAccountNumber + " " + result[i].transDetails.creditAccount.bcdBankName)

          ws.cell(row, 8)
            .string(result[i].transDetails.refference)
        }

        


        resolve(wb)

      })
    }

    createSheet().then(file => {
      file.write('ExcelFile.xlsx', res);
    })
  }).sort('-created_date')

  // var json = [{"Vehicle":"BMW","Date":"30, Jul 2013 09:24 AM","Location":"Hauz Khas, Enclave, New Delhi, Delhi, India","Speed":42},{"Vehicle":"Honda CBR","Date":"30, Jul 2013 12:00 AM","Location":"Military Road,  West Bengal 734013,  India","Speed":0},{"Vehicle":"Supra","Date":"30, Jul 2013 07:53 AM","Location":"Sec-45, St. Angel's School, Gurgaon, Haryana, India","Speed":58},{"Vehicle":"Land Cruiser","Date":"30, Jul 2013 09:35 AM","Location":"DLF Phase I, Marble Market, Gurgaon, Haryana, India","Speed":83},{"Vehicle":"Suzuki Swift","Date":"30, Jul 2013 12:02 AM","Location":"Behind Central Bank RO, Ram Krishna Rd by-lane, Siliguri, West Bengal, India","Speed":0},{"Vehicle":"Honda Civic","Date":"30, Jul 2013 12:00 AM","Location":"Behind Central Bank RO, Ram Krishna Rd by-lane, Siliguri, West Bengal, India","Speed":0},{"Vehicle":"Honda Accord","Date":"30, Jul 2013 11:05 AM","Location":"DLF Phase IV, Super Mart 1, Gurgaon, Haryana, India","Speed":71}]


});







module.exports = router