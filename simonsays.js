function SimonMod(newModule, n) {
    var simonCols = ["coral", "yellow", "green", "blue"];
    var newSimonModule = document.createElement("div");
    newSimonModule.className = "simonMod";
    
    //Player pick, current, , timer
    var sec = [4, 4, 4, new Date().getTime()];
    for (var i = 0; i < simonCols.length; i++) {
        var newSimonBut = document.createElement("button");
        newSimonBut.style.backgroundColor = "light" + simonCols[i];
        newSimonBut.id = "simonBut" + i;
        newSimonBut.className = "simonBut";
        newSimonBut.onclick = function() {
            sec[0] = this.id.substr(8);
        }
        newSimonModule.append(newSimonBut);
    }
    
    newModule.append(newSimonModule);
    document.getElementById("bombBase").append(newModule);
    
    for (var i = 0; i < maxSimonLength; i++) {
        var randomCol = Math.floor(Math.random() * 4);
        sec.push(simonCols[randomCol]);
    }
    
    var simonSays = setInterval(function() {
        if (gameActive) {
            var moduleArray = document.getElementsByClassName("module");
            for (var j = 0; j < modules.length; j++) {
                if (modules[j].modType == "simonSays") {
                    var buts = moduleArray[j].childNodes[1].childNodes;
                    var butCol = modules[j].mod[modules[j].mod[2]];
                    var butGlow = buts[simonCols.indexOf(butCol)];
                    if ((new Date().getTime() - sec[3]) % 500 <= 5) if (butGlow.style.backgroundColor.indexOf("light") < 0) butGlow.style.backgroundColor = "light" + butGlow.style.backgroundColor;
                    else if (0 <= butGlow.style.backgroundColor.indexOf("light")) butGlow.style.backgroundColor = butGlow.style.backgroundColor.substr(5);
                    if (simonCols[modules[j].mod[0].toString()] == modules[j].mod[modules[j].mod[1].toString()]) {
                        console.log(modules[j].id + ":" + modules[j].mod)
                        modules[j].mod[1]++;
                    }
                }
            }
        }
    }, 1);
    
    var val = sec;
    return val;
}