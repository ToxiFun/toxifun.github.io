window.onmousedown = function (event) {
    if (!document.getElementById("mark") && !document.getElementById("drag") && letMark) {
        var mark = document.createElement("div");
        mark.id = "mark";
        mark.posX = event.clientX;
        mark.posY = event.clientY;
        mark.style.left = mark.posX;
        mark.style.top = mark.posY;

        document.body.append(mark);
    }

    if (0 < document.getElementsByClassName("marking").length) {
        var removeMark = true;
        if (document.getElementById("drag")) {
            if (document.getElementById("drag").classList.contains("marking")) removeMark = false;
        }
        if (removeMark) {
            var marked = document.getElementsByClassName("marked");
            for (var i = marked.length - 1; 0 <= i; i--) {
                var markedPos = marked[i].getBoundingClientRect();
                marked[i].oldX = markedPos.x;
                marked[i].oldY = markedPos.y;
                document.getElementById("cardsInput").append(marked[i]);
                marked[i].style.left = marked[i].oldX;
                marked[i].style.top = marked[i].oldY;
                marked[i].childNodes[0].style.border = "1px solid grey";
                marked[i].classList.remove("marked");
            }

            var allCards = document.getElementsByClassName("cardLink");
            for (var i = allCards.length - 1; 0 <= i; i--) {
                allCards[i].childNodes[0].style.border = "1px solid grey";
                if (allCards[i].classList.contains("linkChild")) {
                    allCards[i].style.top = "50px";
                    allCards[i].style.left = "0px";
                    allCards[i - 1].append(allCards[i]);
                }
            }

            document.getElementsByClassName("marking")[0].remove();
        }
    }
}

window.onmousemove = function (event) {
    if (document.getElementById("mark")) {
        var mark = document.getElementById("mark");
        var markSizeX = event.clientX - mark.posX;
        var markSizeY = event.clientY - mark.posY;

        if (markSizeX < 0) mark.style.left = event.clientX;
        else mark.style.left = mark.posX;
        mark.style.width = Math.abs(markSizeX);

        if (markSizeY < 0) mark.style.top = event.clientY;
        else mark.style.top = mark.posY;
        mark.style.height = Math.abs(markSizeY);

        var allCards = document.getElementsByClassName("cardLink");
        for (var i = 0; i < allCards.length; i++) {
            if (checkOverLap(mark, allCards[i])) {
                allCards[i].childNodes[0].style.border = "1px solid lightblue";
            } else {
                allCards[i].childNodes[0].style.border = "1px solid grey";
            }
        }
    }

    if (document.getElementById("drag")) {
        var drag = document.getElementById("drag");
        var dragPos = drag.getBoundingClientRect();

        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;

        drag.style.top = (dragPos.y - pos2) + "px";
        drag.style.left = (dragPos.x - pos1) + "px";

        if (!drag.classList.contains("marking")) {
            var dragChild = drag.childNodes[0];
            dragChild.style.backgroundColor = "rgb(255, 255, 255)";

            var allCards = document.getElementsByClassName("card");
            drag.style.zIndex = allCards.length + 2;


            //Move over discard pile
            var discard = document.getElementById("discard");
            if (checkOverLap(drag, discard)) {
                getLinkChild(drag, "hover");
            }

            //Move over original pile
            var allBackCards = document.getElementsByClassName("backCard");
            for (var i = 0; i < allBackCards.length; i++) {
                if (allBackCards[i].category == dragChild.category) {
                    if (checkOverLap(dragChild, allBackCards[i])) {
                        getLinkChild(drag, "hover");
                    }
                }
            }

        } else {
            var marked = document.getElementsByClassName("marked");
            for (var i = 0; i < marked.length; i++) {
                var dragChild = marked[i].childNodes[0];
                dragChild.style.backgroundColor = "rgb(255, 255, 255)";
            }

            //Move over discard pile
            var discard = document.getElementById("discard");
            if (checkOverLap(drag, discard)) {
                for (var i = 0; i < marked.length; i++) {
                    var dragChild = marked[i].childNodes[0];
                    dragChild.style.backgroundColor = "pink";
                }
            }

            //Move over original pile
            var allBackCards = document.getElementsByClassName("backCard");
            for (var i = 0; i < allBackCards.length; i++) {
                if (checkOverLap(dragChild, allBackCards[i])) {
                    getLinkChild(drag, "hover");
                }
            }
        }
    }

    removeOnMouseLeave(event, "getDiscardPile");
    removeOnMouseLeave(event, "getSettings");
}

window.onmouseup = function () {
    if (document.getElementById("mark")) {
        var mark = document.getElementById("mark");

        var allCards = document.getElementsByClassName("cardLink");
        for (var i = 0; i < allCards.length; i++) {
            if (checkOverLap(mark, allCards[i])) {
                allCards[i].classList.add("marked");
            }
        }
        if (0 < document.getElementsByClassName("marked").length) {
            var marking = document.createElement("div");
            marking.classList.add("marking");
            marking.style.backgroundColor = "lightblue";
            marking.style.background = "rgba(144, 202, 249, 0.4)";
            marking.style.borderRadius = "15px";
            marking.style.position = "absolute";
            marking.onmousedown = function (event) {
                interactCounting("marking");
                if (!document.getElementById("drag")) {
                    this.id = "drag";
                    pos3 = event.clientX;
                    pos4 = event.clientY;

                    writeActivity("Move", "marking");
                }
            }

            var marked = document.getElementsByClassName("marked");
            var markedXList = [];
            var markedYList = [];
            var markedWidth;
            var markedHeight;
            for (var i = marked.length - 1; 0 <= i; i--) {
                markedPos = marked[i].getBoundingClientRect();
                markedXList.push(markedPos.x);
                markedYList.push(markedPos.y);
                marked[i].style.left = "0px";
                marked[i].style.top = "0px";
                marked[i].oldX = markedPos.x;
                marked[i].oldY = markedPos.y;
                markedWidth = markedPos.width;
                markedHeight = markedPos.height;
                marking.append(marked[i]);
            }

            var marked = marking.childNodes;
            marking.style.left = Math.min(...markedXList) + "px";
            marking.style.top = Math.min(...markedYList) + "px";
            marking.style.width = (Math.max(...markedXList) - Math.min(...markedXList)) + markedWidth + "px";
            marking.style.height = (Math.max(...markedYList) - Math.min(...markedYList)) + markedHeight + "px";

            for (var i = 0; i < marked.length; i++) {
                markedPos = marked[i].getBoundingClientRect();
                marked[i].style.left = marked[i].oldX - Math.min(...markedXList) + "px";
                marked[i].style.top = marked[i].oldY - Math.min(...markedYList) + "px";
            }
            document.getElementById("cardsInput").append(marking);

        }

        mark.parentNode.removeChild(mark);
    }

    if (document.getElementById("drag")) {
        var drag = document.getElementById("drag");
        var dragPos = drag.getBoundingClientRect();
        drag.id = "";

        var dragChild = drag.childNodes[0];

        var allCards = document.getElementsByClassName("cardLink");

        if (drag.classList.contains("cardLink")) {
            //Sort in z-index order
            var sortable = [];
            for (var i = 0; i < allCards.length; i++) sortable.push([allCards[i], allCards[i].style.zIndex]);
            sortable.sort(function (a, b) { return a[1] - b[1]; });
            for (var i = 0; i < allCards.length; i++) sortable[i][0].style.zIndex = i;
            drag.style.zIndex = allCards.length;

            //Check over discard pile
            var discard = document.getElementById("discard");
            if (checkOverLap(dragChild, discard)) {
                getLinkChild(drag, "putDiscard");
            }

            var childElementList = [];
            getLinkChild(drag, "makeList", childElementList);

            //Link to other cards
            if (drag.classList.contains("cardLink")) {
                var snapScale = 50;
                for (var i = 0; i < allCards.length; i++) {
                    if (childElementList.indexOf(allCards[i].childNodes[0].numberId) < 0) {
                        allCards[i].pos = allCards[i].getBoundingClientRect();
                        if (dragPos.y < allCards[i].pos.y + snapScale * 2 && dragPos.y > allCards[i].pos.y - snapScale * 2) {
                            if (dragPos.x < allCards[i].pos.x + snapScale * 2 && dragPos.x > allCards[i].pos.x - snapScale * 2) {
                                drag.style.top = "0px";
                                drag.style.left = "0px";
                                appendToLastChild(allCards[i], drag);

                                writeActivity("Snap", dragChild, "to", allCards[i]);
                            }
                        }
                    }
                }
            }

            //Check if over original card
            var allBackCards = document.getElementsByClassName("backCard");
            for (var i = 0; i < allBackCards.length; i++) {
                if (checkOverLap(dragChild, allBackCards[i])) {
                    getLinkChild(drag, "putBack");
                }
            }

        } else if (drag.classList.contains("marking")) {

            //Check over discard pile
            var discard = document.getElementById("discard");
            if (checkOverLap(drag, discard)) {
                var allMarked = document.getElementsByClassName("marked");
                for (var i = allMarked.length - 1; 0 <= i; i--) {
                    getLinkChild(allMarked[i], "putDiscard");
                }
                document.getElementsByClassName("marking")[0].remove();
            }

            //Check if over original card
            var allBackCards = document.getElementsByClassName("backCard");
            for (var i = 0; i < allBackCards.length; i++) {
                if (checkOverLap(dragChild, allBackCards[i])) {
                    var allMarked = document.getElementsByClassName("marked");
                    for (var i = allMarked.length - 1; 0 <= i; i--) {
                        getLinkChild(allMarked[i], "putBack");
                    }
                    document.getElementsByClassName("marking")[0].remove();
                }
            }

        }
    }
    letMark = true;
}

window.onbeforeunload = function () {
    if (!devMode) {
        if (document.getElementById("cardsInput").innerHTML.length > 0) {
            sendActivity("close");
            return 'Are you sure you want to leave?';
        }
    }
};