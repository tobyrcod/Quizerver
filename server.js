const express = require('express');
const app = express();
// const _ = require('lodash');
// const fs = require('fs');

app.use(express.static('client'));

app.listen(8090);
