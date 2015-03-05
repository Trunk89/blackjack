Blackjack.Utils = (function () {
    var utils = {};

    utils.extend = function(target, source) {
        for (var property in source) {
            if(source.hasOwnProperty(property)) {
                //no clobber so child classes can overwrite parent classes methods if needs be
                if (!target.hasOwnProperty(property)) {
                    target[property] = source[property];
                }
            }
        }
    };

    utils.getCardValue = function (cardRank) {
        var value = [];

        switch (cardRank) {
            case 'J':
            case 'Q':
            case 'K':
                value = [10];
                break;
            case 'A':
                    value = [11, 1];
                break;
            default:
                value = [parseInt(cardRank)];
        }

        return value;
    };

    utils.createId = function (rank, color) {
        return (String(CryptoJS.MD5(new Date().getMilliseconds() + rank + color)))
            .split('')
            .sort(function(){return 0.5-Math.random();})
            .join('')
            .substr(0, 3);
    };

    return utils;
})();
