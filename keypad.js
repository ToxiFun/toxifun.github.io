var mainKeypadSec = [
        ["Ð", "Ç", "¶", "¸", "ï", "þ", "ò"],
        ["Þ", "Ð", "ò", "¥", "×", "þ", "§"],
        ["©", "º", "¥", "¢", "±", "¶", "×"],
        ["ª", "¨", "Ï", "ï", "¢", "§", "¿"],
        ["µ", "¿", "Ï", "ó", "¨", "¤", "·"],
        ["ª", "Þ", "¾", "Ø", "«", "ã", "õ"]
    ]

function KeypadMod(newModule, n) {
    var newKeypadModule = document.createElement("div");
    newKeypadModule.className = "keypadMod";
    
    var keypadSec = [
        ["Ð", "Ç", "¶", "¸", "ï", "þ", "ò"],
        ["Þ", "Ð", "ò", "¥", "×", "þ", "§"],
        ["©", "º", "¥", "¢", "±", "¶", "×"],
        ["ª", "¨", "Ï", "ï", "¢", "§", "¿"],
        ["µ", "¿", "Ï", "ó", "¨", "¤", "·"],
        ["ª", "Þ", "¾", "Ø", "«", "ã", "õ"]
    ]
    var pickRow = Math.floor(Math.random() * keypadSec.length);
    var thisSec = [pickRow, []];
    for (var i = 0; i < 4; i++) {
        var newKeypadDiv = document.createElement("div");
        newKeypadDiv.className = "keypadDiv";
        var newKeypadBut = document.createElement("button");
        newKeypadBut.id = "keypadBut" + i;
        newKeypadBut.className = "keypadBut";
        
        var keypadLight = document.createElement("div");
        keypadLight.className = "keypadLight";
        newKeypadDiv.append(keypadLight);
        
        var pickSym = Math.floor(Math.random() * keypadSec[pickRow].length)
        var symbol = keypadSec[pickRow][pickSym];
        keypadSec[pickRow].splice(pickSym, 1);
        thisSec[1].push(mainKeypadSec[pickRow].indexOf(symbol));
        thisSec[1].sort();
        newKeypadBut.innerHTML = symbol;
        
        newKeypadBut.onclick = function() {
            if (this.parentNode.parentNode.parentNode.childNodes[0].className.indexOf("moduleLightAct") < 0) {
                if (mainKeypadSec[thisSec[0]].indexOf(this.innerHTML) == thisSec[1][0]) {
                    this.previousSibling.className += " keypadLightAct";
                    thisSec[1].splice(0, 1);
                } else {
                    playerStrikes++;
                    updateStrikes();
                }
                if (thisSec[1].length == 0) updateModuleLight(newModule.id);
            }
        }
        
        newKeypadDiv.append(newKeypadBut)
        newKeypadModule.append(newKeypadDiv);
    }
    
    newModule.append(newKeypadModule);
    document.getElementById("bombBase").append(newModule);
}