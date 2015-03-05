Blackjack.Player = function(id) {
    this.id = id || 'player';
    this.hand = [];
    this.score = 0;
};

Blackjack.Player.prototype = {
    addCard: function (card) {
        this.hand.push(card);
    },
    dropHand: function () {
        this.hand = [];
    },
    addScore: function () {
        this.score += 1;
    }
};