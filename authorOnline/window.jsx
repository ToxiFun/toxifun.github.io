window.onmousedown = function (event) {

    //Make marking
    if (!document.getElementById("mark") && !document.getElementById("drag") && letMark) {
        var mark = document.createElement("div");
        mark.id = "mark";
        mark.posX = event.clientX;
        mark.posY = event.clientY;
        mark.style.left = mark.posX;
        mark.style.top = mark.posY;

        document.body.append(mark);
    }

    //Remove marking
    if (0 < document.getElementsByClassName("marking").length) {
        var removeMark = true;
        if (document.getElementById("drag")) if (document.getElementById("drag").classList.contains("marking")) removeMark = false;
        if (removeMark) {

            //Remove marked back to cardsInput
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

            //Refresh all cards
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
    if (window.getSelection) { window.getSelection().removeAllRanges(); }
    else if (document.selection) { document.selection.empty(); }

    //Marking
    if (document.getElementById("mark")) {
        var mark = document.getElementById("mark");
        var markSizeX = event.clientX - mark.posX;
        var markSizeY = event.clientY - mark.posY;

        //X-position and width
        if (markSizeX < 0) mark.style.left = event.clientX;
        else mark.style.left = mark.posX;
        mark.style.width = Math.abs(markSizeX);

        //Y-position and height
        if (markSizeY < 0) mark.style.top = event.clientY;
        else mark.style.top = mark.posY;
        mark.style.height = Math.abs(markSizeY);

        //Change border
        var allCards = document.getElementsByClassName("cardLink");
        for (var i = 0; i < allCards.length; i++) {
            if (checkOverLap(mark, allCards[i])) {
                allCards[i].childNodes[0].style.border = "1px solid lightblue";
            } else {
                allCards[i].childNodes[0].style.border = "1px solid grey";
            }
        }
    }

    //Dragging
    if (document.getElementById("drag")) {
        var drag = document.getElementById("drag");
        var dragPos = drag.getBoundingClientRect();

        //Change position
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
        drag.style.top = (dragPos.y - pos2) + window.scrollY + "px";
        drag.style.left = (dragPos.x - pos1) + window.scrollX + "px";

        //If dragging card
        if (!drag.classList.contains("marking")) {
            var dragChild = drag.childNodes[0];
            dragChild.style.backgroundColor = "rgb(255, 255, 255)";

            //Update z-index
            var allCards = document.getElementsByClassName("card");
            drag.style.zIndex = allCards.length + 2;

            //Move over discard pile
            var discard = document.getElementById("discard");
            if (checkOverLap(drag, discard)) getLinkChild(drag, "hover");

            //Move over original pile
            var allBackCards = document.getElementsByClassName("backCard");
            for (var i = 0; i < allBackCards.length; i++) if (checkOverLap(dragChild, allBackCards[i])) getLinkChild(drag, "hover");

        } else if (drag.classList.contains("marking")) {

            //Get all marked
            var discard = document.getElementById("discard");
            var marked = document.getElementsByClassName("marked");
            for (var i = 0; i < marked.length; i++) {
                var dragChild = marked[i].childNodes[0];

                //Change marked backgroundcolor
                dragChild.style.backgroundColor = "rgb(255, 255, 255)";

                //Move marking over discard pile
                if (checkOverLap(drag, discard)) dragChild.style.backgroundColor = "pink";
            }

            //Move marking over original pile
            var allBackCards = document.getElementsByClassName("backCard");
            for (var i = 0; i < allBackCards.length; i++) if (checkOverLap(drag, allBackCards[i])) getLinkChild(drag, "hover");
        }
    }

    removeOnMouseLeave(event, "getDiscardPile");
    removeOnMouseLeave(event, "getSettings");
}

window.onmouseup = function () {

    //Mark elements
    if (document.getElementById("mark")) {
        var mark = document.getElementById("mark");

        //Get marked elements
        var allCards = document.getElementsByClassName("cardLink");
        for (var i = 0; i < allCards.length; i++) if (checkOverLap(mark, allCards[i])) allCards[i].classList.add("marked");

        //Update marking
        if (0 < document.getElementsByClassName("marked").length) {
            var marking = document.createElement("div");
            marking.classList.add("marking");
            marking.onmousedown = function (event) {
                interactCounting("marking");
                if (!document.getElementById("drag")) {
                    this.id = "drag";
                    pos3 = event.clientX;
                    pos4 = event.clientY;
                    writeActivity("Move", "marking");
                }
            }

            //Updating marked with marking
            var marked = document.getElementsByClassName("marked");
            var markedList = { x: [], y: [] };
            for (var i = marked.length - 1; 0 <= i; i--) {
                marked[i].pos = marked[i].getBoundingClientRect();
                markedList.x.push(marked[i].pos.x);
                markedList.y.push(marked[i].pos.y);
                marked[i].style.left = "0px";
                marked[i].style.top = "0px";

                marking.append(marked[i]);
            }

            //Get dimensions to marking
            var marked = marking.childNodes;
            marking.style.left = Math.min(...markedList.x) + "px";
            marking.style.top = Math.min(...markedList.y) + "px";
            marking.style.width = (Math.max(...markedList.x) - Math.min(...markedList.x)) + marked[0].pos.width + "px";
            marking.style.height = (Math.max(...markedList.y) - Math.min(...markedList.y)) + marked[0].pos.height + "px";

            //Update position for marked
            for (var i = 0; i < marked.length; i++) {
                marked[i].style.left = marked[i].pos.x - Math.min(...markedList.x) + "px";
                marked[i].style.top = marked[i].pos.y - Math.min(...markedList.y) + "px";
                marked[i].style.zIndex = document.getElementsByClassName("cardLink").length * 2 + marked.length - i + 1;
            }
            document.getElementById("cardsInput").append(marking);
        }
        mark.parentNode.removeChild(mark);
    }

    //Dragging
    if (document.getElementById("drag")) {
        var drag = document.getElementById("drag");
        var dragPos = drag.getBoundingClientRect();
        drag.id = "";
        var dragChild = drag.childNodes[0];

        //Sort in z-index order
        var allCards = document.getElementsByClassName("cardLink");
        var sortable = [];
        for (var i = 0; i < allCards.length; i++) sortable.push([allCards[i], allCards[i].style.zIndex]);
        sortable.sort(function (a, b) { return a[1] - b[1]; });
        for (var i = 0; i < allCards.length; i++) sortable[i][0].style.zIndex = i;
        drag.style.zIndex = allCards.length;

        //Updating cards
        if (drag.classList.contains("cardLink")) {

            //Check over discard pile
            var discard = document.getElementById("discard");
            if (checkOverLap(dragChild, discard)) getLinkChild(drag, "putDiscard");

            //Link to other cards
            var childElementList = [];
            getLinkChild(drag, "makeList", childElementList);
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
            for (var i = 0; i < allBackCards.length; i++) if (checkOverLap(dragChild, allBackCards[i])) getLinkChild(drag, "putBack");

        //Update marking
        } else if (drag.classList.contains("marking")) {

            //Check over discard pile
            var discard = document.getElementById("discard");
            if (checkOverLap(drag, discard)) {
                var allMarked = document.getElementsByClassName("marked");
                for (var i = allMarked.length - 1; 0 <= i; i--) getLinkChild(allMarked[i], "putDiscard");
                document.getElementsByClassName("marking")[0].remove();
            }

            //Check if over original card
            var allBackCards = document.getElementsByClassName("backCard");
            for (var i = 0; i < allBackCards.length; i++) {
                if (checkOverLap(dragChild, allBackCards[i])) {
                    var allMarked = document.getElementsByClassName("marked");
                    for (var i = allMarked.length - 1; 0 <= i; i--) getLinkChild(allMarked[i], "putBack");
                    document.getElementsByClassName("marking")[0].remove();
                }
            }
        }
    }
    letMark = true;
}

//Check if page is refreshing or closing
window.onbeforeunload = function () {
    if (!devMode) {
        if (document.getElementById("cardsInput").innerHTML.length > 0) {
            sendActivity("close");
            return 'Are you sure you want to leave?';
        }
    }
};