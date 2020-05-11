
//Gloabl variables
var name, email, photoUrl, uid, emailVerified;

var config = {
apiKey: "AIzaSyDITJm2Uiye8VSFturMBOWxY5v85S5F4Zc",
authDomain: "homegym-19546.firebaseapp.com",
databaseURL: "https://homegym-19546.firebaseio.com",
projectId: "homegym-19546",
storageBucket: "homegym-19546.appspot.com",
messagingSenderId: "680066508164",
appId: "1:680066508164:web:243b8b6313c36ace9c29d1",
measurementId: "G-1CHZC4823T"
};

// Initialize Firebase
firebase.initializeApp(config);
var database = firebase.database();
if (database) console.log("Database load success");
else console.log("Database load fail");
var ref = database.ref("tumblingSkills");