require('dotenv').config()
const apiRoute = require('./routes/api')
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.disable('x-powered-by')
app.use('/productReviews',apiRoute)

let port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('server has started');
})
