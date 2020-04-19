function roleDice(first) {
    letMark = false;
    var dice = document.getElementById("dice");

    if (dice.innerHTML == "") {
        dice.getBoundingClientRect();
        var diceXL = dice.getBoundingClientRect().width;
        var diceYL = dice.getBoundingClientRect().height;

        var dicePos = [
            [diceXL / 4, diceYL / 4],
            [diceXL / 4, diceYL / 2],
            [diceXL / 4, diceYL / 4 * 3],
            [diceXL / 2, diceYL / 2],
            [diceXL / 4 * 3, diceYL / 4],
            [diceXL / 4 * 3, diceYL / 2],
            [diceXL / 4 * 3, diceYL / 4 * 3]
        ]

        for (var i = 0; i < dicePos.length; i++) {
            var dotSize = diceYL / (100/15);
            var dot = document.createElement("div");
            dot.style.width = dotSize + "px";
            dot.style.height = dotSize + "px";
            dot.style.marginLeft = dicePos[i][0] - dotSize / 2 + "px";
            dot.style.marginTop = dicePos[i][1] - dotSize / 2 + "px";
            dot.className = "dot";
            dot.style.display = "none";
            dice.append(dot);
        }
    }

    var dots = document.getElementsByClassName("dot");
    for (var i = 0; i < dots.length; i++) {
        dots[i].style.display = "none";
    }

    var diceVal = [
        [3],
        [0, 6],
        [2, 3, 4],
        [0, 2, 4, 6],
        [0, 2, 3, 4, 6],
        [0, 1, 2, 4, 5, 6],
    ]

    var getDice = Math.floor(Math.random() * diceVal.length);
    var dots = document.getElementsByClassName("dot");
    for (var i = 0; i < diceVal[getDice].length; i++) {
        dots[diceVal[getDice][i]].style.display = "block";
    }
    if (Math.random() < 0.95 && !first) return setTimeout(function () { roleDice(); }, 100);

    if (!first) {
        writeActivity("Dice role:", (getDice + 1));
        interactCounting("dice");
    }
}

function openSettings(Event) {
    letMark = false;
    interactCounting("settings");
    if (!document.getElementById("getSettings")) {
        var getSettings = document.createElement("div");
        getSettings.id = "getSettings";

        //New game button
        var newGame = document.createElement("div");
        newGame.append(document.createTextNode(commands["New_game"][language]));
        newGame.id = "New_game";
        newGame.onmousedown = function () {
            letMark = false;
            interactCounting(this.id);
            if (document.getElementById("cardsInput").innerHTML.length > 0) {
                if (!confirm("Are you sure? All unsaved data will be lost.")) {
                    writeActivity("Abort", "newGame");
                    return;
                }
            }
            writeActivity("New", "game");
            sendActivity("newGame");
            newActivity();

            document.getElementById("cardsInput").innerHTML = "";
            discardPile = [];
            cards = JSON.parse(JSON.stringify(JSONcards));
        }
        newGame.className = "setting";
        getSettings.append(newGame);

        //Save game button
        var saveGame = document.createElement("div");
        saveGame.append(document.createTextNode(commands["Save_game"][language]));
        saveGame.className = "setting";
        saveGame.id = "Save_game";
        saveGame.onmousedown = function () {
            letMark = false;
            interactCounting(this.id);
            var eachPick = document.getElementsByClassName("pick");
            var pickHolder = [];
            for (var each in eachPick) {
                if (typeof eachPick[each] == "object") {
                    var newPick = {};
                    var eachPickPos = eachPick[each].childNodes[0].getBoundingClientRect();
                    newPick.posX = eachPickPos.x;
                    newPick.posY = eachPickPos.y;

                    var keys = Object.keys(eachPick[each].childNodes[0]);
                    for (var key in keys)
                        newPick[keys[key]] = eachPick[each].childNodes[0][keys[key]];
                    newPick.classList = eachPick[each].classList

                    pickHolder.push(newPick);
                }
            }
            var saveCont = {
                "discardPileSave": discardPile,
                "pickCardsSave": pickHolder,
                "cardsSave": cards,
                "activitySave": activity
            };

            const a = document.createElement("a");
            const file = new Blob([JSON.stringify(saveCont)], { type: "text/plain" });
            a.href = URL.createObjectURL(file);
            a.download = "saveTest";
            a.click();
            writeActivity("Save", "game");
        }
        getSettings.append(saveGame);

        //Load game button
        var loadGame = document.createElement("input");
        loadGame.append(document.createTextNode(commands["Load_game"][language]));
        loadGame.type = "file";
        loadGame.id = "Load_game";
        loadGame.onmousedown = function () {
            letMark = false;
            interactCounting(this.id);
            if (document.getElementById("cardsInput").innerHTML.length > 0) {
                var abort = confirm("Are you sure? All unsaved data will be lost.");
                if (!abort) {
                    writeActivity("Abort", "loadGame");
                    return abort;
                }
            }
            writeActivity("Load", "game");
            sendActivity("loadGame");

            this.addEventListener('change', function selectedFileChanged() {
                var reader = new FileReader();
                reader.onload = function fileReadCompleted() {
                    document.getElementById("cardsInput").innerHTML = "";
                    var readerResult = JSON.parse(reader.result);
                    cards = readerResult.cardsSave;
                    discardPile = readerResult.discardPileSave;
                    activity = readerResult.activitySave;
                    for (var each in readerResult.pickCardsSave) {
                        var thisCard = readerResult.pickCardsSave[each];

                        var linkChild = false;
                        for (var key in thisCard.classList) {
                            if (thisCard.classList[key] == "linkChild") linkChild = true;
                        }

                        makeFront(
                            thisCard,
                            "load",
                            [thisCard.posY, thisCard.posX],
                            thisCard.expansion,
                            thisCard.category,
                            linkChild
                        );
                    }
                    var allCards = document.getElementsByClassName("cardLink");
                    for (var i = allCards.length - 1; 0 <= i; i--) {
                        if (allCards[i].classList.contains("linkChild")) {
                            allCards[i].style.top = "50px";
                            allCards[i].style.left = "0px";
                            allCards[i - 1].append(allCards[i]);
                        }
                    }
                };
                reader.readAsText(this.files[0]);
            });
        }
        loadGame.className = "setting";
        getSettings.append(loadGame);

        var pickLanguage = document.createElement("div");
        pickLanguage.append(document.createTextNode(commands["Language"][language]));
        pickLanguage.onmousedown = function () {
            letMark = false;
            interactCounting(this.id);
            if (document.getElementById("languages")) {
                document.getElementById("languages").parentNode.removeChild(document.getElementById("languages"));
                writeActivity("Close", "pickLanguage");
            } else {
                var languages = document.createElement("div");
                languages.id = "languages";
                for (var lang in commands["Language"]) {
                    var newLang = document.createElement("div");
                    newLang.append(document.createTextNode(lang));
                    newLang.className = "setting";
                    newLang.id = lang;
                    if (lang == language) newLang.classList.add("pickedLang");
                    newLang.onmousedown = function () {
                        letMark = false;
                        interactCounting(this.id);
                        language = this.id;

                        var pickedLang = document.getElementsByClassName("pickedLang");
                        pickedLang[pickedLang.length - 1].classList.remove("pickedLang");
                        this.classList.add("pickedLang");

                        var all = document.getElementsByTagName("*");

                        for (var i = 0, max = all.length; i < max; i++) {
                            if (all[i].childElementCount == 0) {
                                for (var each in commands) {
                                    for (var lang in commands[each]) {
                                        if (commands[each][lang] == all[i].innerHTML) {
                                            all[i].innerHTML = commands[each][language];
                                        }
                                    }
                                }
                            }
                        }

                        for (var i = 0, max = all.length; i < max; i++) {
                            if (all[i].childElementCount == 0) {
                                for (var expan in JSONcards) {
                                    for (var cat in JSONcards[expan]) {
                                        for (var card in JSONcards[expan][cat]) {
                                            for (var lang in JSONcards[expan][cat][card]) {
                                                if (JSONcards[expan][cat][card][lang] == all[i].innerHTML) {
                                                    all[i].innerHTML = JSONcards[expan][cat][card][language];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        writeActivity("Change", "language", "to", this.id);
                    }
                    languages.append(newLang);
                }
                getSettings.append(languages);
                writeActivity("Open", "pickLanguage");
            }
        }
        pickLanguage.className = "setting";
        getSettings.append(pickLanguage);

        getSettings.style.left = event.clientX;
        getSettings.style.top = event.clientY;

        document.body.append(getSettings)
        writeActivity("Open", "settings");
    }
}

function getDiscard(event) {
    letMark = false;
    if (!document.getElementById("getDiscardPile")) {
        var getDiscardPile = document.createElement("div");
        getDiscardPile.id = "getDiscardPile";

        if (discardPile.length <= 0) {
            var discardedCard = document.createElement("div");
            var element = document.createElement("p");
            element.className = "element";
            element.append(document.createTextNode(commands["Empty"][language]));
            element.style.marginLeft = "20px";
            element.style.marginTop = "10px";
            discardedCard.append(element);

            discardedCard.className = "discardedCard";
            getDiscardPile.append(discardedCard);
        } else {
            for (var i = 0; i < discardPile.length; i++) {
                var discardedCard = document.createElement("div");

                var color = document.createElement("canvas");
                var ctx = color.getContext("2d");
                ctx.fillStyle = discardPile[i].color;
                ctx.fillRect(0, 0, 300, 200);
                color.className = "color";
                color.style.marginLeft = "0px";
                discardedCard.append(color);

                var element = document.createElement("p");
                element.className = "element";
                element.append(document.createTextNode(discardPile[i].element));
                element.style.marginLeft = "20px";
                discardedCard.append(element);
                
                discardedCard.onmousedown = (function (i) { return function () {
                    makeFront(discardPile[i], 'discardPile', [event.clientY, event.clientX]);
                    discardPile.splice(i, 1);
                    discardedCard.parentNode.removeChild(discardedCard);
                }; })(i);

                discardedCard.className = "discardedCard";
                getDiscardPile.append(discardedCard);
            }
        }

        getDiscardPile.style.left = event.clientX;
        getDiscardPile.style.top = event.clientY;

        document.body.append(getDiscardPile)
        writeActivity("Open", "discardPile");
    }
}