
const router = require("express").Router();
const logger = require('./../logConfig')

router.get('/', (req, res) => {

    logger.query({}, function(err, results) {
      if (err) {
        res.status(400).json(err);
    } else {
        res.send(results);
    }
    });
  
  })

  module.exports = router;