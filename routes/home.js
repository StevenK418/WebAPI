const express = require('express');
const router = express.Router();

//Get routes
router.get('/', (req, res) => res.send('Hello World from WEB API CORP!'))

module.exports = router;