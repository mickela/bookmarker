const Router = require('express').Router();

const { getURLS, createURL, deleteURL } = require('../controllers/urls');


Router.get('/', getURLS);
Router.post('/new', createURL);
Router.delete('/delete/:id', deleteURL);

module.exports = Router;