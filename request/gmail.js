const fs = require('fs');
const sender = require('gmail-send');
const credentials = require('./../credentials.json');

const DESTINATION = 'jandrotm@gmail.com'; // Should be changed for the ambassadors accounts.

const _getSubject = function(teamMate){
    return `[Vacaciones] Solicitud vacaciones ${teamMate}.`;
};

const _getMessage = function(options){
    return `Solicitud de vacaciones de ${options.teamMate} desde ${options.starDate} hasta ${options.endDate}`;
};

const sendEmailService = function( options, res ){
    sendMail(options);
    res.status(200).send({rslt: 'OK', data: credentials});
};

const sendMail = function( options ){
    const vacationsUser = options.teamMate; 
    sender({
        //var send = require('../index.js')({
          user: credentials.email,
          pass: credentials.password,
          to:   credentials.email,
          from: credentials.email,
          replyTo: credentials.email,
          subject: _getSubject(vacationsUser),
          text: _getMessage(options)
          //html:    '<b>html text</b>'            // HTML
        }, function(err, res){
            if(!err) {
                console.log("Error sending email: " + err);
            }else{
                console.log('[SendEmail OK] ' + res);
            }
        });
};

module.exports = {
    sendEmail: sendEmailService
};