const express = require('express');
const sendMailRouter = express.Router();
const nodemailer = require('nodemailer');
var bodyParser = require('body-parser');

sendMailRouter.use(bodyParser.json());

sendMailRouter.route('/')
    .post(function(req, res, next) {
        const outputData = `
            <ul>
                <li>Name: ${req.body.name}</li>
                <li>Contact: ${req.body.contact}</li>
                <li>Email: ${req.body.email}</li>
            <ul>
            <span>Message: </span><br>
            <p>${req.body.message}</p>`;
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: false,
            port: 25,
            auth: {
                user: 'sarahbcuevas@gmail.com',
                pass: 'blahblah414'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const subject = `[${req.body.type}] Indoor Plants NZ`;
        const HelperOptions = {
            from: 'sarahbcuevas@gmail.com',
            to: 'sarahbcuevas@gmail.com',
            subject: subject,
            html: outputData
        };

        transporter.sendMail(HelperOptions, function(err, resp) {
            if (err) return next(err);
            console.log('The message was sent!');
            res.writeHead('200', { 'Content-Type': 'text/plain' });
            res.end('The message was sent.');
        })
    });

module.exports = sendMailRouter;