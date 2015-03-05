Blackjack.Deck = function() {
    this.cards = this.createDeck();
};

Blackjack.Deck.prototype = {
    dealCard: function() {
        return this.cards.shift();
    },
    createDeck: function() {
        var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
            colors = ['hearts', 'spades', 'clubs', 'diams'],
            deck = [],
            ranksLength = ranks.length,
            colorsLength = colors.length,
            deckLength = 0;

        for (var i = 0;i<colorsLength;i++) {
            for (var j = 0;j<ranksLength;j++) {
                deck[deckLength] = new Blackjack.Card(ranks[j], colors[i]);
                deckLength++;
            }
        }

        return deck;
    },
    shuffle: function() {
        var newDeck = [],
            deckLength = this.cards.length;
        for (var i = 0; i < deckLength; i++) {
            var random = Math.floor(Math.random() * (i + 1));
            newDeck[i] = newDeck[random];
            newDeck[random] = this.cards[i];
        }
        this.cards = newDeck;
    }
};