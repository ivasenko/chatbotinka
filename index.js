'use strict'

const express = require('express');
const bodyParser = require('bodyParser');
const request = require('request');

const app = express()

app.set('port', (process.env.PORT || 5000))


// allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// routes
app.get('/', function(req, res) {
    res.send('hi i am chatbot')
})

// facebook

app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === 'irenbytes') {
        res.send(req.query['hub.challenge'])
    }
    res.send('wrong token')
})

app.listen(app.get('port'), function() {
    console.log('running port')
})
