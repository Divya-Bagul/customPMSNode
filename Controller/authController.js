const express = require('express');
const authRoute = express();
const user = require('../model/user');
const complaint = require('../model/complaint');

const bodyParser = require('body-parser')
var cors = require('cors');
authRoute.use(cors());
const path = require('path');

const bcrypt = require('bcrypt');
authRoute.use(bodyParser.json());
var jwt = require('jsonwebtoken');
const secretkey = 'secretkey';

const multer = require('multer');
const csvtojson = require('csvtojson');
const nodemailer = require('nodemailer');
const fs = require('fs');

var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        service: 'gmail',
        auth: {
                user: "divyabagul1412000@gmail.com",
                pass: "mjxyktmjvfqbfjvj",
        }
});
const Handlebars = require('handlebars');
// mjxy ktmj vfqb fjvj

const login = async (req, res) => {

        try {
                const email = req.body.email;
                const userData = await user.findOne({ 'email': email });
                if (userData) {
                        var password = userData.password;
                        const result = await bcrypt.compare(req.body.password, password);
                        
                        if (result == true) {
                                const Token = jwt.sign({ userData }, secretkey, { expiresIn: '24h' });
                                const result = { userdata: userData, token: Token };
                                res.status(200).send(result);
                        } else {
                                res.status(500).send({data:'password does not match'});
                        }
                } else {
                        res.status(500).send({data:'Enter valide data'});
                }

        } catch (error) {
                res.status(500).send(error);
        }
}

const userdata = async (req, res) => {
        
        const limit = req.body.limit ||2;
        const page = req.body.page || 1; 
        const skip = limit * page - limit
      
        const result = {}
        result.currentpage = page;
        result.limit = limit;
        result.totalaDta = await user.estimatedDocumentCount();
        result.paginationList = Math.ceil(result.totalaDta / limit)
       
        if (req.params.id != undefined) {
                var userData = await user.find({ '_id': req.params.id});
                if (userData) {
                        res.status(200).send({ status: "200", data: userData });
                } else {
                        res.status(500).send({ status: "500", data: 'Data Not Found' });
                }
        } else {
                var userData = await user.find({}).skip(skip).limit(limit);
                if (userData.length > 0) {
                        res.status(200).send({ status: "200", data: userData,result:result});
                } else {
                        res.status(500).send({ status: "500", data: 'Data Not Found' });
                }
        }

}
const createuser = async (req, res) => {
        if (req.body.phone) {
                const saltRounds = 10;
                var hashpassword = await bcrypt.hash(req.body.phone, saltRounds).then(function (hash) {
                        return hash;
                });
        }
        var store = new user({
                name: req.body.name,
                email: req.body.email,
                password: hashpassword,
                phone: req.body.phone,

        });
        await store.save();

        if (store) {
                res.status(200).send({ status: "200", data: 'Data Store Successfully' });
        } else {
                res.statusCode = 401;
                res.status(401).send({ status: "401", data: 'Data Not Found' });
        }

}
const updateUser = async (req, res) => {
        console.log(req.body.email,'req.body.email');
        const udateUser = await user.updateMany(
                {
                        _id: req.params.id
                }, {
                        $set: {
                                name: req.body.name,
                                email: req.body.email,
                                phone: req.body.phone,

                        }
        }
        );
        if (udateUser) {
                res.status(200).send({ status: "200", data: "Data update successfully" });
        } else {
                res.status(500).send({ status: "500", data: "Somthing went wrong" });

        }
}
const deleteuser = async (req, res) => {
        try {
                var userData = await user.find({ _id: req.params.id });

                if (userData.length > 0) {
                        const deleteuser = await user.deleteMany(
                                {
                                        _id: req.params.id
                                }
                        );

                        if (deleteuser) {
                                res.status(200).send({ status: "200", data: "Data delete successfully" });
                        } else {
                                res.status(500).send({ status: "500", data: "Somthing went wrong" });

                        }
                } else {
                        res.status(500).send({ status: "401", data: "Data not found" });
                }
        } catch (error) {

                // res.status(500).send({status:"401",data:"Data not found"});
                res.send(error);
        }

}
const mail = async (req, res) => {

        try {
                var userData = await user.find({email:req.body.usermail});
                if(req.body.password){
                        if(userData.length > 0){
                                const saltRounds = 10;
                                var hashpassword = await bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
                                        return hash;
                                });
                                const udatePass = await user.updateMany(
                                        {
                                                email: req.body.usermail
                                        }, {$set: {
                                                password: hashpassword,
                                        }
                                });
                               
                                if(udatePass){
                                        res.status(200).send({status:200,data:'Password Update Successfully'});   
                                }
                        }
                        else{
                                res.status(401).send({status:500,data:'User not found'});   
                        }
                }else{
                      
                        if(userData.length > 0){
                                const source = fs.readFileSync('Controller/forgetmail.handlebars', 'utf-8').toString();
                                const template = Handlebars.compile(source);
                                const replacment = {
                                        username:userData.name,
                                        data:userData
                                        
                                };
                                const htmlToSend = template(replacment);      
                                var mailoption = {
                                        from: "divyabagul1412000@gmail.com",
                                        to: req.body.usermail,
                                        subject: "test mail",
                                        html:htmlToSend,
                                        // html: '<h1>This template is used for the "html" field</h1>',
                                        // text: "test mail",
                                }

                                await transporter.sendMail(mailoption, function (error, info) {
                                        if (error) {
                                                res.status(500).send('error', error);
                                        } else {
                                        
                                                res.status(200).send({status:200, data: info });
                                        }
                                });
                        }else
                        {
                                res.status(401).send({status:500,data:'User not found'});  
                        }    
                }
      
        } catch (error) {
                console.log(error);
                res.status(500).send(error);
        }
}

const fileupdade = async (req,res)=>{
     
           res.send('asas');
}
const addComplaint = async (req, res) => {
       try{
                var complaintStore = new complaint({
                        name: req.body.name,
                        email: req.body.email,
                        adhar_number: req.body.adhar_number,
                        compliant_text: req.body.compliant_text,

                });
                await complaintStore.save();
                console.log(complaintStore);
                if (complaintStore) {
                        res.status(200).send({ status: "200", data: 'Data Store Successfully' });
                } else {
                        res.statusCode = 401;
                        res.status(401).send({ status: "401", data: 'Data Not Found' });
                }
       } catch(error){
        res.status(401).send({ status: "401", data: error._message });
                console.log(error);
       }
       
}
const Complaintdata = async (req, res) => {
        
        const limit = req.body.limit ||2;
        const page = req.body.page || 1; 
        const skip = limit * page - limit
      
        const result = {}
        result.currentpage = page;
        result.limit = limit;
        result.totalaDta = await complaint.estimatedDocumentCount();
        result.paginationList = Math.ceil(result.totalaDta / limit)
       
        if (req.params.id != undefined) {
                var complaintData = await complaint.find({ '_id': req.params.id});
                if (complaintData) {
                        res.status(200).send({ status: "200", data: complaintData });
                } else {
                        res.status(500).send({ status: "500", data: 'Data Not Found' });
                }
        } else {
                var complaintData = await complaint.find({}).skip(skip).limit(limit);
                if (complaintData.length > 0) {
                        res.status(200).send({ status: "200", data: complaintData,result:result});
                } else {
                        res.status(500).send({ status: "500", data: 'Data Not Found' });
                }
        }

}
module.exports = { login, userdata, createuser, updateUser, deleteuser, mail,fileupdade ,addComplaint ,Complaintdata}