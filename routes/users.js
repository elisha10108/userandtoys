const express = require('express');
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {UserModel ,validUser , validLogin, genToken} = require("../models/userModel");
const { authToken } = require('../middlewares/auth');
const router = express.Router();




// router.get('/', async(req, res) => {

//   try{

//   let data = await UserModel.find({},{pass:0})
//   res.json(data);
//   }
//   catch (err) {
//     catchFunction(err, res);
//   }
// });

router.get("/myInfo",authToken ,async(req,res) => {
  try{
    let user = await UserModel.findOne({_id:req.userData._id},{pass:0});
    res.json(user);
  }
  catch (err) {
    catchFunction(err, res);
  }
})


router.post("/login",async(req,res) => {
  let validBody = validLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = await UserModel.findOne({email:req.body.email});
    if(!user){
      return res.status(400).json({msg:"user or password invalid"});
    }
    let validPass = await bcrypt.compare(req.body.pass,user.pass);
    if(!validPass){
      return res.status(400).json({msg:"user or password invalid"});  
    }
    let myToken = genToken(user._id);
    res.json({token:myToken});
  }
  catch (err) {
    catchFunction(err, res);
  }
})


router.post("/", async(req,res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);
    let salt = await bcrypt.genSalt(10);
    user.pass = await bcrypt.hash(user.pass, salt);
    await user.save();
    res.status(201).json(_.pick(user,["_id","email","date_created","name"]))
  }
  catch (err) {
    catchFunction(err, res);
  }

})

module.exports = router;
function catchFunction(err, res) {
  console.log(err);
  res.status(400).json(err);
}

