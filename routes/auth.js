const express = require('express');
const authRoute = express();
const authController  = require('../Controller/authController');
const jwt = require('jsonwebtoken');
const secretkey = 'secretkey';
const multer = require('multer');
const csvtojson = require('csvtojson');
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
authRoute.post('/addComplaint',authController.addComplaint);
authRoute.post('/compliantdata/:id?',varify,authController.Complaintdata);

authRoute.post('/update/:id',varify,authController.updateUser);
authRoute.post('/delete/:id',varify,authController.deleteuser);

authRoute.post('/mail',authController.mail);
var excelStorage = multer.diskStorage({  
  destination:(req,file,cb)=>{  
       cb(null,'./public/excelUploads');      // file added to the public folder of the root directory
  },  
  filename:(req,file,cb)=>{  
       cb(null,file.originalname);  
  }  
});  
var excelUploads = multer({storage:excelStorage});
authRoute.post('/fileupload',excelUploads.single("uploadfile"),authController.fileupdade);

module.exports = authRoute;