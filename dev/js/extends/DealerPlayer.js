Blackjack.DealerPlayer = function() {
    this.hand = [];
    this.id = 'dealer';
    Blackjack.Player.call(this, this.id);
};

Blackjack.DealerPlayer.prototype = {
    showCard: function (card) {
        var handLength = this.hand.length;
        for (var i=0;i<handLength; i++) {
            if (card.id === this.hand[i].id) {
                this.hand[i].visible = true;
            }
        }
    }
};

Blackjack.Utils.extend(Blackjack.DealerPlayer.prototype, Blackjack.Player.prototype);