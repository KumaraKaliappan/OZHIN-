const mongoose = require('mongoose');
const s = new mongoose.Schema({
  title:String, slug:{type:String, unique:true}, description:String, price:Number, images:[String], inventory:{type:Number, default:0}
}, { timestamps:true });
module.exports = mongoose.model('Product', s);
