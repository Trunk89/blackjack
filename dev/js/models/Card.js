Blackjack.Card = function (rank, color) {
    this.rank = rank;
    this.color = color;
    this.visible = false;
    this.values = Blackjack.Utils.getCardValue(rank);
    this.id = Blackjack.Utils.createId(this.rank, this.color);
};

Blackjack.Card.prototype = {
    showCard: function () {
        this.visible = true;
    }
};