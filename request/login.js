const { OAuth2Client } = require('google-auth-library');
const firebase = require('firebase');
const CLIENT_ID = '391465752953-3tcok1vqo56nb7f7h3soo4060ni72q3a.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
const COMPANY_DOMAIN = 'kairosds.com';

const validateGoogleToken = function (clientData, response) {
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
        if (userId && companyDomain === COMPANY_DOMAIN) {
            // User is correct. Return clientID
            response.status(200).send({ rslt: 'OK', data: { userId: userId, email: payload.email } });
        } else {
            response.status(500).send({ rslt: 'KO', error: 'Kairos Google account is not valid.' });
        }
    }
    verify().catch(console.error);
};

const config = {
    apiKey: "AIzaSyBjJYKWw03IMBwfMjv6QdDyfv1ltTqdFUA",
    authDomain: "kairos-employees.firebaseapp.com",
    databaseURL: "https://kairos-employees.firebaseio.com",
    projectId: "kairos-employees",
    storageBucket: "kairos-employees.appspot.com",
    messagingSenderId: "391465752953"
};

const loginFirebase = function (id_token) {

    /*firebase.auth().signInWithCredential(credential).then(u => {
        //blah blah bleep
    }).catch((error)=>{
        console.log(JSON.stringify(error));
    });
    
    var credential = firebase.auth.GoogleAuthProvider.credential(id_token);
    const app = firebase.initializeApp(config);
    const db = firebase.database(app);
    // Sign in with credential from the Google user.
    firebase.auth().signInWithCredential(credential).then(function(){
        console.log(arguments);
        //const app = firebase.initializeApp(config);
        //const db = firebase.database(app);
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });*/
};

module.exports = {
    validateToken: validateGoogleToken
};