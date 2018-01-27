var waitFunc;
var hold;
var stripCol = ["Red", "Blue", "#e2ff00", "White", "Black"];
function ButtonMod(newModule, n) {
    var buttonVal = {
        "eng": ["Abort", "Detonate", "Hold", "Push"],
        "dk": ["Afbryd", "Detoner", "Hold", "Tryk"]
    };
    var buttonCol = ["Red", "Blue", "#e2ff00", "White"];
    
    var newButtonModule = document.createElement("div");
    newButtonModule.className = "buttonMod";
    
    var newButton = document.createElement("button");
    newButton.className = "button";
    var thisButtonVal = buttonVal[bombStat.lang][Math.floor(Math.random() * buttonVal[bombStat.lang].length)];
    var thisButtonCol = buttonCol[Math.floor(Math.random() * buttonCol.length)]
    newButton.innerHTML = thisButtonVal
    newButton.style.backgroundColor = thisButtonCol;
    
    var newButtonStrip = document.createElement("div");
    newButtonStrip.className = "strip";
    
    newButton.onmousedown = function() {
        var randomCol = Math.floor(Math.random() * stripCol.length - 1) + 1;
        if (this.parentNode.parentNode.childNodes[0].className.indexOf("moduleLightAct") < 0) {
            modules[n] = 100; //millisec
            waitFunc = true;
            setInterval(function() {
                if (waitFunc && newButton.parentNode.parentNode.childNodes[0].className.indexOf("moduleLightAct") < 0) {
                    if (modules[n] < 0) {
                        newButton.nextElementSibling.style.backgroundColor = stripCol[randomCol];
                        newButton.nextElementSibling.style.boxShadow = "-1px -1px 10px 0px " + stripCol[randomCol];
                        newButton.nextElementSibling.style.border = "none";
                        hold = true;
                    } else {
                        hold = false;
                        modules[n]--;
                    }
                }
            }, 1, waitFunc, modules[n], stripCol[randomCol], newButton);
        }
    }
    
    newButton.onmouseup = function() {
        waitFunc = false;
        if (this.parentNode.parentNode.childNodes[0].className.indexOf("moduleLightAct") < 0) {
            if (hold && ((thisButtonVal == "Afbryd" || thisButtonVal == "Abort") && thisButtonCol == "Blue")) {
                stripPic(bombStat.time.toString(), newButton.nextElementSibling.style.backgroundColor)
            } else if (1 < bombStat.battery && (thisButtonVal == "Detoner" || thisButtonVal == "Detonate")) {
            } else if (hold && (thisButtonCol == "White" && bombStat.date < 1961)) {
                stripPic(bombStat.time.toString(), newButton.nextElementSibling.style.backgroundColor)
            } else if (2 < bombStat.battery && bombStat.date > 1960) {
            } else if (hold && (thisButtonCol == "#e2ff00")) {
                stripPic(bombStat.time.toString(), newButton.nextElementSibling.style.backgroundColor)
            } else if (thisButtonCol == "Red" && thisButtonVal == "Hold") {
            } else if (hold) {
                stripPic(bombStat.time.toString(), newButton.nextElementSibling.style.backgroundColor)
            } else {
                playerStrikes++;
                updateStrikes();
            }
            updateModuleLight(newModule.id);
        }
    }
    
    newButtonModule.append(newButton);
    newButtonModule.append(newButtonStrip);
    newModule.append(newButtonModule);
    document.getElementById("bombBase").append(newModule)
    
    var val = 0;
    return val;
}

function stripPic(d, c) {
    if (c.toLowerCase() == "blue") {
        if (d.indexOf("4") < 0) {
            playerStrikes++;
            updateStrikes();
        }
    } else if (c.toLowerCase() == "white") {
        if (d.indexOf("2") < 0) {
            playerStrikes++;
            updateStrikes();
        }
    } else if (c.toLowerCase() == "#e2ff00") {
        if (d.indexOf("5") < 0) {
            playerStrikes++;
            updateStrikes();
        }
    } else {
        if (d.indexOf("1") < 0) {
            playerStrikes++;
            updateStrikes();
        }
    }
}