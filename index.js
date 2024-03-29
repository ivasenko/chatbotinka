'use strict'

const express = require('express');
const bodyParser = require('body-parser');
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
    if (req.query['hub.verify_token'] === 'blondiebytes') {
        res.send(req.query['hub.challenge'])
    }
    res.send('wrong token')
})

app.post('/webhook/', function(req,res) {
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i];
        let sender = event.sender.id;

        if (event.message && event.message.text) {
            let text = event.message.text;

            sendText(sender, "Text echo: " + text.substring(0, 100));

            if (text.includes("hello")) {
                sendText(sender, "Text echo: " + "good morning");
            }
        }
    }

    res.status(200).send('EVENT_RECEIVED');
})

const token = "EAAG2C4EMa4QBAEoIhRBxZC4HBQaYGy90ZCDyZBMs3UPECVhL5bx4whJZBk14SmQzyroWv02U1ZC4NMGMxwyFtCSQZAkzBDZAbkSAuTWze3L2Lwq4a5lY84fME09TTciUwfZC3YZBKslR2yTbEAm0UGGqGIoIs8I6Sq5WS9fq1hZBKiIzIv4m7ZBjn2ZC";

function sendText(sender, text) {
    let messageData = {text: text};
    if (text.includes('options')) {
        return getMessageTemplate(sender, text);
    }
    request({
        url: "https://graph.facebook.com/v4.0/me/messages",
        qs: {access_token : token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function (error, response, body) {
        if (error) {
            console.log("error");
        } else if (response.body.error) {
            console.log("response body error");
        }
    });
}

app.listen(app.get('port'), function() {
    console.log('running port')
})
