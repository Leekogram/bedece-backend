const router = require("express").Router();
const User = require('../models/regSchema')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

router.get('/', (req, res) => {
  console.log("signup works");
  res.send("working")
})
// this is just for testing

router.get("/reg", (req, res) => {
  res.send("registration works");
  console.log("working");
});

router.post('/register', (req, res) => {
  let errors = [];
  console.log(req.body, 'is the body')
  if (req.body.password.length < 8) {
    errors.push("Password must not be less than 8 characters")
    res.send(errors)
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
        res.send(errors)
        console.log("this account exists")
      } else {
        const newUser = new User({
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          password: req.body.password
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
              console.log(newUser);
            }
          });
        });
      }
    });
  }

})

router.get('/all', (req, res) => {
  User.find((err, result) => {
    if (err) res.send(err)

    res.send(result)
  })
})

router.post("/login", async (req, res, next) => {
  console.log

  await User.findOne({
    email: req.body.email
  })
    .then(user => {
       console.log(req.body)
      if (user == null) {
        res.json({
          message: "User not found"
        })
        console.log("not seen")
      } else {
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if (err) throw error;
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
      }
      // console.log(req.body.password);
      // console.log(req.body.email);

    });

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