const express = require('express');
const sendMailRouter = express.Router();
const nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var hbs = require('nodemailer-express-handlebars');
var Handlebars = require('handlebars');

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

const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 587,
    auth: {
        user: 'info@thefoliagefix.co.nz',
        pass: 'Cannibal23!!'
    },
    tls: {
        ciphers:'SSLv3'
     }
});

transporter.use('compile', hbs({
    viewEngine: {
        extName: ".handlebars",
        partialsDir: "./views/",
        defaultLayout: false
    },
    viewPath: "./views/",
    extName: ".handlebars"
}));

sendMailRouter.route('/')
    .post(function(req, res, next) {
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
        const HelperOptions = {
            from: '"The Foliage Fix" <info@thefoliagefix.co.nz>',
            to: req.body.recipient,
            subject: subject,
            template: 'contactus',
            context: {
                name: req.body.name,
                type: messageType,
                contact: req.body.contact,
                email: req.body.email,
                message: req.body.message
            }
        };

        transporter.sendMail(HelperOptions, function(err, resp) {
            if (err) return next(err);

            res.json(resp);
        })
    });

sendMailRouter.route('/order')
    .post(function(req, res, next) {
        const subject = `Order #${req.body.code} confirmed`;
        const forDelivery = req.body.shipping.mode != 'pickup';
        const storeUrl = req.body.url.split('/order-confirmation')[0];
        let discountPercent = '';
        if (req.body.discount) {
            discountPercent = req.body.discount.mode == '%';
        }
        const HelperOptions = {
            from: '"The Foliage Fix" <info@thefoliagefix.co.nz>',
            to: req.body.customer.email,
            bcc: 'info@thefoliagefix.co.nz',
            subject: subject,
            template: 'order-confirmation',
            context: {
                order: req.body,
                orderItems: req.body.orderItems,
                forDelivery: forDelivery,
                discountPercent: discountPercent,
                shippingFee: (req.body.shipping.fee / 100).toFixed(2),
                total: (req.body.total / 100).toFixed(2),
                storeUrl: storeUrl
            }
        };

        transporter.sendMail(HelperOptions, function(err, resp) {
            if (err) return next(err);
    
            res.json(resp);
        });

    });

sendMailRouter.route('/order/fulfill')
    .post(function(req, res, next) {
        const subject = `Order #${req.body.code} is on the way`;
        const forDelivery = req.body.shipping.mode != 'pickup';
        const storeUrl = req.body.url.split('/order-confirmation')[0];
        let discountPercent = '';
        if (req.body.discount && req.body.discount.discount > 0) {
            discountPercent = req.body.discount.mode == '%';
        }
        const HelperOptions = {
            from: '"The Foliage Fix" <info@thefoliagefix.co.nz>',
            to: req.body.customer.email,
            bcc: 'info@thefoliagefix.co.nz',
            subject: subject,
            template: 'order-fulfillment',
            context: {
                order: req.body,
                orderItems: req.body.orderItems,
                forDelivery: forDelivery,
                discountPercent: discountPercent,
                shippingFee: (req.body.shipping.fee / 100).toFixed(2),
                total: (req.body.total / 100).toFixed(2),
                storeUrl: storeUrl
            }
        };

        transporter.sendMail(HelperOptions, function(err, resp) {
            if (err) return next(err);
    
            res.json(resp);
        });
    });

module.exports = sendMailRouter;