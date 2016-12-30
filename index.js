var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
    	res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {		
        var event = events[i];
        if (event.message && event.message.text) {
			if (event.message.text === 'Generic') {
				sendGenericMessage(event.sender.id);
                //continue;
            }
			
			else if (!kittenMessage(event.sender.id, event.message.text)) {
				sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
			}
			
        } else if (event.postback) {
                console.log("Postback received: " + JSON.stringify(event.postback));
            sendMessage(event.sender.id, {text: "I like this kitten too!"});
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });

};

// send rich message with kitten
function kittenMessage(recipientId, text) {

    text = text || "";
    var values = text.split(' ');

    if (values.length === 3 && values[0].toUpperCase() === 'KITTEN') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {

            var imageUrl = "https://placekitten.com/g/" + Number(values[1]) + "/" + Number(values[2]);

            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }, {
                    "title": "Oculus rift",
                    "subtitle": "Step into Rift. Whether you’re stepping into your favorite game, watching an immersive VR movie, jumping to a destination on the other side of the world, or just spending time with friends in VR, you’ll feel like you’re really there.",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "Buy now",
                        "url": "https://www.amazon.co.uk/d/PC-Video-Games/Oculus-301-00204-01-Rift/B00ZFOGHRG/ref=sr_1_1?ie=UTF8&qid=1483140062&sr=8-1&keywords=rift",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Samsung Gear Gen 2 Virtual Reality",
                    "subtitle": "With the Gear VR you get a bigger field of view, smoother images. Low light leakage and reflection prevention. It's game on.",
                    "image_url": "https://www.amazon.co.uk/Samsung-Gear-Gen-Virtual-Reality/dp/B01LX1LL6P/ref=sr_1_2?ie=UTF8&qid=1483140120&sr=8-2&keywords=gear+vr",
                    "buttons": [{
                        "type": "postback",
                        "title": "Buy now",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }


            sendMessage(recipientId, message);

            return true;
        }
    }

    return false;

}

function sendGenericMessage(sender) {
	
	                sendMessage(sender, {text: "GENERIC FUNCTION CALL"});	

	
/*    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })*/
};