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
                res.send({status:"500",data:'Invalid user ID'});

              
              }else{
               
                next();
              
              }
            });
        
        }  else{
          res.send({status:"500",data:'token is neccesary'});
       
        } 
      
    }catch{

    }
}
authRoute.post('/login',authController.login);
authRoute.post('/userdata/:id?',varify,authController.userdata);
authRoute.post('/create',varify,authController.createuser);
authRoute.post('/update/:id',varify,authController.updateUser);
authRoute.post('/delete/:id',varify,authController.deleteuser);

authRoute.post('/mail',authController.mail);



module.exports = authRoute;