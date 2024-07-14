const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const { Schema } = mongoose;
mongoose.connect("mongodb://127.0.0.1:27017/cyber");
const ComplaintSchema = new mongoose.Schema(
    {

        // _id:{
        //     type:String
        // },
       name:{
        type:String,
        required:true
       },
        email:{
            type:String,
            required:true
        },
        adhar_number:{
            type:String,
            required:true
        },
        compliant_text:{
            type:String,
            required:true
        },
    });

module.exports = mongoose.model('complaint',ComplaintSchema);
