const router = require("express").Router();
const User = require('../../models/admin/adminSchema')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");



// for uploading images
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var multer = require('multer')
// set storage
var storage = multer.diskStorage({
  destination: 'uploads/'
})

var upload = multer({ storage: storage })

// const cloudinary = require('cloudinary');
// cloudinary.config({
//   cloud_name: 'sayil',
//   api_key: '443611676341187',
//   api_secret: 'wAPlHaXu39fxiKuBr9ZN4Gp6IxA'
// });

router.get('/', (req, res) => {
  console.log("Admin works works");
  res.send("working")
})



router.post('/regAdmin', (req, res) => {
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
          const newAdmin = new User({
           
            email: req.body.email,
            password: req.body.password,
           
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAdmin.password, salt, (err, hash) => {
              if (err) res.send("error saving");
              else {
                newAdmin.password = hash;
                newAdmin
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
                // console.log(newAdmin);
              }
            });
          });
        }
      });
    }

  }
})

// router.post("/image/:id", multipartMiddleware, async (req, res) => {
//   console.log(req.body, req.files, req.params.id)
//   let x = await cloudinary.v2.uploader.upload(
//     req.files.image.path, {
//     width: 700,
//     gravity: "south",
//     y: 80,
//     color: "white"
//   },
//     function (error, result) {
//       if (error) {
//         console.log("error here")
//       }
//       // res.json({
//       //   data: result
//       // });
//       imagePath = {
//         data: result.secure_url
//       };
//       console.log(imagePath.data, "is the image path");

//       User.findByIdAndUpdate(req.params.id, { image: imagePath.data }, { new: true, upsert: true }, (err, result) => {
//         if (err) {
//           console.log(err)
//         } else {
//           res.json({
//             message: "Successfully updated",
//             //  authData
//             result
//           })
//         }
//       })
//     });
// })

router.get('/users', (req, res) => {
  User.find((err, result) => {
    if (err) res.send(err)
    res.send({ result: result })
  })
})


router.get('/logout', (req, res) => {
  
    res.send({
      message: "session terminated"
    })

});

router.post("/login", async (req, res, next) => {

  if (Object.keys(req.body).length === 0) {
    console.log('sorry u didnt send any data')
    res.send('you didnt send any data')
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
          res.status.json({
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