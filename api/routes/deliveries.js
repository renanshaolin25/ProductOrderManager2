const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const notFound = require('../middleware/not-found');

let db = {};
let sequence = 0;

router.post('/', checkAuth, (request, response) => {
  if(request.body.order.status !== "DESPACHADO"){
    response.status(500).json("Favor alterar o status do pedido para 'Despachado'!");
  }else{
    const newDelivery = {
      id: ++sequence,
      order: request.body.order,
      receiverName: request.body.receiverName,
      receiverDoc: request.body.receiverDoc,
      receiverIsClient: request.body.receiverIsClient,
      deliveryDateTime: new Date(),
      latLong: request.body.latLong
    };
  
    db[newDelivery.id] = newDelivery;
  
    response.status(201).json(newDelivery);
  }
});

router.get('/', (request, response) => {
  const toArray = key => db[key];
  const deliveries = Object.keys(db).map(toArray);
  deliveries && deliveries.length
    ? response.json(deliveries)
    : response.status(204).end();
});

router.get('/:deliveryId', (request, response) => {
  const delivery = db[request.params.deliveryId];
  delivery
    ? response.json(delivery)
    : notFound(request, response);
});

router.patch('/:deliveryId', checkAuth, (request, response) => {
  const delivery = db[request.params.deliveryId];
  if(delivery) {
    delivery.order = request.body.order || delivery.order;
    delivery.receiverName = request.body.receiverName || delivery.receiverName;
    delivery.receiverDoc = request.body.receiverDoc || delivery.receiverDoc;
    delivery.receiverIsClient = request.body.receiverIsClient || delivery.receiverIsClient;
    delivery.deliveryDateTime = request.body.deliveryDateTime;
    delivery.latLong = request.body.latLong || delivery.latLong;
    response.json(delivery);
  } else {
    notFound(request, response);
  }
});

router.delete('/:deliveryId', checkAuth, (request, response) => {
  const delivery = db[request.params.deliveryId];
  if(delivery) {
    delete db[delivery.id];
    response.status(200).end();
  } else {
    notFound(request, response);
  }
});

module.exports = router;