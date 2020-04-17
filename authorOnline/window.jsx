window.onmousemove = function (event) {
    if (document.getElementById("drag")) {
        var drag = document.getElementById("drag");
        drag.style.backgroundColor = "rgb(255, 255, 255)";
        var dragPos = drag.getBoundingClientRect();

        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;

        var allCards = document.getElementsByClassName("card");
        drag.style.zIndex = allCards.length + 2;
        drag.style.top = (dragPos.y - pos2) + "px";
        drag.style.left = (dragPos.x - pos1) + "px";

        var discard = document.getElementById("discard");
        var discardPos = discard.getBoundingClientRect();
        if (dragPos.y < discardPos.y + discardPos.height && dragPos.y + dragPos.height > discardPos.y) {
            if (dragPos.x < discardPos.x + discardPos.width && dragPos.x + dragPos.width > discardPos.x) {
                drag.style.backgroundColor = "pink";
            }
        }

        var allBackCards = document.getElementsByClassName("backCard");
        for (var i = 0; i < allBackCards.length; i++) {
            allBackCards[i].pos = allBackCards[i].getBoundingClientRect();
            if (dragPos.y < allBackCards[i].pos.y + allBackCards[i].pos.height && dragPos.y + dragPos.height > allBackCards[i].pos.y) {
                if (dragPos.x < allBackCards[i].pos.x + allBackCards[i].pos.width && dragPos.x + dragPos.width > allBackCards[i].pos.x) {
                    if (allBackCards[i].category == drag.category) drag.style.backgroundColor = "pink";
                }
            }
        }
    }

    removeOnMouseLeave(event, "getDiscardPile");
    removeOnMouseLeave(event, "getSettings");
}

window.onmouseup = function () {
    if (document.getElementById("drag")) {
        var drag = document.getElementById("drag");
        var dragPos = drag.getBoundingClientRect();
        drag.id = "";

        var allCards = document.getElementsByClassName("card");

        var sortable = [];
        for (var i = 0; i < allCards.length; i++) sortable.push([allCards[i], allCards[i].style.zIndex]);
        sortable.sort(function (a, b) { return a[1] - b[1]; });
        for (var i = 0; i < allCards.length; i++) sortable[i][0].style.zIndex = i;
        drag.style.zIndex = allCards.length;

        var discard = document.getElementById("discard");
        var discardPos = discard.getBoundingClientRect();
        if (dragPos.y < discardPos.y + discardPos.height && dragPos.y + dragPos.height > discardPos.y) {
            if (dragPos.x < discardPos.x + discardPos.width && dragPos.x + dragPos.width > discardPos.x) {
                discardPile.push(drag);
                drag.parentNode.removeChild(drag);
                writeActivity("Move", drag, "to", "discardPile");
            }
        }

        var snapScale = 50;
        for (var i = 0; i < allCards.length; i++) {
            if (allCards[i].numberId != drag.numberId) {
                allCards[i].pos = allCards[i].getBoundingClientRect();
                if (dragPos.y < allCards[i].pos.y + snapScale * 2 && dragPos.y > allCards[i].pos.y - snapScale * 2) {
                    if (dragPos.x < allCards[i].pos.x + snapScale * 2 && dragPos.x > allCards[i].pos.x - snapScale * 2) {
                        drag.style.top = allCards[i].pos.y + 50 + "px";
                        drag.style.left = allCards[i].pos.x + "px";
                        writeActivity("Snap", drag, "to", allCards[i]);
                    }
                }
            }
        }

        var allBackCards = document.getElementsByClassName("backCard");
        for (var i = 0; i < allBackCards.length; i++) {
            allBackCards[i].pos = allBackCards[i].getBoundingClientRect();
            if (dragPos.y < allBackCards[i].pos.y + allBackCards[i].pos.height && dragPos.y + dragPos.height > allBackCards[i].pos.y) {
                if (dragPos.x < allBackCards[i].pos.x + allBackCards[i].pos.width && dragPos.x + dragPos.width > allBackCards[i].pos.x) {
                    if (allBackCards[i].category == drag.category) {
                        cards[drag.expansion][drag.category][drag.numberId] = drag.obj;
                        drag.parentNode.removeChild(drag);
                        writeActivity("Move", drag, "to", "originalDeck");
                    }
                }
            }
        }
    }
}

window.onbeforeunload = function () {
    if (!devMode) {
        if (document.getElementById("cardsInput").innerHTML.length > 0) {
            sendActivity("close");
            return 'Are you sure you want to leave?';
        }
    }
};