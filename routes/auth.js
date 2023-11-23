const express = require('express');
const authRoute = express();
const authController  = require('../Controller/authController');
const jwt = require('jsonwebtoken');
const secretkey = 'secretkey';
const varify = async (req,res,next)=>{
    try {
        const header = req.headers['authorization'];
        if(header  !== 'undefined'){
            jwt.verify(header, secretkey, function(err, decoded) {
              if(err){
              
                res.send('Invalid user ID');
              }else{
               
                next();
              
              }
            });
        
        }  else{
            res.send('token is neccesary');
        } 
      
    }catch{

    }
}
authRoute.post('/login',authController.login);
authRoute.get('/userdata',varify,authController.userdata);


module.exports = authRoute;