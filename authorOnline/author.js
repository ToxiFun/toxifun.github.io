var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

function makeFront(expan, cat, card, status, drawPos) {
    if (cards[expan][cat].length <= 5) return alert("No more " + cat + " cards.");
    if (cards[expan][cat][card] == "_____________") return makeFront(expan, cat, Math.floor(Math.random() * cards[expan][cat].length), 'pick');
    var newCard = document.createElement("div");

    var color = document.createElement("canvas");
    var ctx = color.getContext("2d");
    ctx.fillStyle = categoryColor[cat];
    ctx.fillRect(0, 0, 300, 200);
    color.className = "color";
    newCard.append(color);

    var element = document.createElement("p")
    element.className = "element";
    if (cards[expan][cat][card] == "_____________") {
        element.style.fontWeight = "100";
        element.style.color = "grey";
    }
    element.append(document.createTextNode(cards[expan][cat][card]));
    newCard.append(element);

    var numberId = document.createElement("p");
    numberId.append(document.createTextNode(expan.substring(0, 1) + cat.substring(0, 1) + (card + 1)));
    numberId.className = "numberId";
    newCard.append(numberId);

    var line = document.createElement("canvas");
    var ctx = line.getContext("2d");
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, 0, 300, 100);
    line.className = "line";
    newCard.append(line);

    var text = document.createElement("p")
    text.append(document.createTextNode(cat))
    text.className = "category";
    newCard.append(text);

    var sideElement = document.createElement("p")
    sideElement.className = "sideElement";
    sideElement.append(document.createTextNode(cards[expan][cat][card]))
    newCard.append(sideElement);

    var image = document.createElement("img");
    image.className = "image";
    image.ondragstart = function () { return false; };
    if (cards[expan][cat][card] != "_____________") image.src = "../Pictures/" + cat + "/" + cards[expan][cat][card] + ".png";
    newCard.append(image);

    var expansion = document.createElement("p")
    expansion.className = "expansion";
    expansion.append(document.createTextNode(expan))
    newCard.append(expansion);

    var sideColor = document.createElement("canvas");
    var ctx = sideColor.getContext("2d");
    ctx.fillStyle = categoryColor[cat];
    ctx.fillRect(0, 0, 300, 200);
    sideColor.className = "sideColorFront";

    newCard.onmousedown = function (event) {
        if (this.id == "" && !document.getElementById("drag")) {
            this.id = "drag";
            pos3 = event.clientX;
            pos4 = event.clientY;
        }
    }

    newCard.append(sideColor);

    newCard.className = "card";
    document.getElementById("frontInput").append(newCard)

    if (status == 'pick') {
        cards[expan][cat].splice(cards[expan][cat][card], 1);
        newCard.classList.add("pick");
        newCard.style.position = "absolute";
        newCard.style.top = drawPos[0];
        newCard.style.left = drawPos[1];
        pos3 = event.clientX;
        pos4 = event.clientY;
        newCard.id = "drag";
    }
}

window.onmousemove = function (event) {
    if (document.getElementById("drag")) {
        var drag = document.getElementById("drag");

        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;

        drag.style.position = "absolute";
        drag.style.zIndex = "10";
        drag.style.top = (drag.offsetTop - pos2) + "px";
        drag.style.left = (drag.offsetLeft - pos1) + "px";
    }
}

window.onmouseup = function () {
    if (document.getElementById("drag")) document.getElementById("drag").id = "";
}

function makeBack(expan, cat) {
    var newBackCard = document.createElement("div");
    newBackCard.style.float = "right";

    var color = document.createElement("canvas");
    var ctx = color.getContext("2d");
    ctx.fillStyle = categoryColor[cat];
    ctx.fillRect(0, 0, 300, 200);
    color.className = "color";
    newBackCard.append(color);

    var text = document.createElement("p")
    text.append(document.createTextNode(cat))
    text.className = "backCategory";
    newBackCard.append(text);

    var title = document.createElement("p")
    title.append(document.createTextNode("AUTHOR"))
    title.className = "title";
    newBackCard.append(title);

    var sideColor = document.createElement("canvas");
    var ctx = sideColor.getContext("2d");
    ctx.fillStyle = categoryColor[cat];
    ctx.fillRect(0, 0, 300, 200);
    sideColor.className = "sideColorBack";
    newBackCard.append(sideColor);

    newBackCard.className = "card";
    document.getElementById("backInput").append(newBackCard);

    newBackCard.onmousedown = function () {
        var randomCard = Math.floor(Math.random() * cards[expan][cat].length);
        var drawPos = [newBackCard.offsetTop, newBackCard.offsetLeft];
        console.log(newBackCard.offsetTop, newBackCard.offsetLeft)
        makeFront(expan, cat, randomCard, 'pick', drawPos);
    }
}