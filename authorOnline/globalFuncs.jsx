//  -   -   -   -   - Global Variables   -   -   -   -   -   //
var cards = JSON.parse(JSON.stringify(JSONcards));
const categoryColor = JSONcategoryColor;
const commands = JSONcommands;
var discardPile = [];
var language = "English";
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var activity;
var devMode = false;

//  -   -   -   -   - Global Functions   -   -   -   -   -   //
function removeOnMouseLeave(event, elem) {
    if (document.getElementById(elem)) {
        var elem = document.getElementById(elem);
        var elemPos = elem.getBoundingClientRect();
        var elemPadding = 5;
        if (elemPos.x - elemPadding < event.clientX && elemPos.x + elemPos.width + elemPadding > event.clientX && elemPos.y - elemPadding < event.clientY && elemPos.y + elemPos.height + elemPadding > event.clientY) { }
        else elem.parentNode.removeChild(elem);
    }
}

function newActivity() {

    /*
    //Make activity id number
    var actIdLength = 10;
    var noGoId = [58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96];
    var actId = "";
    while (actId.length < actIdLength) {
        var randChar = noGoId[0];
        while (0 <= noGoId.indexOf(randChar)) {
            randChar = Math.floor(Math.random() * (122 - 48)) + 48;
        } actId += String.fromCharCode(randChar);
    }
    */

    activity = {
        //"actId": actId,
        "interactCount": {},
        "activityLog": []
    }
}

function interactCounting(count) {
    if (0 <= activity.interactCount[count]) activity.interactCount[count]++;
    else activity.interactCount[count] = 1;
}

function writeActivity(handle, obj1, location, obj2) {
    var newActivity = "";

    var today = new Date();
    var date = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    newActivity += date + "-" + time;

    newActivity += " " + handle;

    if (obj1.element) newActivity += " " + obj1.element.replace(/ /gi, "-");
    else newActivity += " " + obj1;
    if (obj1.numberId) newActivity += "(" + obj1.numberId + ")";

    if (location) newActivity += " " + location;

    if (obj2) {
        if (obj2.element) newActivity += " " + obj2.element.replace(/ /gi, "-");
        else newActivity += " " + obj2;
        if (obj2.numberId) newActivity += "(" + obj2.numberId + ")";
    }
    activity.activityLog.push(newActivity);
}

function sendActivity(reason) {
    if (!devMode) {
        writeActivity("End", "activityLog", "becuase", reason);
        writeActivity("Send", "activityLog", "to", "dataBase");
        if (ref) {
            console.log("Databse: Success")
            ref.push(activity);
        } else {
            console.log("Database: Error - 404");
        }
    }
}