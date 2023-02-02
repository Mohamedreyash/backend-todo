const express = require("express");
const router = express.Router();
const TodoTask = require("../Models/TodoTask");
const user = require("../Models/user");
router.use(express.json());
const cors = require("cors");
router.use(cors());
const { validateToken } = require("../Middleware/Middleware");
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())



/*---------------GET USERNAME---------------*/
router.get("/username", validateToken, async (req, res) => {
    
    const data = await user.findOne({ _id: req.user });
    res.json(data);
});

/*---------------GET ALL TodoTask---------------*/
router.get("/alldata", validateToken, async (req, res) => {
    try {
        const data = await TodoTask.find({ userId: req.user })
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


/*---------------ADD NEW DETAILS---------------*/
router.post("/add", validateToken  ,cors(), async (req, res) => {
    try {
        let data = await TodoTask.find({ userId: req.user });
        
        if (data.length>0) {
          data = await TodoTask.find({ userId: req.user }).updateOne(
            {},
            {
              $push: {
                content: req.body,
              },
            }
          );
        } 
        else {
            console.log("hello")
          data = await TodoTask.create({
            content: req.body,
            userId: req.user,
          });
        }
        res.status(200).json({
          status: "Sucess",
          message: data,
        });
      } catch (error) {
        res.status(500).json({
          status: "Failed",
          message: error.message,
        });
      }
   
});



module.exports = router;