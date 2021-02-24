const express = require('express');
const { authToken } = require('../middlewares/auth');
const {ToyModel,validToy} = require("../models/ToyModel");
const router = express.Router();

router.get('/',  async(req, res) => {
  let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
  let page = req.query.page;
  let sortQ = req.query.sort;
  let ifReverse = (req.query.reverse == "yes") ? -1 : 1 ;
  try {
    let data = await ToyModel.find({})
    .sort({[sortQ]:ifReverse})
    .limit(perPage)
    .skip(page * perPage)
    res.json(data);
  }
  catch (err) {
    catchFunction(err, res);
  }
  res.json({msg:"that  work"});
});




router.get("/search",async(req,res) => {
  let searchQ = req.query.q;
  try{
    let searchRegQ = new RegExp(searchQ, "i");
    let data = await ToyModel.find({$or:[{name:searchRegQ},{info:searchRegQ}]})
    res.json(data); 
  }
  catch(err){
    res.status(400).json({err:"there is problem, try again later"})
  }
})
router.get("/cat",async(req,res) => {
  let searchcatQ = req.query.q;
  try{
    let searchCQ = new RegExp(searchcatQ, "i");
    console.log(searchcatQ);
    // let catdata = await ToyModel.find([{category:searchCQ}])
    let catdata = await ToyModel.find({$or:[{category:searchCQ}]})
    console.log(catdata);
    res.json(catdata); 
  }
  catch(err){
    res.status(400).json({err:"there is problem, try again later"})
  }
})


router.post("/", authToken , async(req,res) => {
  let validBody = validToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }

  try{
    let toy = new ToyModel(req.body);
    toy.user_id = req.userData._id;
    await toy.save();
    res.status(201).json(toy);
  } 
  catch (err) {
    catchFunction(err, res);
  } 
})

//edit
router.put("/:editId", authToken , async(req,res) => {
  let editId = req.params.editId;
  let validBody = validToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let toy = await ToyModel.updateOne({_id:editId,user_id:req.userData._id},req.body);
    res.json(toy);
  } 
  catch (err) {
    catchFunction(err, res);
  } 
})

router.delete("/:delId", authToken , async(req,res) => {
  let delId = req.params.delId;
  try{
    let toy = await ToyModel.deleteOne({_id:delId,user_id:req.userData._id});
    res.json(toy);
  } 
  catch (err) {
    catchFunction(err, res);
  } 
})

module.exports = router;
module.exports = router;
function catchFunction(err, res) {
  console.log(err);
  res.status(400).json(err);
}
