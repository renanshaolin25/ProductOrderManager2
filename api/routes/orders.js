const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const notFound = require('../middleware/not-found');

let db = {};
let sequence = 0;

router.post('/', checkAuth, (request, response) => {
  const newOrder = {
    id: ++sequence,
    requestDate: request.body.requestDate,
    cliente: request.body.cliente,
    products: request.body.products,
    status: request.body.status
  };

  db[newOrder.id] = newOrder;

  response.status(201).json(newOrder);
});

router.get('/', (request, response) => {
  const toArray = key => db[key];
  const orders = Object.keys(db).map(toArray);
  orders && orders.length
    ? response.json(orders)
    : response.status(204).end();
});

router.get('/:orderId', (request, response) => {
  const order = db[request.params.orderId];
  order
    ? response.json(order)
    : notFound(request, response);
});

router.patch('/:orderId', checkAuth, (request, response) => {
  const order = db[request.params.orderId];
  if(order) {
    order.requestDate = request.body.requestDate || order.requestDate;
    order.cliente = request.body.cliente || order.cliente;
    order.products = request.body.products || order.products;
    order.status = request.body.status || order.status;
    response.json(order);
  } else {
    notFound(request, response);
  }
});

router.delete('/:orderId', checkAuth, (request, response) => {
  const order = db[request.params.orderId];
  if(order) {
    delete db[order.id];
    response.status(200).end();
  } else {
    notFound(request, response);
  }
});

module.exports = router;