var admin = require("firebase-admin");

var serviceAccount = require("./weatherAppKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://weatherapp-44d49-default-rtdb.firebaseio.com"
});

const db = admin.database(); // ← 这个才是 .ref() 的对象
module.exports = db;
