const router = require("express").Router();
const User = require('../models/regSchema')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
var emailCheck = require('email-check');
var firebase = require("firebase/app");
var nodemailer = require('nodemailer');



// for uploading images
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var multer = require('multer')
// set storage
var storage = multer.diskStorage({
    destination: 'uploads/'
})


router.get('/', (req, res) => {
    console.log("signup works");
    res.send("working")
})
// this is just for testing




router.post('/tres', (req, res) => {
    console.log(req.body, req.files)
})



router.get('/users', (req, res) => {
    User.find((err, result) => {
        if (err) res.send(err)
        res.send({ result: result })
    })
})




router.post("/login", async (req, res, next) => {

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

router.post('/fpass', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.send("you didnt send any data")
    } else {
        await User.findOne({ email: req.body.email }).then(user => {
            console.log(req.body)
            if (user == null) {
                res.status(400).json({
                    message: "wrong email",
                    devMessage: "no user has registered with the email"
                })
                console.log("not seen")
            }
            else {
                const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), user }, "my_secret");
                res.send(user._id)
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'sundaysayil4u@gmail.com',
                        pass: 'seyilnen2194'
                    }
                });
                var mailOptions = {
                    from: 'bcd ',
                    to: user.email,
                    subject: '313bdc Password reset',
                    html: ` 
            <h2>313BDC</h2>
            <div> 313BDC <br>
            dear ${user.fname} ${user.fname}
            </div>        
            follow this  <a href="http://localhost:8080/?e=${user._id}&q=${token}">link</a> to reset your password. <br> this link expires after an hour. if you did not make this request, kindly ignore the mail.
            Thanks, <br>
            The 313BDC team <br>
            08031230313, 08099936398, 07058890313 `
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        // res.send(error)
                    } else {
                        console.log('Email sent: ' + info.response);
                        // res.send('Email sent, Thank You!! ');
                    }
                });;
            }
        });
    }
})

router.post("/reset-pass/:id/:token", (req, res) => {
    // console.log(req.params.token)

    jwt.verify(req.params.token, "my_secret", (err, authData) => {
        if (err) {
            console.log("errorror")
            res.json({
                message: "sorry, this link has expired"
            })
        }
        else {
            let newInfo = req.body
            console.log(newInfo.password)
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newInfo.password, salt, (err, hash) => {
                    if (err) throw error;
                    else {
                        newInfo.password = hash;
                        User.findByIdAndUpdate(req.params.id, newInfo, { upsert: true, new: true }, (err, result) => {
                            if (err) {
                                console.log(err)
                            } else {
                                res.json({
                                    message: "Successfully updated",
                                    //  authData
                                    result: result
                                })
                            }
                        })
                        // console.log(newUser);
                    }
                });
            });
            console.log("suc@cess", newInfo)
        }
    })

})

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