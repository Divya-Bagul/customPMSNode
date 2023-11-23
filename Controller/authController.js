const express = require('express');
const authRoute = express();
const user = require('../model/user');
const bodyParser = require('body-parser')
var cors = require('cors');
authRoute.use(cors());
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
        res.send('asas');
}

module.exports = { login,userdata }