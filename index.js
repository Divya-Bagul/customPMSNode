const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser')
app.use(bodyParser.json());

const authRoute = require('./routes/auth');
app.use('/',authRoute);
app.listen(5000);