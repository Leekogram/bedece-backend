
const router = require("express").Router();
const logger = require('./../logConfig')

router.get('/log', (req, res) => {

  var options = {
    from: new Date - 24 * 60 * 60 * 1000,
    until: new Date,
    limit: 10,
    start: 0,
    order: 'desc',
    fields: ['message']
  };


    logger.query(options, function(err, results) {
      if (err) {
        res.send(err);
    } else {
        res.send(results);
    }
    });
  
  })

  module.exports = router;