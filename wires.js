function WireMod(newModule, n) {
    this.test = "Work'd";
    
    var wires = [];
    var wireCol = ["red", "blue", "#e2ff00", "white", "black"];
    
    var newWireModule = document.createElement("div");
    newWireModule.className = "wireMod";
    var wiresCount = Math.floor(Math.random() * 4) + 3; //4 + 3
    for (var i = 0; i < wiresCount; i++) {
        wires.push(wireCol[Math.floor(Math.random() * wireCol.length)]);
        var wire = document.createElement("button");
        wire.className = "wire";
        wire.id = "wire" + (i + 1);
        wire.style.backgroundColor = wires[i];
        wire.onclick = function() {
            if (this.className.indexOf("cuttedWire") < 0 && this.parentNode.parentNode.childNodes[0].className.indexOf("moduleLightAct") < 0) {
                this.className += " cuttedWire";
                if (this.id == wireToCut) {
                    updateModuleLight(newModule.id);
                } else {
                    playerStrikes++;
                    updateStrikes();
                }
            }
        }
        newWireModule.append(wire)
    }
    newModule.append(newWireModule)
    document.getElementById("bombBase").append(newModule);
    
    var wireVal = [];
    for (var i = 0; i < wireCol.length; i++) {
        wireVal.push(0)
    }
    for (var i = 0; i < wires.length; i++) {
        for (var j = 0; j < wireCol.length; j++) {
            if (wires[i] == wireCol[j]) wireVal[j]++;
        }
    }
    
    var wireToCut = "";
    switch (wiresCount) {
        case 3:
            if (wireVal[0] == 0) wireToCut = "wire2";
            else if (wires[2] == "white") wireToCut = "wire3";
            else if (wireVal[1] > 1) {
                if (wires[2] == "blue") wireToCut = "wire3";
                else if (wires[1] == "blue") wireToCut = "wire2";
                else if (wires[0] == "blue") wireToCut = "wire1";
            } else wireToCut = "wire3";
            break;
        case 4:
            if (wireVal[0] > 1 && serialValue.substr(7, 1) % 2 == 1) {
                if (wires[3] == "red") wireToCut = "wire4";
                else if (wires[2] == "red") wireToCut = "wire3";
                else if (wires[1] == "red") wireToCut = "wire2";
                else if (wires[0] == "red") wireToCut = "wire1";
            }
            else if (wireVal[0] == 0 && wires[3] == "#e2ff00") wireToCut = "wire1";
            else if (wireVal[1] == 1) wireToCut = "wire1";
            else if (wireVal[2] > 1) wireToCut = "wire4";
            else wireToCut = "wire2";
            break;
        case 5:
            if (wire[4] == "black" && serialValue.substr(7, 1) % 2 == 1) wireToCut = "wire4";
            else if (wireVal[0] == 1 && wireVal[2] > 1) wireToCut = "wire1";
            else if (wireVal[4] == 0) wireToCut = "wire2";
            else wireToCut = "wire1";
            break;
        case 6: 
            if (wireVal[2] == 0 && serialValue.substr(7, 1) % 2 == 1) wireToCut = "wire3";
            else if (wireVal[2] == 1 && wireVal[3] > 1) wireToCut = "wire4";
            else if (wireVal[0] == 0) wireToCut = "wire6";
            else wireToCut = "wire4";
            break;
        default: 
            alert("ERROR! CONTACT!");
    }
    return 0;
}