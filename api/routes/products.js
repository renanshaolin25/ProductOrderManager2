const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const notFound = require('../middleware/not-found');

let db = {};
let sequence = 0;

router.post('/', checkAuth, (request, response) => {
  console.log("teste");
  const newProduct = {
    id: ++sequence,
    code: request.body.code,
    description: request.body.description,
    price: request.body.price
  };
  db[newProduct.id] = newProduct;

  response.status(201).json(newProduct);
});

router.get('/', (request, response) => {
  const toArray = key => db[key];
  const products = Object.keys(db).map(toArray);
  products && products.length
    ? response.json(products)
    : response.status(204).end();
});

router.get('/:productId', (request, response) => {
  const product = db[request.params.productId];
  product
    ? response.json(product)
    : notFound(request, response);
});

router.patch('/:productId', checkAuth, (request, response) => {
  const product = db[request.params.productId];
  if(product) {
    product.code = request.body.code || product.code;
    product.description = request.body.description || product.description;
    product.price = request.body.price || product.price;
    response.json(product);
  } else {
    notFound(request, response);
  }
});

router.delete('/:productId', checkAuth, (request, response) => {
  const product = db[request.params.productId];
  if(product) {
    delete db[product.id];
    response.status(200).end();
  } else {
    notFound(request, response);
  }
});

module.exports = router;