function makeFront(card, status, drawPos, expan, cat, linkChild) {
    var cardLink = document.createElement("div");
    cardLink.classList.add("cardLink");
    var newCard = document.createElement("div");

    if (status == "origianlDeck") {
        if (Object.keys(cards[expan][cat]).length <= 5) return alert("No more " + cat + " cards.");
        if (cards[expan][cat][card][language] == "_____________")
            return makeFront(Math.floor(Math.random() * cards[expan][cat].length), status, drawPos, expan, cat);
        newCard.element = cards[expan][cat][card][language];
        newCard.numberId = card;
        newCard.image = "../Pictures/" + cat + "/" + card + ".png";
        newCard.color = categoryColor[cat];
        newCard.category = commands[cat][language];
        newCard.expansion = commands[expan][language];
        newCard.obj = cards[expan][cat][card];
    } else if (status == "discardPile" || status == "load") {
        newCard.element = card.element;
        newCard.numberId = card.numberId;
        newCard.image = card.image;
        newCard.color = card.color;
        newCard.category = card.category;
        newCard.expansion = card.expansion;
        newCard.obj = card.obj;
    }

    var color = document.createElement("canvas");
    var ctx = color.getContext("2d");
    ctx.fillStyle = newCard.color;
    ctx.fillRect(0, 0, 300, 200);
    color.className = "color";
    newCard.append(color);

    var element = document.createElement("p")
    element.className = "element";
    element.append(document.createTextNode(newCard.element));
    newCard.append(element);

    var numberId = document.createElement("p");
    numberId.append(document.createTextNode(newCard.numberId));
    numberId.className = "numberId";
    newCard.append(numberId);

    var line = document.createElement("canvas");
    var ctx = line.getContext("2d");
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, 0, 300, 100);
    line.className = "line";
    newCard.append(line);

    var text = document.createElement("p")
    text.append(document.createTextNode(newCard.category))
    text.className = "category";
    newCard.append(text);

    var sideElement = document.createElement("p")
    sideElement.className = "sideElement";
    sideElement.append(document.createTextNode(newCard.element));
    newCard.append(sideElement);

    var image = document.createElement("img");
    image.className = "image";
    image.ondragstart = function () { return false; };
    newCard.append(image);

    var expansion = document.createElement("p")
    expansion.className = "expansion";
    expansion.append(document.createTextNode(newCard.expansion))
    newCard.append(expansion);

    var sideColor = document.createElement("canvas");
    var ctx = sideColor.getContext("2d");
    ctx.fillStyle = newCard.color;
    ctx.fillRect(0, 0, 300, 200);
    sideColor.className = "sideColorFront";
    newCard.append(sideColor);

    if (status == "origianlDeck") {
        if (cards[expan][cat][card][language] == "_____________") {
            element.style.fontWeight = "100";
            element.style.color = "grey";
        }
        if (cards[expan][cat][card][language] != "_____________") image.src = "../Pictures/" + cat + "/" + card + ".png";
    }

    var dragable = true;
    cardLink.onmousedown = function (event) {
        if (this.id == "" && !document.getElementById("drag")) {
            dragable = true;
            if (document.getElementsByClassName("marking").length > 0) {
                if (0 <= Array.prototype.indexOf.call(document.getElementsByClassName("marking")[0].children, this)) dragable = false;
            }
            if (dragable) {
                interactCounting(this.childNodes[0].numberId);
                this.id = "drag";
                pos3 = event.clientX;
                pos4 = event.clientY;
                if (this.classList.contains("linkChild")) {
                    var thisPos = this.getBoundingClientRect();
                    this.style.top = thisPos.y + "px";
                    this.style.left = thisPos.x + "px";
                    this.classList.remove("linkChild");
                }
                document.getElementById("cardsInput").append(this);

                writeActivity("Pick", newCard);
            }
        }
    }

    newCard.className = "card";
    newCard.style.backgroundColor = "rgb(255, 255, 255)";
    cardLink.append(newCard);
    if (linkChild) cardLink.className = "linkChild";
    document.getElementById("cardsInput").append(cardLink);

    if (status == "origianlDeck" || status == "discardPile") {
        if (status == "origianlDeck")
            delete cards[expan][cat][card];

        pos3 = event.clientX;
        pos4 = event.clientY;
        cardLink.id = "drag";
    }
    cardLink.classList.add("pick");
    cardLink.classList.add("cardLink");
    cardLink.style.position = "absolute";
    cardLink.style.top = drawPos[0];
    cardLink.style.left = drawPos[1];

    writeActivity("Get", newCard, "from", status);
}

function makeBack(expan, cat) {
    var newBackCard = document.createElement("div");
    //newBackCard.style.float = "right";

    var color = document.createElement("canvas");
    var ctx = color.getContext("2d");
    ctx.fillStyle = categoryColor[cat];
    ctx.fillRect(0, 0, 300, 200);
    color.className = "color";
    newBackCard.append(color);
    newBackCard.color = categoryColor[cat];

    var text = document.createElement("p")
    text.append(document.createTextNode(commands[cat][language]))
    text.className = "backCategory";
    newBackCard.append(text);
    newBackCard.category = commands[cat][language];

    var title = document.createElement("p")
    title.append(document.createTextNode("AUTHOR"))
    title.className = "title";
    newBackCard.append(title);
    newBackCard.title = "AUTHOR";

    var sideColor = document.createElement("canvas");
    var ctx = sideColor.getContext("2d");
    ctx.fillStyle = categoryColor[cat];
    ctx.fillRect(0, 0, 300, 200);
    sideColor.className = "sideColorBack";
    newBackCard.append(sideColor);

    newBackCard.className = "backCard";
    newBackCard.id = cat;
    document.getElementById("backInput").append(newBackCard);

    newBackCard.onmousedown = function () {
        interactCounting(this.id);
        var cardIDs = Object.keys(cards[expan][cat]);
        var randomID = cardIDs[Math.floor(Math.random() * (cardIDs.length - 5))];
        var drawPos = newBackCard.getBoundingClientRect();
        makeFront(randomID, "origianlDeck", [drawPos.y, drawPos.x], expan, cat);
    }
}