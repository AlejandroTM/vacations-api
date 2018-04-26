const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '968561356994-2krhtmu41b03no95ea0vn1ef4fn951rf.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
const COMPANY_DOMAIN = 'kairosds.com';

const validateGoogleToken = function(clientData, response){
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: clientData.idToken,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userId = payload['sub'];
        const companyDomain = payload['hd'];
        if( userId && companyDomain === COMPANY_DOMAIN ){
            // User is correct. Return clientID
            response.status(200).send({rslt: 'OK', data: { userId: userId, email: payload.email } });
        }else{
            response.status(500).send({rslt: 'KO', error: 'Kairos Google account is not valid.'});
        }
    }
    verify().catch(console.error);
};

module.exports = {
    validateToken: validateGoogleToken
};