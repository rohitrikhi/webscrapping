const express = require('express')
const router = express.Router()
const productReviewsController = require('../controllers/apiController')

router.post('/', productReviewsController)

module.exports = router