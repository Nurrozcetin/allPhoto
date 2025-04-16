const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "allphoto-b3444.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
