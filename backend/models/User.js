const mongoose = require('mongoose');
const s = new mongoose.Schema({ name:String, email:{type:String, unique:true}, passwordHash:String, role:{type:String, default:'customer'} });
module.exports = mongoose.model('User', s);
