const express = require('express');
const sendMailRouter = express.Router();
const nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var hbs = require('nodemailer-express-handlebars');
var Handlebars = require('handlebars');
const auth = require('../msal_auth');
const https = require('https');
const config = require('../config');
var fs = require('fs');
var path = require('path');

sendMailRouter.use(bodyParser.json());

Handlebars.registerHelper('amount', function(val1, val2, options) {
    return (val1 * val2 / 100).toFixed(2);
});

Handlebars.registerHelper('subtotal', function(val, options) {

    let subTotal = 0;
    for (let i=0; i<val.length; i++) {
        subTotal += (val[i].product.price * val[i].quantity);
    }

    return (subTotal / 100).toFixed(2);
});

async function sendEmail(options) {

    // Open template file
    var source = fs.readFileSync(path.join(__dirname, options.filePath), 'utf8');
    // Create email generator
    var template = Handlebars.compile(source);

    var token = await auth.getToken(auth.tokenRequest);
        const data = JSON.stringify({
            "message": {
                "subject": options.subject,
                "body": {
                    "contentType": "HTML",
                    "content": template(options.locals)
                },
                "toRecipients": [
                    {
                        "emailAddress": {
                            "address": options.recipient
                        }
                    }
                ]
            },
            "saveToSentItems": "true"
        });

        const httpConfig = {
            host: 'graph.microsoft.com',
            path: `/v1.0/users/${config.USER_ID}/sendMail`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': `Bearer ${token.accessToken}`
            },
        };
    
        const result = 200;
        const req2 = https.request(httpConfig, resp => {
            resp.on('data', d => {
                process.stdout.write(d);
            })
        });
              
        req2.on('error', error => {
            result = error;
        });
              
        req2.write(data.toString());
        req2.end();

        return result;
}

sendMailRouter.route('/')
    .post(async function(req, res, next) {
        const subject = `[${req.body.type}] The Foliage Fix`;
        var messageType = '';
        switch(req.body.type) {
            case "Inquiry":
                messageType = "an inquiry";
                break;
            case "Feedback":
                messageType = "a feedback";
                break;
            default:
                messageType = "a message";
                break;
        }
        const locals = {
            name: req.body.name,
            type: messageType,
            contact: req.body.contact,
            email: req.body.email,
            message: req.body.message
        };

        var options = {
            filePath: '../views/contactus.handlebars',
            subject: subject,
            recipient: 'info@thefoliagefix.co.nz',
            locals: locals
        };

        var result = await sendEmail(options);
        if (result === 200) {
            return res.status(200).json({status: 'Contact Us email sent!'});
        } else {
            return next(result);
        }
    });

sendMailRouter.route('/order')
    .post(async function(req, res, next) {
        const subject = `Order #${req.body.code} confirmed`;
        const forDelivery = req.body.shipping.mode != 'pickup';
        const storeUrl = req.body.url.split('/order-confirmation')[0];
        const isBankTransfer = req.body.paymentMethod == 'Bank_Transfer';
        let discountPercent = '';
        if (req.body.discount && req.body.discount.discount > 0) {
            discountPercent = req.body.discount.mode == '%';
        }

        var locals = {
            order: req.body,
            orderItems: req.body.orderItems,
            forDelivery: forDelivery,
            isBankTransfer: isBankTransfer,
            discountPercent: discountPercent,
            shippingFee: (req.body.shipping.fee / 100).toFixed(2),
            total: (req.body.total / 100).toFixed(2),
            storeUrl: storeUrl
        };

        var options = {
            filePath: '../views/order-confirmation.handlebars',
            subject: subject,
            recipient: req.body.customer.email,
            locals: locals
        };

        var result = await sendEmail(options);
        if (result === 200) {
            return res.status(200).json({status: 'Order confirmation email sent!'});
        } else {
            return next(result);
        }
    });

sendMailRouter.route('/order/fulfill')
    .post(async function(req, res, next) {
        const subject = `Order #${req.body.code} is on the way`;
        const forDelivery = req.body.shipping.mode != 'pickup';        
        const storeUrl = req.body.url.split('/order-confirmation')[0];
        let discountPercent = '';

        if (req.body.discount && req.body.discount.discount > 0) {
            discountPercent = req.body.discount.mode == '%';
        }

        var locals = {
            order: req.body,
            orderItems: req.body.orderItems,
            forDelivery: forDelivery,
            discountPercent: discountPercent,
            shippingFee: (req.body.shipping.fee / 100).toFixed(2),
            total: (req.body.total / 100).toFixed(2),
            storeUrl: storeUrl
        }

        var options = {
            filePath: '../views/order-fulfillment.handlebars',
            subject: subject,
            recipient: req.body.customer.email,
            locals: locals
        };

        var result = await sendEmail(options);
        if (result === 200) {
            return res.status(200).json({status: 'Order fulfillment email sent!'});
        } else {
            return next(result);
        }
    });

module.exports = sendMailRouter;