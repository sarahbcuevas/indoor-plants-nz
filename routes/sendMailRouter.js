const express = require('express');
const sendMailRouter = express.Router();
const nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var hbs = require('nodemailer-express-handlebars');
var Handlebars = require('handlebars');
const auth = require('../msal_auth');

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

// able to send up to 25 emails only
// const transporter = nodemailer.createTransport({
//     host: 'smtpout.secureserver.net',
//     port: 587,
//     auth: {
//         user: 'info@thefoliagefix.co.nz',
//         pass: 'Cannibal23!!'
//     },
//     tls: {
//         ciphers:'SSLv3'
//      }
// });

// Authentication unsuccessful, SmtpClientAuthentication is disabled for the Tenant
// const transporter = nodemailer.createTransport({
//     host: "smtp.office365.com",
//     secure: false,
//     secureConnection: false,
//     port: 587,
//     auth: {
//         user: "info@thefoliagefix.co.nz",
//         pass: "Cannibal23!!"
//     },
//     tls: {
//         ciphers:'SSLv3'
//     }
// });

// const transporter = nodemailer.createTransport({
//     host: "smtp-mail.outlook.com",
//     secure: false,
//     port: 587,
//     auth: {
//         user: "info@thefoliagefix.co.nz",
//         pass: "Cannibal23!!"
//     },
//     tls: {
//         ciphers:'SSLv3'
//     }
// });

// const transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',
//     port: 587,
//     // secure: true,
//     auth: {
//         type: 'OAuth2',
//         user: 'info@thefoliagefix.co.nz',
//         clientId: 'f18fdabb-63b0-47dc-ae60-ea6a51de8e2f',
//         clientSecret: '-N9sr9HWGVKks2T.~x-_0f5MH1ZNs7V._f',
//         // refreshToken: '1/XXxXxsss-xxxXXXXXxXxx0XXXxxXXx0x00xxx',
//         // accessToken: '"eyJ0eXAiOiJKV1QiLCJub25jZSI6IkxwX1FtNExiUjFxWDE3bDNmUTZuUFJwRGp0SWZRMmVDYjhUVm9VRVpjdlUiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hYTFjYjI1ZS1mNTQwLTQ0NTAtYTZiYS1jMzU4ZThlYWI3YTEvIiwiaWF0IjoxNjMwMzMzNzI0LCJuYmYiOjE2MzAzMzM3MjQsImV4cCI6MTYzMDMzNzYyNCwiYWlvIjoiRTJaZ1lERDQ5a0QyaWs5NXd1MTlpMDF6LzEzWkJ3QT0iLCJhcHBfZGlzcGxheW5hbWUiOiJUaGUgRm9saWFnZSBGaXggTmV3IFplYWxhbmQiLCJhcHBpZCI6ImYxOGZkYWJiLTYzYjAtNDdkYy1hZTYwLWVhNmE1MWRlOGUyZiIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2FhMWNiMjVlLWY1NDAtNDQ1MC1hNmJhLWMzNThlOGVhYjdhMS8iLCJpZHR5cCI6ImFwcCIsIm9pZCI6ImYxMzEyZWZhLTdmOTUtNGFkMC05MGU3LTg5Y2E4YTkzYWZhOSIsInJoIjoiMC5BVUlBWHJJY3FrRDFVRVNtdXNOWTZPcTNvYnZhal9Hd1k5eEhybURxYWxIZWppOUNBQUEuIiwic3ViIjoiZjEzMTJlZmEtN2Y5NS00YWQwLTkwZTctODljYThhOTNhZmE5IiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik9DIiwidGlkIjoiYWExY2IyNWUtZjU0MC00NDUwLWE2YmEtYzM1OGU4ZWFiN2ExIiwidXRpIjoibFFCdWN3ZVdCRXlTbjRLMHlPaDVBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiMDk5N2ExZDAtMGQxZC00YWNiLWI0MDgtZDVjYTczMTIxZTkwIl0sInhtc190Y2R0IjoxNjIyMjAyODQyfQ.oPs7kaOUH5Y5EtL83QSHqHZj2vg6Owwc2uqcBJ7-sUBUXDT58pir5p5Jk7BkXQwBodwk9PKyq-ShkjSj1w6gCkGtvz73ZGYjn1A5NmX6YiAtBvg-GbpQPYQIHBwKhWv96pvWNXZgkhy6f6ZDe8R3-vkOD6tDVLES-FPjMO9x11WUN2HkqlCm9nLmB8IVQ0rt34kcuMMToOV9AJD4uijV8jWnYMS_yObgBhQFuOAkHl1_EI7uoXqes0B-xnuUZNf0SR8nxTRh2_k11i-ebsI4CA-P-v68Ygz8vKwxm2TzPUkV9lWEaVABsu4llBDYs9EoShURx2yrwNGI3Ebb5A4yfA',
//         accessUrl: 'https://login.microsoftonline.com/aa1cb25e-f540-4450-a6ba-c358e8eab7a1/oauth2/v2.0/token',
//         grantType: 'client_credentials'
//     }
// });

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        type: 'OAuth2'
    }
});

transporter.set('oauth2_provision_cb', (user, renew, callback) => {
    console.log('getting access token from custom client');
    return callback(null, auth.getToken(auth.tokenRequest));
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
        const isBankTransfer = req.body.paymentMethod == 'Bank_Transfer';
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
                isBankTransfer: isBankTransfer,
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
            },
            auth: {
                user: 'info@thefoliagefix.co.nz'
            }
        };

        transporter.sendMail(HelperOptions, function(err, resp) {
            if (err) return next(err);
    
            res.json(resp);
        });
    });

module.exports = sendMailRouter;