const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const users = require('../Models/user')
const { body, validationResult } = require('express-validator')
var jwt = require('jsonwebtoken');
router.use(express.json())


router.post("/login", async (req, res) => {
    const {email,password}=req.body;
    const userData = await users.findOne({ email: email });
    if (userData != null) {
      var result = await bcrypt.compare(password, userData.password);
      if (result) {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 10) + 60 * 60,
            data: userData._id,
          },
          process.env.SECRET
        );
        res.status(200).json({
          Status: "Successful",
          token: token,
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Wrong Password",
        });
      }
    } else {
      res.status(400).json({
        status: "failed",
        message: "No user Found",
      });
    }
  });

router.post('/register', body('email').isEmail(), body('password').isLength(min = 6, max = 16), async (req, res) => {
    
    const { email, password } = req.body
    console.log(email,password)
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            res.status(500).json({ message: error.array() })
        }
        const data = await users.findOne({ email: email })
        if (data) {
            return res.status(500).json({
                message: "Email is already registered"
            })
        }

        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) {
                return res.status(400).json({ message: err.message })
            }

            const data = await users.create({
                email,
                password: hash
            })
            console.log(data)
            res.status(200).json({
                status: "success",
                message: "Registration Successful"
            })
        });


    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }

})

module.exports = router;