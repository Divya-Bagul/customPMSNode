const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const { Schema } = mongoose;
mongoose.connect("mongodb://127.0.0.1:27017/cyber");
const UserSchema = new mongoose.Schema(
    {
       
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
    });


module.exports = mongoose.model('users',UserSchema);

