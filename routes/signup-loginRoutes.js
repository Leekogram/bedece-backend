const router = require("express").Router();
const User = require('../models/regSchema')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
var emailCheck = require('email-check');
var firebase = require("firebase/app");

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
    if (!req.body.password || req.body.password.length < 4) {
      errors.push("Pin must not be less than 4")
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
        $or: [
          { email: req.body.email },
          { phone: req.body.phone }
        ]
      }).then(user => {
        if (user) {
          errors.push("either phone or email is already registered with another account")
          res.status(404).json({
            message: errors
          })
          console.log("this account exists")
        } else {
          const newUser = new User({
            fullName: req.body.fullName,
            address: req.body.address,

            Dob: req.body.Dob,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            business: {
              type: String
              // for either trustee or corporate
            },
            bank: [
              {
                accountNumber: req.body.accountNumber,
                accountName: req.body.accountName,
                bankName: req.body.bankName,
              }
            ]
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw error;
              else {
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    res.status(200).json({
                      message: "success"
                    });
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

router.get('/users', (req, res) => {
  let sess = req.session;
  if(sess.emailOrPhone){
    User.find((err, result) => {
      if (err) res.send(err)
  
      res.send({ result: result })
    })
  } else {
    res.status(400).send({
      message:"login first"
    })
  }
 
})


router.post('/addBank/:id', (req, res) => {
  let sess = req.session;
  if(sess.emailOrPhone){
    let newdet = new User({
      bank: [{
        accountNumber: req.body.accountNumber,
        accountName: req.body.accountName,
        bankName: req.body.bankName
      }]
  
    })
  
    User.findByIdAndUpdate(req.params.id,
      { $push: { bank: newdet.bank } },
      function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(newdet)
          res.status(200).send({
            message: "added successful"
          })
        }
      }
    );
  }
  else{
    res.send({message:"please login first"})
  }
 

}
)


router.get("/user/:id", (req, res) => {
  let sess = req.session;
  if (sess.emailOrPhone) {
    User.findById(req.params.id, (err, result) => {
      if (err) {
        res.send("An Error Occured!");
        console.log("error:");
      } else {
        res.send(result);
        console.log(req.params.id);
      }
    })
    
  }else {
    res.status(400).send({message: "you have to login in first"})
  }

})




// router.post("/facebook", (req,res)=>{

// // Build Firebase credential with the Facebook access token.
// var credential = firebase.auth.FacebookAuthProvider.credential(access_token);

// // Sign in with credential from the Google user.
// firebase.auth().signInWithCredential(credential).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // The email of the user's account used.
//   var email = error.email;
//   // The firebase.auth.AuthCredential type that was used.
//   var credential = error.credential;
//   // ...
// });

// })
router.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      // 
      res.send({
        message:"session terminated"
      })
  });

});

router.post("/login", async (req, res, next) => {
  let sess = req.session;
  sess.emailOrPhone = req.body.emailOrPhone
  if (Object.keys(req.body).length === 0) {
    console.log('sorry u didnt send any data')
    res.status(400).send('you didnt send any data')
  } else {

    await User.findOne({
      $or: [
        { email: req.body.emailOrPhone },
        { phone: req.body.emailOrPhone }
      ]
    })
      .then(user => {
        console.log(req.body)
        if (user == null) {
          res.status(400).json({
            message: "wrong login details",
            devMessage: "this user wasnt found"
          })
          console.log("not seen")
        }

        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            // res.status(200).send("ok");
            console.log("successful")
            const token = jwt.sign({ user }, "my_secret");
            res.send({
              token: token,
              user: user
            })
          } else {
            res.status(400).json({
              message: "wrong login details",
              devMessage: "passwords didnt match"
            });
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