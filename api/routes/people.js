const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const notFound = require('../middleware/not-found');

let db = {};
let sequence = 0;

router.post('/', checkAuth, (request, response) => {
  const newPerson = {
    id: ++sequence,
    name: request.body.name,
    doc: request.body.doc
  };

  db[newPerson.id] = newPerson;

  response.status(201).json(newPerson);
});

router.get('/', (request, response) => {
  const toArray = key => db[key];
  const people = Object.keys(db).map(toArray);
  people && people.length
    ? response.json(people)
    : response.status(204).end();
});

router.get('/:personId', (request, response) => {
  const person = db[request.params.personId];
  person
    ? response.json(person)
    : notFound(request, response);
});

router.patch('/:personId', checkAuth, (request, response) => {
  const person = db[request.params.personId];
  if(person) {
    person.name = request.body.name || person.name;
    person.doc = request.body.doc || person.doc;
    response.json(person);
  } else {
    notFound(request, response);
  }
});

router.delete('/:personId', checkAuth, (request, response) => {
  const person = db[request.params.personId];
  if(person) {
    delete db[person.id];
    response.status(200).end();
  } else {
    notFound(request, response);
  }
});

module.exports = router;