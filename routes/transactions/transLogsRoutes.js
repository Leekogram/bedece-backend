const router = require("express").Router();
const Trans = require('../../models/purchase/transLogsModels')
var json2xls = require('json2xls');

router.use(json2xls.middleware);
router.get('/', (req, res) => {
    console.log("signup works");
    res.send("working")
})

router.get('/logs', (req, res) => {
    Trans.find((err, result) => {
      if (err) res.send(err)
      res.send(result)
    })
  })

router.get('/xls-logs', (req, res)=>{
    Trans.find((err, result) => {
        if (err) res.send(err)
        // res.send(result)

        var json = {
            foo: 'bar',
            qux: 'moo',
            poo: 123,
            stux: new Date()
        }
        
        // var xls = json2xls(json);
        
        res.xls('data.xlsx', json);
      })
})
// this is just for testing




module.exports = router