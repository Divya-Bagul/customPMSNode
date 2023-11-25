const express = require('express');
const authRoute = express();
const user = require('../model/user');
const bodyParser = require('body-parser')
var cors = require('cors');
authRoute.use(cors());

const bcrypt = require('bcrypt');
authRoute.use(bodyParser.json());
var jwt = require('jsonwebtoken');
const secretkey = 'secretkey';
const login = async (req, res) => {

        try {
                const email = req.body.email;
                const userData = await user.findOne({ 'email': email });
                if (userData) {
                        var password = userData.password;
                        if (password == req.body.password) {
                                const Token = jwt.sign({ userData }, secretkey, { expiresIn: '24h' });
                                const result = { userdata: userData, token: Token };
                                res.send(result);
                        } else {
                                res.send('password does not match');
                        }
                } else {
                        res.send('Enter valide data');
                }

        } catch (error) {
                res.send(error);
        }
}

const userdata = async(req,res)=>{
     
        if(req.body._id != undefined)
        {
                
                var userData =  await user.find({'_id':'655cdb67e5bdbfff96fbf755'});
                console.log(userData);
        }else{
                var userData =  await user.find();

        }
       
        if(userData.length > 0){
                res.status(200).send({status:"200",data:userData});
        }else{
                res.send({status:"500",data:'Data Not Found'});
        }
        
}
const createuser = async(req,res)=>{
        if(req.body.password){
                const saltRounds = 10;
                var hashpassword =  await bcrypt.hash(req.body.password,saltRounds).then(function(hash){
                        return hash;
                });
        }
        var store =  new user({
                name:req.body.name,
                email:req.body.email,
                password:hashpassword

        });
        await store.save();
      
        if(store){
                res.status(200).send({status:"200",data:'Data Store Successfully'});
        }else{
                res.statusCode = 401;
                res.send({status:"401",data:'Data Not Found'});
        }
        
}
const updateUser = async(req,res) =>{

        const udateUser = await user.updateMany(
                {
                  _id:req.body.id
                },{$set:{
                        name:req.body.name,
                        name:req.body.email,   
                        }
                }
        );
        if(udateUser){
                res.status(200).send({status:"200",data:"Data update successfully"});
        }else{
                res.status(500).send({status:"500",data:"Somthing went wrong"});
  
        }
}
const deleteuser = async(req,res) =>{
        try{
                var userData =  await user.find({_id:req.body._id});
              
                if(userData.length > 0){
                        const deleteuser = await user.deleteMany(
                                {
                                        _id:req.body._id
                                }
                        );
                      
                        if(deleteuser){
                                res.status(200).send({status:"200",data:"Data delete successfully"});
                        }else{
                                res.status(500).send({status:"500",data:"Somthing went wrong"});
                  
                        }
                }else{
                        res.status(500).send({status:"401",data:"Data not found"});
                }
        }catch(error){
                
                // res.status(500).send({status:"401",data:"Data not found"});
                res.send(error);
        }
       
        
}
module.exports = { login,userdata,createuser,updateUser,deleteuser}