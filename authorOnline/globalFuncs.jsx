//  -   -   -   -   - Global Variables   -   -   -   -   -   //
var cards = JSON.parse(JSON.stringify(JSONcards));
const categoryColor = JSONcategoryColor;
const commands = JSONcommands;
var discardPile = [];
var language = "English";
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var activity;
var devMode = false;
var letMark = true;

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
    activity = {
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

function checkOverLap(obj1, obj2) {
    var obj1Pos = obj1.getBoundingClientRect();
    var obj2Pos = obj2.getBoundingClientRect();
    if (obj1Pos.y < obj2Pos.y + obj2Pos.height && obj1Pos.y + obj1Pos.height > obj2Pos.y) {
        if (obj1Pos.x < obj2Pos.x + obj2Pos.width && obj1Pos.x + obj1Pos.width > obj2Pos.x) {
            return true;
        }
    }
}

function getLinkChild(drag, action, list) {
    var dragChildren = drag.childNodes;
    for (var child in dragChildren) {
        if (dragChildren[child].className) {
            if (dragChildren[child].classList.contains("card")) {
                if (action == "makeList") list.push(dragChildren[child].numberId);
                else if (action == "putBack") {
                    cards[dragChildren[child].expansion][dragChildren[child].category][dragChildren[child].numberId] = dragChildren[child].obj;
                    writeActivity("Move", dragChildren[child], "to", "originalDeck");
                } else if (action == "putDiscard") {
                    discardPile.push(dragChildren[child]);
                    writeActivity("Move", dragChildren[child], "to", "discardPile");
                } else if (action == "hover") {
                    dragChildren[child].style.backgroundColor = "pink";
                }
            }
            if (dragChildren[child].classList.contains("cardLink")) {
                getLinkChild(dragChildren[child], action, list);
            }
        }
    }
    if (action == "makeList") return list;
    else if (action == "putBack" || action == "putDiscard") drag.parentNode.removeChild(drag)
}

function appendToLastChild(parent, child) {
    if (parent.childElementCount <= 1) {
        child.classList.add("linkChild")
        child.style.top = "50px";
        parent.append(child);
    } else appendToLastChild(parent.childNodes[1], child)
}
