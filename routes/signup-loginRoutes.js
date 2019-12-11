const router = require("express").Router();
const User = require('../models/regSchema')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
var emailCheck = require('email-check');

router.get('/', (req, res) => {
  console.log("signup works");
  res.send("working")
})
// this is just for testing


router.post('/register', (req, res) => {
  let errors = [];
  if (Object.keys(req.body).length === 0) {
    console.log('sorry u didnt send any data')
    res.send('you didnt send any data')
  } else {
    // console.log(req.body, 'is the body')
    if (!req.body.password || req.body.password.length < 8) {
      errors.push("Password must not be less than 8 characters")
      res.status(404).json({
        status: 'error',
        message: errors,
      });
      console.log(errors)
    } if (!req.body.email) {
      errors.push("no email")
      res.status(404).json({
        status: 'error',
        message: errors,
      });
      console.log(errors)
    }

    if (errors.length > 0) {
      res.send(errors);
      console.log(errors)
    } else {
      User.findOne({
        email: req.body.email
      }).then(user => {
        if (user) {
          errors.push("an account already exist with this email address")
          res.status(404).send({
            status: 400,
            message: errors
          })
          console.log("this account exists")
        } else {
          const newUser = new User({
            fullName: req.body.fullName,
            address: req.body.address,
            accountNumber: req.body.accountNumber,
            accountName: req.body.accountName,
            bankName: req.body.bankName,
            Dob: req.body.Dob,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            business: {
              type: String
              // for either trustee or corporate
            }
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw error;
              else {
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    res.status(200).send("succesfully registered");
                    console.log("success")
                  })
                  .catch(err => {
                    console.log(err);
                  });
                // console.log(newUser);
              }
            });
          });
        }
      });
    }

  }
})

router.get('/all', (req, res) => {
  User.find((err, result) => {
    if (err) res.send(err)

    res.send(result)
  })
})

router.post("/login", async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    console.log('sorry u didnt send any data')
    res.status(400).send('you didnt send any data')
  } else {
    if (!req.body.email) {
      res.status(400).send('please input password ')
    }
   else if (!req.body.password) {
      res.status(400).send(
        "please input password "
      )
    } else
    await User.findOne({
      email: req.body.email
    })
      .then(user => {
        console.log(req.body)
        if (user == null) {
          resstatus(400).json({
            message: "User not found"
          })
          console.log("not seen")
        }

        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            // res.status(200).send("ok");
            console.log("successful")
            const token = jwt.sign({ user }, "my_secret");
            res.json({
              token: token,
              user: user
            })


          } else {
            res.send("wrong login details");
            console.log("failed password didnt match")
            console.log(req.body)
          }
        });

        // console.log(req.body.password);
        // console.log(req.body.email);

      });

  }
});

function verifyToken(req, res, next) {
  //get auth bearer
  const bearerHeader = req.headers["authorization"]
  //check if bearer header is undefined
  if (typeof bearerHeader !== "undefined") {
    // split at space
    const bearer = bearerHeader.split(" ");
    // get token from array
    const bearerToken = bearer[1];
    //set token
    req.token = bearerToken
    // call next middleware
    next();
  }
  else {
    res.send("invalid")
  }
}

module.exports = router