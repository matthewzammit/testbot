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
        var text = event.message.text || "";
		var values = text.split(' ');
		
		
		if (event.message && event.message.text) {
			if (event.message.text.toUpperCase() === 'GENERIC') {
				sendGenericMessage(event.sender.id);
                continue;
            }			

			else if (values.length === 3){
				
			//	text = text || "";
				sendMessage(event.sender.id, {text: "STEP 1: " + text});
			
		//		var values = text.split(' ');
				sendMessage(event.sender.id, {text: "STEP 2: " + values[0] });

				if (values[0].toUpperCase() === 'KITTEN'){
					sendMessage(event.sender.id, {text: "STEP 3: entered" });

					kittenMessage(event.sender.id, event.message.text)
					continue;	
				}
			}  			
			/*	else if (!kittenMessage(event.sender.id, event.message.text)) {
				continue;
			}
		*/	
         else if (event.postback) {
                console.log("Postback received: " + JSON.stringify(event.postback));
            sendMessage(event.sender.id, {text: "I like this kitten too!"});
        } 
			else {
			sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
		}
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
                        }]
            }
        }
   }
            sendMessage(recipientId, message);
        }
			
}
};

function sendGenericMessage(sender) {
	
	 sendMessage(sender, {text: "Here are some items to buy"});	

	 messageData = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                    "title": "Amazon Echo, Black",
                    "subtitle": "Step into Rift. Whether you’re stepping into your favorite game, watching an immersive VR movie, jumping to a destination on the other side of the world, or just spending time with friAmazon Echo is a hands-free speaker you control with your voice. Echo connects to the Alexa Voice Service to play music, provide information, news, sports scores, weather and more. Prime members can also ask Alexa to order eligible products they've ordered before and many Prime products. All you have to do is ask.",
                    "image_url": "https://images-na.ssl-images-amazon.com/images/I/61aN%2BSE-F9L._SL1000_.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.amazon.co.uk/Amazon-SK705DI-Echo-Black/dp/B01GAGVIE4/ref=sr_1_1",
                        "title": "Buy now"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Amazon Echo",
                    }],
                }, {
                    "title": "Oculus Rift",
                    "subtitle": "Step into Rift. Whether you’re stepping into your favorite game, watching an immersive VR movie, jumping to a destination on the other side of the world, or just spending time with friends in VR, you’ll feel like you’re really there.",
                   "image_url": "",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://images-na.ssl-images-amazon.com/images/I/61ahfXnBa0L._SL1300_.jpg",
                        "title": "Buy now"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Oculus rift",
                    }], 
				}, {
                    "title": "Philips Hue White and Colour Ambiance Wireless Lighting",
                    "subtitle": "Limitless possibilities - connected to you. Get started with the Philips Hue white and colour ambience starter kit and experience high quality white and coloured light that offers you endless possibilities. Play with light and choose from 16 million colours in the Hue app to match the light to your mood. The bulbs have been improved with deeper green, cyan and blue for even better scene setting in your home. Use a favourite photo and re-live that special moment with splashes of light. This Philips Hue bridge is compatible with Apple Home Kit technology. Ask Siri to turn on or dim your lights or recall pre-sets without touching a single button. Use a favourite photo and re-live that special moment with splashes of light. Save your favourite light settings and recall them whenever you want with the tap of a finger.",
                   "image_url": "https://images-na.ssl-images-amazon.com/images/I/71me8OodAxL._SL1500_.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.amazon.co.uk/Philips-Ambiance-Wireless-Lighting-Starter/dp/B01K1WP7Z4/ref=sr_1_1",
                        "title": "Buy now"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Philips Hue",
                    }],
                }]
            }
        }
    }
            sendMessage(sender, messageData);

};