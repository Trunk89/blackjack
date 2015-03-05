Blackjack.Board = function(player, dealer, deck) {
    this.player = player;
    this.dealer = dealer;
    this.deck = deck;
};

Blackjack.Board.prototype = {
    newDeck: function (deck) {
        this.deck = deck;
    }
};