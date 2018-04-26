const nodemailer = require('nodemailer');
const credentials = require('./../credentials.json');

const DESTINATION = 'jandrotm@gmail.com'; // Should be changed for the ambassadors accounts.
const FAKE_SENDER = '<vacations@kairosds.com>'; // Fake sender

const _getSubject = function(teamMate){
    return `[Vacaciones] Solicitud vacaciones ${teamMate}.`;
};

const _getMessage = function(options){
    return `<p>Solicitud de vacaciones de <b>${options.teamMate}</b> desde <b>${options.startDate}</b> hasta <b>${options.endDate}</b></p><br></br>`;
};

const sendEmailService = function( options, res ){
    sendEmail(options, res);
};

const sendEmail = function(options, res) {
    const vacationsUser = options.teamMate; 
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            type: 'OAuth2',
            user: credentials.EMAIL,
            clientId: credentials.CLIENT_ID,
            clientSecret: credentials.SECRET_ID,
            refreshToken: credentials.REFRESH_TOKEN
        }
    });

    let mailOptions = {
        from: 'Vacations Email <vacations@kairosds.com>',
        to: DESTINATION,
        subject: _getSubject(vacationsUser),
        html: _getMessage(options)
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log("Error sending email: " + JSON.stringify(err));
        }else{
            console.log('[SendEmail OK] ' + JSON.stringify(res));
            res.status(200).send({rslt: 'OK', data: credentials});
        }
    })
};

module.exports = {
    sendEmail: sendEmailService
};