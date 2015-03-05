describe("Blackjack board functionality", function() {

    it("contains valid objects", function() {
        var player = new Blackjack.Player(),
            dealer = new Blackjack.DealerPlayer(),
            deck = new Blackjack.Deck(),
            blackjack = new Blackjack.Board(player, dealer, deck);

        expect(blackjack.player).toBe(player);
        expect(blackjack.dealer).toBe(dealer);
        expect(blackjack.deck).toBe(deck);
    });
});

describe("Card functionality", function() {
    var card;

    beforeEach(function() {
        card = new Blackjack.Card('A', 'hearts');
    });

    it("contains valid properties", function() {
        expect(card).not.toBeNull();
        expect(card.rank).toEqual('A');
        expect(card.color).toEqual('hearts');
        expect(card.values).toEqual([11,1]);
        expect(card.visible).toBeFalsy();
    });

    it("creates random unique id", function() {
        var card2 = new Blackjack.Card('A', 'hearts');

        expect(card.id).not.toEqual(card2.id);
    });

    it("flips the card to be visible", function() {
        card.showCard();

        expect(card.visible).toBeTruthy();
    });
});

describe("Deck functionality", function() {
    var deck;

    beforeEach(function() {
        deck = new Blackjack.Deck();
    });

    it("creates a deck of 52 cards", function () {
        expect(deck.cards).not.toBeNull();
        expect(deck.cards.length).toEqual(52);

    });

    it("deals card", function () {
        var card = deck.cards[0],
            dealedCard;

        expect(deck.cards.length).toEqual(52);

        dealedCard = deck.dealCard();

        expect(deck.cards.length).toEqual(51);
        expect(deck.cards[0]).not.toBe(card);
        expect(dealedCard).toBe(card);
    });

    it("shuffles the deck", function () {
        var oldDeck = (JSON.parse(JSON.stringify(deck))),
        newDeck;

        deck.shuffle();

        newDeck = (JSON.parse(JSON.stringify(deck)));

        expect(newDeck).not.toEqual(oldDeck);
    });
});

describe("Utils functionality", function() {

    it("extend object", function () {
        var card = new Blackjack.Card('A', 'spades'),
            secondCard = {};

        Blackjack.Utils.extend(secondCard, card);

        expect(secondCard).toEqual(card);
    });

    it("returns correct value for card", function () {
        var aceValues = Blackjack.Utils.getCardValue('A'),
            kingValues = Blackjack.Utils.getCardValue('K'),
            queenValues = Blackjack.Utils.getCardValue('Q'),
            jackValues = Blackjack.Utils.getCardValue('J'),
            sevenValues = Blackjack.Utils.getCardValue('7'),
            twoValues = Blackjack.Utils.getCardValue('2');

        expect(aceValues).toEqual([11,1]);
        expect(kingValues).toEqual([10]);
        expect(queenValues).toEqual([10]);
        expect(jackValues).toEqual([10]);
        expect(sevenValues).toEqual([7]);
        expect(twoValues).toEqual([2]);
    });

});

describe("Player functionality", function() {
    var player,
        dealer;

    beforeEach(function() {
        player = new Blackjack.Player();
        dealer = new Blackjack.DealerPlayer();
    });

    it("add cards", function () {
        var card = new Blackjack.Card('A', 'spades');

        expect(player.hand.length).toEqual(0);

        player.addCard(card);

        expect(player.hand.length).toEqual(1);
        expect(player.hand[0]).toBe(card);
    });

    it("has correct id", function () {
        expect(player.id).toEqual('player');
        expect(dealer.id).toEqual('dealer');
    });

    it("dealer can flip/show cards", function () {
        var card = new Blackjack.Card('A', 'hearts');

        dealer.addCard(card);

        expect(dealer.hand[0].visible).toBeFalsy();

        dealer.showCard(card);

        expect(dealer.hand[0].visible).toBeTruthy();
    });

    it("player drop hand", function () {
        var card = new Blackjack.Card('A', 'spades');

        player.addCard(card);

        expect(player.hand.length).toEqual(1);

        player.dropHand();

        expect(player.hand.length).toEqual(0);
    });

    it("player gets score after winning", function () {
        expect(player.score).toEqual(0);

        player.addScore();

        expect(player.score).toEqual(1);

    });

});

