const express = require('express');
const router = express.Router();

//Get routes
router.get('/', (req, res) => res.send('Hello World from WEB API CORP!'))
router.get('/bananas', (req, res) =>
  res.send('Welcome to My WebAPI'));

module.exports = router;