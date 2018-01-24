var store = document.querySelector(".store");
var enableCards = [];
var selects = document.querySelector(".selects")
store.addEventListener("click", function (event) {

    let events = event.target;
    let enable = events.hasAttribute("enable");

    if (events.className != "deck") return;
    if (!enable) {
        if (enableCards.length >= 2) return;
        events.setAttribute("enable", true);
        let computedStyle = getComputedStyle(events);
        let top = computedStyle.top.slice(0, -2);
        let newTop = Number(top) - 20;
        events.style.top = newTop + "px";
        events.style.boxShadow = "0 0 20px green"
        enableCards.push(events.id);
        console.log(enableCards);
    } else if (enable) {
        events.removeAttribute("enable")
        let computedStyle = getComputedStyle(events);
        let top = computedStyle.top.slice(0, -2);
        let newTop = Number(top) + 20;
        events.style.top = newTop + "px";
        events.style.boxShadow = ""
        for (let i = 0; i < enableCards.length; i++) {
            if (enableCards[i] != events.id) continue;
            enableCards.splice(enableCards.indexOf(enableCards[i]), 1);
        }
        console.log(enableCards);
    }
}, true);


var positionInGame = document.getElementsByName("positionInGame")[0];
var peopleInGame = document.getElementsByName("peopleInGame")[0];
var rateBeforeYou = document.getElementsByName("somebodyRaise")[0];

var startButton = document.querySelector(".startButton");

startButton.addEventListener("click", function (event) {
    if (enableCards.length != 2) {
        store.style.border = "3px solid red";
        document.querySelector(".deck").focus();
        createErrorMessage(selects, "You didn't select your cards")
    } else if (enableCards.length == 2) {
        store.style.border = "3px solid #3B3B3B"
        let thirstCard = enableCards[0];
        console.log(thirstCard.slice(1));
        let secondCard = enableCards[1];
        console.log(secondCard.slice(1));
        let people = peopleInGame.value;
        let position = positionInGame.value;
        let rate = rateBeforeYou.value;
        analyzeGame(thirstCard, secondCard, people, position, rate);
    }
});

function createMessage(where, text, borderColor, backgroundColor) {
    startButton.setAttribute("disabled", true);
    let message = document.createElement("div");
    message.className = "message";
    let paragraph = document.createElement("p");
    paragraph.setAttribute("align", "center");
    let textNode = document.createTextNode(text);
    paragraph.appendChild(textNode);
    message.appendChild(paragraph);
    message.style.color = borderColor;
    message.style.backgroundColor = backgroundColor;
    where.appendChild(message);
    let timerId = setTimeout(function () {
        message.style.opacity = 0;
        let timerIdNew = setTimeout(function () {
            message.remove();
            message.style.opacity = 1;
            startButton.removeAttribute("disabled");
        }, 1000);
    }, 2400);
};

function createErrorMessage(where, text) {
    createMessage(where, text, "#F5F5F5", "#FF0000");
};

function createPositiveMessage(where, text) {
    createMessage(where, text, "#5A2500", "#FFDC85");
};

function createNeitralMessage(where, text) {
    createMessage(where, text, "#4F4F4F", "#CDCDCD")
};

function analyzeGame(thirstCard, secondCard, peopleInGame, positionInGame, someoneRaisedRate) {
    if (thirstCard.slice(1) == secondCard.slice(1) && thirstCard.slice(1) == "A" || thirstCard.slice(1) == secondCard.slice(1) && thirstCard.slice(1) == "K") {
        raise();
    } else if (thirstCard.slice(1) == secondCard.slice(1) && thirstCard.slice(1) == "Q") {
        if (someoneRaisedRate == "4") {
            fold();
        } else {
            raise();
        }
    } else if (thirstCard.slice(1) == secondCard.slice(1) &&
        (thirstCard.slice(1) == "J" || thirstCard.slice(1) == "10" || thirstCard.slice(1) == "9" ||
            thirstCard.slice(1) == "8" || thirstCard.slice(1) == "7")) {
        if (someoneRaisedRate == "0") {
            raise();
        } else if (someoneRaisedRate == "1" || someoneRaisedRate == "2" || someoneRaisedRate == "3") {
            call();
        } else if (someoneRaisedRate == "4") {
            fold();
        }
    } else if (thirstCard.slice(1) == secondCard.slice(1) &&
        (thirstCard.slice(1) == "2" || thirstCard.slice(1) == "3" || thirstCard.slice(1) == "4" ||
            thirstCard.slice(1) == "5" || thirstCard.slice(1) == "6")) {
        if (positionInGame == "2" && someoneRaisedRate == "0") {
            raise();
        } else if (positionInGame == "2" && (someoneRaisedRate == "1" || someoneRaisedRate == "2")) {
            call();
        } else {
            fold();
        }
    } else if ((thirstCard.slice(1) == "K" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "K")) {
        if (someoneRaisedRate == "0") {
            raise();
        } else if (someoneRaisedRate == "4") {
            fold();
        } else if ((someoneRaisedRate == "1" || someoneRaisedRate == "2" || someoneRaisedRate == "3") &&
            positionInGame == "2") {
            raise();
        } else {
            call();
        }
    } else if ((thirstCard.slice(1) == "Q" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "Q") ||
        (thirstCard.slice(1) == "J" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "J") ||
        (thirstCard.slice(1) == "10" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "10")) {
        if (thirstCard[0] == secondCard[0]) {
            if (positionInGame == "0") {
                if (someoneRaisedRate == "4") {
                    fold();
                } else {
                    raise();
                }
            } else if (positionInGame == "1" || positionInGame == "2") {
                if (someoneRaisedRate == "1" || someoneRaisedRate == "2" || someoneRaisedRate == "3") {
                    call();
                } else if (someoneRaisedRate == "4") {
                    fold();
                }
            }
        } else if (thirstCard[0] != secondCard[0]) {
            if (positionInGame == "0") {
                fold();
            } else if (positionInGame == "1" || positionInGame == "2") {
                if (someoneRaisedRate == "0") {
                    raise();
                } else if (someoneRaisedRate == "1" || someoneRaisedRate == "2" || someoneRaisedRate == "3") {
                    call();
                } else if (someoneRaisedRate == "4") {
                    fold();
                };
            };
        };
    } else if ((thirstCard.slice(1) == "9" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "9") ||
        (thirstCard.slice(1) == "8" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "8") ||
        (thirstCard.slice(1) == "7" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "7") ||
        (thirstCard.slice(1) == "6" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "6") ||
        (thirstCard.slice(1) == "5" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "5") ||
        (thirstCard.slice(1) == "4" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "4") ||
        (thirstCard.slice(1) == "3" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "3") ||
        (thirstCard.slice(1) == "2" && secondCard.slice(1) == "A") || (thirstCard.slice(1) == "A" && secondCard.slice(1) == "2")) {
        if (thirstCard[0] == secondCard[0]) {
            if (positionInGame != "2") {
                fold();
            } else {
                if (someoneRaisedRate == "0") {
                    raise();
                } else {
                    fold();
                }
            }
        } else if (thirstCard[0] != secondCard[0]) {
            fold();
        }
    } else if ((thirstCard.slice(1) == "10" && secondCard.slice(1) == "J") || (thirstCard.slice(1) == "J" && secondCard.slice(1) == "10") ||
        (thirstCard.slice(1) == "10" && secondCard.slice(1) == "Q") || (thirstCard.slice(1) == "Q" && secondCard.slice(1) == "10") ||
        (thirstCard.slice(1) == "10" && secondCard.slice(1) == "K") || (thirstCard.slice(1) == "K" && secondCard.slice(1) == "10") ||
        (thirstCard.slice(1) == "J" && secondCard.slice(1) == "Q") || (thirstCard.slice(1) == "Q" && secondCard.slice(1) == "J") ||
        (thirstCard.slice(1) == "J" && secondCard.slice(1) == "K") || (thirstCard.slice(1) == "K" && secondCard.slice(1) == "J") ||
        (thirstCard.slice(1) == "Q" && secondCard.slice(1) == "K") || (thirstCard.slice(1) == "K" && secondCard.slice(1) == "Q")) {
        if (thirstCard[0] == secondCard[0]) {
            if (someoneRaisedRate == "0" || someoneRaisedRate == "1" || someoneRaisedRate == "2") {
                raise();
            } else {
                fold();
            }
        } else {
            if (positionInGame == "0" || positionInGame == "1") {
                fold();
            } else {
                if (someoneRaisedRate == "0") {
                    raise();
                } else {
                    fold();
                }
            }
        }
    } else if ((thirstCard.slice(1) == "4" && secondCard.slice(1) == "5") || (thirstCard.slice(1) == "5" && secondCard.slice(1) == "4") ||
        (thirstCard.slice(1) == "5" && secondCard.slice(1) == "6") || (thirstCard.slice(1) == "6" && secondCard.slice(1) == "5") ||
        (thirstCard.slice(1) == "6" && secondCard.slice(1) == "7") || (thirstCard.slice(1) == "7" && secondCard.slice(1) == "6") ||
        (thirstCard.slice(1) == "7" && secondCard.slice(1) == "8") || (thirstCard.slice(1) == "8" && secondCard.slice(1) == "7") ||
        (thirstCard.slice(1) == "8" && secondCard.slice(1) == "9") || (thirstCard.slice(1) == "9" && secondCard.slice(1) == "8") ||
        (thirstCard.slice(1) == "9" && secondCard.slice(1) == "10") || (thirstCard.slice(1) == "10" && secondCard.slice(1) == "9")) {
        if (thirstCard[0] == secondCard[0]) {
            if (positionInGame == "2") {
                if (someoneRaisedRate == "0") {
                    raise();
                } else {
                    fold();
                }
            } else {
                fold();
            }
        } else {
            fold();
        }
    } else {
        fold();
    };
};

function raise() {
    createPositiveMessage(selects, "Raise!");
};

function fold() {
    createErrorMessage(selects, "Fold!");
};

function call() {
    createNeitralMessage(selects, "Call!");
};