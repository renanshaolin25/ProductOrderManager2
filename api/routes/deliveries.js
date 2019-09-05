const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const notFound = require('../middleware/not-found');

let db = {};
let sequence = 0;

router.post('/', checkAuth, (request, response) => {
  const newDelivery = {
    id: ++sequence,
    order: request.body.order,
    client: request.body.client,
    receiverName: request.body.receiverName,
    receiverDoc: request.body.receiverDoc,
    receiverIsClient: request.body.receiverIsClient,
    deliveryDateTime: request.body.deliveryDateTime,
    latLong: request.body.latLong
  };

  db[newDelivery.id] = newDelivery;

  response.status(201).json(newDelivery);
});

router.get('/', (request, response) => {
  const toArray = key => db[key];
  const deliveries = Object.keys(db).map(toArray);
  deliveries && deliveries.length
    ? response.json(deliveries)
    : response.status(204).end();
});

router.get('/:taskId', (request, response) => {
  const task = db[request.params.taskId];
  task
    ? response.json(task)
    : notFound(request, response);
});

router.patch('/:taskId', checkAuth, (request, response) => {
  const task = db[request.params.taskId];
  if(task) {
    task.order = request.body.order || task.order;
    task.client = request.body.client || task.client;
    task.receiverName = request.body.receiverName || task.receiverName;
    task.receiverDoc = request.body.receiverDoc || task.receiverDoc;
    task.receiverIsClient = request.body.receiverIsClient || task.receiverIsClient;
    task.deliveryDateTime = request.body.deliveryDateTime || task.deliveryDateTime;
    task.latLong = request.body.latLong || task.latLong;
    response.json(task);
  } else {
    notFound(request, response);
  }
});

router.delete('/:taskId', checkAuth, (request, response) => {
  const task = db[request.params.taskId];
  if(task) {
    delete db[task.id];
    response.status(200).end();
  } else {
    notFound(request, response);
  }
});

module.exports = router;