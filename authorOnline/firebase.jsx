if (!devMode) {
    // Your web app's Firebase configuration
    var config = {
        apiKey: "AIzaSyB_WPaWYk2Z0XJX2Bhhyevznjx-FygeTnM",
        authDomain: "author-online-77a3f.firebaseapp.com",
        databaseURL: "https://author-online-77a3f.firebaseio.com",
        projectId: "author-online-77a3f",
        storageBucket: "author-online-77a3f.appspot.com",
        messagingSenderId: "38832959503",
        appId: "1:38832959503:web:075000dabf3de5aeff737a",
        measurementId: "G-M9MHS63XZ8"
    };

    // Initialize Firebase
    firebase.initializeApp(config);
    var database = firebase.database();
    if (database) console.log("Database load success");
    else console.log("Database load fail");
    var ref = database.ref("activityLog");
}