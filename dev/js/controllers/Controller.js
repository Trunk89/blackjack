Blackjack.Controller = (function () {
    var controller = {},
        board,
        gameEnd = false,
        stickButton,
        hitButton,
        messageElement,
        messageContainer,
        dealerBoard,
        playerBoard,
        dealerScore,
        playerScore,
        dealerHand,
        playerHand;

    controller.init = function (container) {
        var template =
            "<div class='blackjack-wrapper blackjack-game-container'><div class='buttons'><input type='button' class='stick-button' value='Stand' onclick='Blackjack.Controller.stand();' disabled>" +
            "<input type='button' class='hit-button' value='Hit' onclick='Blackjack.Controller.hit();' disabled></div><div class='board'>" +
            "<div class='tags player-name'><div class='scores'><span class='player-total-score'>-</span><span class='player-current-hand'>-</span></div></div>" +
            "<div id='player-cards' class='cards player'></div><div class='tags dealer-name'><div class='scores'>" +
            "<span class='dealer-total-score'>-</span><span class='dealer-current-hand'>-</span>" +
            "</div></div><div id='dealer-cards' class='cards dealer'></div></div><div class='message-container'><div class='overlay-message'>" +
            "<div id='message' class='end-message'></div><input type='button' class='new-game-button' value='Next Game' onclick='Blackjack.Controller.nextRound();'></div></div></div>";

        container.innerHTML = template;
        this.newGame();
    };

    controller.newGame = function () {
        var player = new Blackjack.Player(),
            dealer = new Blackjack.DealerPlayer(),
            deck = new Blackjack.Deck();

        restartGUI();
        enableButtons();

        deck.shuffle();

        board = new Blackjack.Board(player, dealer, deck);

        this.hit();
        hitDealer(true);
        this.hit();
        hitDealer(false);
    };

    controller.nextRound = function () {
        if (!board) {
            this.newGame();
        }

        var deck = new Blackjack.Deck(),
            that = this;

        restartGUI();

        deck.shuffle();
        board.player.dropHand();
        board.dealer.dropHand();

        board.newDeck(deck);

        setTimeout(function () {
            that.hit();
            setTimeout(function () {
                hitDealer(true);
                setTimeout(function () {
                    that.hit();
                    setTimeout(function () {
                        hitDealer(false);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);

    };

    controller.hit = function () {
        var card = dealCard("player", true);
        board.player.addCard(card);

        update(card, true);

        checkResults('player');

        updateHandGUI();

        if (board.player.hand.length === 5) {
            this.stand();
        }

    };

    controller.stand = function () {
        disableButtons();

        showHiddenCard(board.dealer.hand[1]);

        checkResults('dealer');

        setTimeout(function () {
            dealerMove();
        }, 1000);

    };

    var dealerMove = function () {

        compareHandsValue();

        if (!gameEnd) {
            hitDealer(true);
            checkResults('dealer');
            if (board.dealer.hand.length === 5) {
                compareHandsValue();
                if (!gameEnd) {
                    wonGame();
                }
            } else if (!gameEnd) {
                setTimeout(function () {
                    dealerMove();
                },1000);
            }
        }
    };

    var getHandValue = function (ar) {
        var tempArray = ar,
            tempArrayLength = tempArray.length,
            cardArray = [],
            cardArrayLength,
            handValue = 0,
            aceArray = [],
            aceArrayLength;

        for (var j=0; j<tempArrayLength;j++) {
            if (tempArray[j].rank === 'A') {
                aceArray.push(tempArray[j]);
            } else {
                cardArray.push(tempArray[j]);
            }
        }

        aceArrayLength = aceArray.length;

        for (var k=0; k<aceArrayLength;k++) {
            cardArray.push(aceArray[k]);
        }

        cardArrayLength = cardArray.length;

        for (var i=0; i<cardArrayLength;i++) {
            var valueArray = cardArray[i].values;

            if (!cardArray[i].visible) {
                continue;
            }

            if (valueArray.length > 1 && handValue > 10) {
                handValue += parseInt(valueArray[1]);
            } else {
                handValue += parseInt(valueArray[0]);
            }
        }

        return parseInt(handValue);

    };

    var compareHandsValue = function () {
        var dealerHand = getHandValue(board.dealer.hand),
            playerHand = getHandValue(board.player.hand);

        if (dealerHand !== playerHand && (21 - dealerHand) < (21 - playerHand)) {
            lostGame();
        }
    };

    var checkResults = function (id) {
        var valueArray = (id === 'player') ? board.player.hand : board.dealer.hand,
            value = getHandValue(valueArray);

        if (value > 21) {
            if (id === 'player') {
                lostGame();
            } else {
                wonGame();
            }
        } else if (value === 21) {
            if (id === 'player') {
                wonGame();
            } else {
                lostGame();
            }
        }
    };

    var hitDealer = function (isVisible) {
        var card = dealCard('dealer', isVisible);
        board.dealer.addCard(card);

        update(card, false);
        updateHandGUI();
    };

    var dealCard = function (id, isVisible) {
        var card = board.deck.dealCard();

        if (isVisible) {
            card.showCard();
        }

        return card;
    };

    var update = function (card, isPlayer) {
        var element,
            cardElem = document.createElement('div'),
            symbolElemTop,
            symbolElemBottom;

        if (isPlayer) {
            element = playerBoard || document.getElementById('player-cards');
        } else {
            element = dealerBoard || document.getElementById('dealer-cards');
        }

        cardElem.id = card.id;

        if (card.visible === false) {
            cardElem.className = 'hidden-card';
            cardElem.innerHTML = '?';
        } else {
            symbolElemTop = document.createElement('span');
            symbolElemBottom = document.createElement('span');

            symbolElemBottom.className = 'bottom-symbol';
            symbolElemTop.className = 'top-symbol';

            cardElem.innerHTML = card.rank;
            cardElem.className = card.color;

            cardElem.appendChild(symbolElemBottom);
            cardElem.appendChild(symbolElemTop);
        }

        element.appendChild(cardElem);

        setTimeout(function () {
            cardElem.style.opacity = 1;
        },50);

    };

    var showHiddenCard = function (card) {
        var element = document.getElementById(card.id),
            symbolElemTop,
            symbolElemBottom;

        element.className = card.color;
        element.innerHTML = card.rank;

        symbolElemTop = document.createElement('span');
        symbolElemBottom = document.createElement('span');
        symbolElemBottom.className = 'bottom-symbol';
        symbolElemTop.className = 'top-symbol';

        element.appendChild(symbolElemBottom);
        element.appendChild(symbolElemTop);

        board.dealer.showCard(card);

        updateHandGUI();
    };

    var lostGame = function () {
        var message = 'You have lost this time, sorry!';
        disableButtons();
        displayMessage(message);
        board.dealer.addScore();
        updateScoresGUI();

        gameEnd = true;
    };

    var wonGame = function () {
        var message = 'You have won, congratulations!';
        disableButtons();
        displayMessage(message);
        board.player.addScore();
        updateScoresGUI();

        gameEnd = true;
    };

    var updateHandGUI = function () {
        playerHand = playerHand || document.getElementsByClassName('player-current-hand')[0];
        dealerHand = dealerHand || document.getElementsByClassName('dealer-current-hand')[0];

        playerHand.innerHTML = getHandValue(board.player.hand);
        dealerHand.innerHTML = getHandValue(board.dealer.hand);
    };

    var updateScoresGUI = function () {
        playerScore = playerScore || document.getElementsByClassName('player-total-score')[0];
        dealerScore = dealerScore || document.getElementsByClassName('dealer-total-score')[0];

        playerScore.innerHTML = board.player.score;
        dealerScore.innerHTML = board.dealer.score;
    };

    var enableButtons = function () {
        stickButton = stickButton || document.getElementsByClassName('stick-button')[0];
        hitButton = hitButton || document.getElementsByClassName('hit-button')[0];

        hitButton.disabled = false;
        stickButton.disabled = false;
    };

    var disableButtons = function () {
        stickButton = stickButton || document.getElementsByClassName('stick-button')[0];
        hitButton = hitButton || document.getElementsByClassName('hit-button')[0];

        hitButton.disabled = true;
        stickButton.disabled = true;
    };

    var displayMessage = function (message) {
        messageElement = messageElement || document.getElementById('message');
        messageContainer = messageContainer || document.getElementsByClassName('message-container')[0];

        messageContainer.style.display = 'block';
        messageElement.innerHTML = message;
    };

    var restartGUI = function () {
        dealerBoard = dealerBoard || document.getElementById('dealer-cards');
        playerBoard = playerBoard || document.getElementById('player-cards');
        messageElement = messageElement || document.getElementById('message');
        messageContainer = messageContainer || document.getElementsByClassName('message-container')[0];
        stickButton = stickButton || document.getElementsByClassName('stick-button')[0];
        hitButton = hitButton || document.getElementsByClassName('hit-button')[0];

        hitButton.disabled = false;
        stickButton.disabled = false;

        messageContainer.style.display = 'none';
        messageElement.innerHTML = '';

        gameEnd = false;

        dealerBoard.innerHTML = '';
        playerBoard.innerHTML = '';
    };

    return controller;

})();