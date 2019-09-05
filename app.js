const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/products', require('./api/routes/products'));
app.use('/api/orders', require('./api/routes/orders'));
app.use('/api/deliveries', require('./api/routes/deliveries'));
app.use('/api/people', require('./api/routes/people'));

app.use(require('./api/middleware/not-found'));

module.exports = app;