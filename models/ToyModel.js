const mongoose = require("mongoose");
const Joi = require("joi");

const ToySchema = new mongoose.Schema({
  name:String,
  info:String,
  category:String,
   img:String,
  price:Number,
  user_id:String,
  date_created:{
    type:Date , default:Date.now
  }
})
exports.ToyModel = mongoose.model("toys",ToySchema);

exports.validToy = (_bodyData) => {
  let schemaJoi = Joi.object({
    name:Joi.string().min(2).max(100).required(),
    user_id:Joi.string().min(1).max(999),
    info:Joi.string().min(1).max(99999).required(),
    category:Joi.string().min(2).max(60).required(),
    price:Joi.number().min(1).max(99999).required(),
    img:Joi.string().min(2).max(200).required(),
  })
  return schemaJoi.validate(_bodyData);
}
