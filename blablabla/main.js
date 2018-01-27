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

//CONST INGAME VARIABLES
var maxStrikes;
var maxModules;
var startTime;
var periode;
var maxSimonLength;
var bombStat = {
    "time": 0,
    "serial": "",
    "battery": 0,
    "date": 0,
    "lang": "eng"
}
var gameActive;

function pickLang(lang) {
    bombStat.lang = lang;
    if (lang == "eng") alert("Language changed to English.");
    else if (lang == "dk") alert("Sprog ændret til dansk.");
    resetGame();
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
    maxStrikes = 3;
    maxModules = 6;
    if (maxModules < minModules) {
        if (bombStat.lang == "eng") return alert("Too few modules! Must have 2.");
        else if (bombStat.lang == "dk") return alert("For få moduler! Der skal være 2.");
    }
    if (maxModules > totalMaxModules) {
        if (bombStat.lang == "eng") return alert("Too many modules! Max of 10.");
        else if (bombStat.lang == "dk") return alert("For mange moduler! Maksimum 10.");
    }
    playerStrikes = 0;
    periode = 120 //sec
    maxSimonLength = 3;
    
    if (maxModules <= 4) document.getElementById("bomb").style.width = maxModules*140
    else if (maxModules <= 8) document.getElementById("bomb").style.width = maxModules*80+10
    else document.getElementById("bomb").style.width = maxModules*75
    document.getElementById("bombBase").innerHTML = "";
    document.getElementById("settings").style.opacity = 1;
    if (bombStat.lang == "eng") document.getElementById("abortMis").innerHTML = "Abort Mission";
    else if (bombStat.lang == "dk") document.getElementById("abortMis").innerHTML = "Abryd mission";
    
    updateStrikes();
    serial();
    date();
    batteries();
    startTime = new Date().getTime();
    var x = setInterval(function() {
        if (gameActive) {
            document.getElementById("timerDisplay").innerHTML = "";
            var newTimer = document.createElement("div");
            var currentTime = new Date().getTime();
            newTimer.innerHTML = timeConvert(periode * 1000 - (currentTime - startTime));
            document.getElementById("timerDisplay").append(newTimer);
            if (periode * 1000 - (currentTime - startTime) <= 0) resetGame();
        }
    });
    
    for (var i = 0; i < maxModules; i++) {
        var module = new Module(i);
        modules.push(module);
    }
}

function explosion(){    
    var audio = new Audio('explosion.mp3');
    audio.play();
    
    var flash = document.getElementById("flash");
    flash.style.opacity = "1";
    flash.style.width = "105%";
    flash.style.height = "105%";
    var opacity = 1.2;
    setInterval(function() {
        if (opacity <= 0) {
            flash.style.width = "0%";
            flash.style.height = "0%";
            return;
        }
        flash.style.opacity = opacity.toString();
        opacity -= 0.01;
    }, 50, flash);
    
}

function resetGame(win) {
    
    if (win) {
        var audio = new Audio('cheer.mp3');
        audio.play();
    } else explosion();
    
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
}

function timeConvert(time) {
    bombStat.time = time;
    var m = (Math.floor((time/1000/60) << 0)).toString();
    if (m.length == 1) m = "0" + m;
    var s = (Math.floor((time/1000) % 60)).toString();
    if (s.length == 1) s = "0" + s;
    var ms = (Math.floor(time % 1000 / 10)).toString();
    if (ms.length == 1) ms = "0" + ms;
    //if (ms == 1) window.devicePixelRatio;
    return m + ":" + s + ":" + ms;
}

function updateStrikes() {
    var strikeDisplay = document.getElementById("strikeDisplay");
    strikeDisplay.innerHTML = "";
    for (var i = 0; i < maxStrikes - 1; i++) {
        var newStrike = document.createElement("div");
        newStrike.className = "strikeDisp";
        if (i + 1 <= playerStrikes) newStrike.className += " strikeDispAct";
        strikeDisplay.append(newStrike);
    }
    if (playerStrikes == maxStrikes) return resetGame();
}

function updateModuleLight(module) {
    var moduleArray = document.getElementsByClassName("module");
    var moduleChildren = moduleArray[module.substr(6)].childNodes;
    moduleChildren[0].className += " moduleLightAct";
     
    var activeLights = document.getElementsByClassName("moduleLightAct");
    if (activeLights.length == moduleArray.length) resetGame(true);
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