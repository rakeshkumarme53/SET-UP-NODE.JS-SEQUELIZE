const express = require('express');
const cors = require('./src/config/cors');
// const cors=require('cors')
const path = require('path');

const app = express();

app.use(cors);

require('./src/api/v1/routes')(app);

app.use('/resources', express.static(path.join(__dirname, "uploads")));


module.exports = app;