/*Program list:
Language pick (pickLang)
Start Game (startGame)
Explosion at fail (explosion)
Reset Game (resetGame)
Time convertion (timeConvert)
Update strikes (updateStrikes)
Update module lights (updateModuleLights)
Create serial number (serial)
Creates bomb date (date)
Creates batteries (batteries)
Creates modules (module)
*/

//CONST VARIABLES
var minModules = 2;
var totalMaxModules = 10;
var audioCheer = new Audio('cheer.mp3');
var audioExp = new Audio('explosion.mp3');


//CONST INGAME VARIABLES

var startTime;
var gameActive;
var bombStat = {
    "time": 0,
    "serial": "",
    "battery": 0,
    "date": 0,
    "lang": "eng",
    "maxSimonLength": 3,
    "periode": 120,
    "maxStrikes": 3,
    "maxModules": 6
}

function pickLang(lang) {
    bombStat.lang = lang;
    if (lang == "eng") alert("Language changed to English.");
    else if (lang == "dk") alert("Sprog ændret til dansk.");
    resetGame();
}

function pickDiff(diff) {
    if (diff == "easy") {
        bombStat.periode = 120;
        bombStat.maxStrikes = 3;
        bombStat.maxModules = 2;
        maxSimonLength: 0;
    } else if (diff == "medium") {
        bombStat.periode = 120;
        bombStat.maxStrikes = 3;
        bombStat.maxModules = 4;
        maxSimonLength: 3;
    } else if (diff == "hard") {
        bombStat.periode = 60;
        bombStat.maxStrikes = 2;
        bombStat.maxModules = 6;
        maxSimonLength: 3;
    } else if (diff == "extreme") {
        bombStat.periode = 60;
        bombStat.maxStrikes = 1;
        bombStat.maxModules = 8;
        maxSimonLength: 4;
    }

//INGAME VARIABLES
var playerStrikes;

var modules = [];
function startGame() {
    gameActive = true;
    
    bombStat = {
        "time": 0,
        "serial": "",
        "battery": 0,
        "date": 0,
        "lang": bombStat.lang
    }
    playerStrikes = 0;
    
    if (bombStat.maxModules < minModules) {
        if (bombStat.lang == "eng") return alert("Too few modules! Must have 2.");
        else if (bombStat.lang == "dk") return alert("For få moduler! Der skal være 2.");
    }
    if (bombStat.maxModules > totalMaxModules) {
        if (bombStat.lang == "eng") return alert("Too many modules! Max of 10.");
        else if (bombStat.lang == "dk") return alert("For mange moduler! Maksimum 10.");
    }
    
    if (bombStat.maxModules <= 4) document.getElementById("bomb").style.width = bombStat.maxModules*140
    else if (bombStat.maxModules <= 8) document.getElementById("bomb").style.width = bombStat.maxModules*80+10
    else document.getElementById("bomb").style.width = bombStat.maxModules*75
    document.getElementById("bombBase").innerHTML = "";
    document.getElementById("settings").style.opacity = 1;
    if (bombStat.lang == "eng") document.getElementById("abortMis").innerHTML = "Abort Mission";
    else if (bombStat.lang == "dk") document.getElementById("abortMis").innerHTML = "Abryd mission";
    
    updateStrikes();
    serial();
    date();
    batteries();
    startTime = new Date().getTime();
    window.setInterval(function() {
        if (gameActive) {
            document.getElementById("timerDisplay").innerHTML = "";
            var newTimer = document.createElement("div");
            var currentTime = new Date().getTime();
            newTimer.innerHTML = timeConvert(bombStat.periode * 1000 - (currentTime - startTime));
            document.getElementById("timerDisplay").append(newTimer);
            if (bombStat.periode * 1000 - (currentTime - startTime) <= 0) resetGame("no");
        }
    }, 1);
    
    for (var i = 0; i < bombStat.maxModules; i++) {
        var module = new Module(i);
        modules.push(module);
    }
}

var opacity;
function explosion(){    
    audioExp.play();
    
    var flash = document.getElementById("flash");
    flash.style.opacity = "1";
    flash.style.width = "105%";
    flash.style.height = "105%";
    opacity = 1.2;
    window.setInterval(function() {
        if (opacity <= 0) {
            flash.style.width = "0%";
            flash.style.height = "0%";
            return;
        }
        flash.style.opacity = opacity.toString();
        opacity -= 0.01;
    }, 50, flash);
    
}

function blink(t) {
    window.setInterval(function() {
        if (!gameActive) return;
        var d = new Date();
        if (d.getMilliseconds() < 500) {
            t.style.color = "#ff2323";
            t.style.textShadow = "0px 1px 5px #ff2323";
        } else {
            t.style.color = "#2adb00";
            t.style.textShadow = "0px 1px 5px #2adb00";
        }
    }, 1);
}

function resetGame(win) {
    
    if (win == "yes") {
        audioCheer.play();
        gameActive = false;
        window.setTimeout( function() { reset(); }, 10000);
    } else if (win == "no") {
        explosion();
        reset();
    }
}

function reset() {
    document.getElementById("bomb").style.width = "300px";
    document.getElementById("settings").style.opacity = 0;
    document.getElementById("bombBase").innerHTML = "";
    document.getElementById("batteryDisplay").innerHTML = "";
    gameActive = false;

    var startButton = document.createElement("button");
    startButton.id = "startGame";
    startButton.onclick = function() { startGame() };
    if (bombStat.lang == "eng") startButton.innerHTML = "Start Game";
    else if (bombStat.lang == "dk") startButton.innerHTML = "Start Spil";
    document.getElementById("bombBase").append(startButton);
    
    
    var langs = document.createElement("div");
    langs.id = "langs";
    var langButton = document.createElement("button");
    langButton.id = "pickEnglish";
    langButton.onclick = function() { pickLang('eng') };
    langButton.innerHTML = "English";
    if (bombStat.lang == "eng") langButton.style.borderStyle = "inset";
    langs.append(langButton);
    
    var langButton = document.createElement("button");
    langButton.id = "pickDanish";
    langButton.onclick = function() { pickLang('dk') };
    langButton.innerHTML = "Dansk";
    if (bombStat.lang == "dk") langButton.style.borderStyle = "inset";
    langs.append(langButton);
    
    document.getElementById("bombBase").append(langs);
    
    
                        <button id="pickEasy" onclick="pickDiff('easy')">Easy</button>
                        <button id="pickMedium" onclick="pickDiff('medium')">Medium</button>
                        <button id="pickHard" onclick="pickDiff('hard')">Hard</button>
                        <button id="pickEx" onclick="pickDiff('extreme')">Extreme</button>
}

function timeConvert(time) {
    bombStat.time = time;
    
    if (time < 10000) {
        blink(document.getElementById("timerDisplay"))
    }
    
    var m = (Math.floor((time/1000/60) << 0)).toString();
    var s = (Math.floor((time/1000) % 60)).toString();
    if (s.length == 1) s = "0" + s;
    
    if (60000 < time) {
        return m + ":" + s
    } else {
        var ms = (Math.floor(time % 1000 / 10)).toString();
        if (ms.length == 1) ms = "0" + ms;
        return s + ":" + ms;
    }
    
    
    
}

function updateStrikes() {
    var strikeDisplay = document.getElementById("strikeDisplay");
    strikeDisplay.innerHTML = "";
    for (var i = 0; i < bombStat.maxStrikes - 1; i++) {
        var newStrike = document.createElement("div");
        newStrike.className = "strikeDisp";
        if (i + 1 <= playerStrikes) newStrike.className += " strikeDispAct";
        strikeDisplay.append(newStrike);
    }
    if (playerStrikes == bombStat.maxStrikes) return resetGame("no");
}

function updateModuleLight(module) {
    var moduleArray = document.getElementsByClassName("module");
    var moduleChildren = moduleArray[module.substr(6)].childNodes;
    moduleChildren[0].className += " moduleLightAct";
     
    var activeLights = document.getElementsByClassName("moduleLightAct");
    if (activeLights.length == moduleArray.length) resetGame("yes");
}

var serialValue;
function serial() {
    var serialLength = 8;
    var serialNumber = document.getElementById("serialDisplay");
    var serialArray = []
    for (var i = 0; i < serialLength/3; i++) {
        serialArray.push(String.fromCharCode(Math.floor(Math.random() * 25) + 65));
        serialArray.push(String.fromCharCode(Math.floor(Math.random() * 9) + 48));
        serialArray.push(String.fromCharCode(Math.floor(Math.random() * 25) + 97));
    }
    serialValue = serialArray.join("");
    bombStat.serial = serialValue;
    serialNumber.innerHTML = serialValue;
}

function date() {
    var dateYear = Math.floor(Math.random() * new Date().getYear()) + 1900;
    var dateMonth = Math.floor(Math.random() * 12) + 1;
    if (dateMonth == 2 && dateYear % 4 == 0) var dateDay = Math.floor(Math.random() * 29) + 1;
    else if (dateMonth == 2) var dateDay = Math.floor(Math.random() * 28) + 1;
    else if (dateMonth % 2 == 1 && dateMonth <= 7 || dateMonth % 2 == 0 && dateMonth >= 8) var dateDay = Math.floor(Math.random() * 31) + 1;
    else var dateDay = Math.floor(Math.random() * 30) + 1;;
    bombStat.date = dateYear;
    if (dateDay <= 9) dateDay = "0" + dateDay;
    if (dateMonth <= 9) dateMonth = "0" + dateMonth;
    if (bombStat.lang == "eng") document.getElementById("dateDisplay").innerHTML = dateMonth + "/" + dateDay + "/" + dateYear;
    if (bombStat.lang == "dk") document.getElementById("dateDisplay").innerHTML = dateDay + "/" + dateMonth + "/" + dateYear;
}

function batteries() {
    var batteryCount = Math.floor(Math.random() * 3) + 1;
    for (var i = 1; i <= batteryCount; i++) {
        var newBattery = document.createElement("div");
        newBattery.className = "battery";
        if (Math.random() < 0.5) newBattery.className += " AABattery";
        else newBattery.className += " DBattery";
        
        var batteryTip = document.createElement("div");
        batteryTip.className = "batteryTip"
        newBattery.append(batteryTip);
        
        var batteryTop = document.createElement("div");
        batteryTop.className = "batteryTop"
        newBattery.append(batteryTop);
        
        var batteryMidt = document.createElement("div");
        batteryMidt.className = "batteryMidt";
        newBattery.append(batteryMidt);
        
        var batteryEnd = document.createElement("div");
        batteryEnd.className = "batteryEnd"
        newBattery.append(batteryEnd);
        
        document.getElementById("batteryDisplay").append(newBattery);
        bombStat.battery++;
    }
}

function Module(i) {
    
    this.id = "module" + i;
    
    var newModule = document.createElement("div");
    newModule.className = "module";
    newModule.id = this.id;
    
    var moduleLight = document.createElement("div");
    moduleLight.className = "moduleLight";
    newModule.append(moduleLight);
    
    //Pick module type
    var pickRandomModule = Math.floor(Math.random() * 3) + 1;
    if (pickRandomModule == 1) {
        var mod = new WireMod(newModule, i);
        var modType = "wires";
    } else if (pickRandomModule == 2) {
        var mod = new ButtonMod(newModule, i);
        var modType = "button";
    } else if (pickRandomModule == 3) {
        var mod = new KeypadMod(newModule, i);
        var modType = "keypad";
    } 
//    else if (pickRandomModule == 4) {
//        var mod = new SimonMod(newModule, i);
//        var modType = "simonSays";
//    }
    
    this.modType = modType;
    this.mod = mod;
}
