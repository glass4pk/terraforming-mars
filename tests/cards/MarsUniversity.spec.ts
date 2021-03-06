
import { expect } from "chai";
import { MarsUniversity } from "../../src/cards/MarsUniversity";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Pets } from "../../src/cards/Pets";
import { OrOptions } from "../../src/inputs/OrOptions";
import { Research } from "../../src/cards/Research";

describe("MarsUniversity", function () {
    it("Should play", function () {
        const card = new MarsUniversity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
        expect(card.onCardPlayed(player, game, new Pets())).to.eq(undefined);
        expect(game.interrupts.length).to.eq(0);
        player.cardsInHand.push(card);
        card.onCardPlayed(player, game, card);
        expect(game.interrupts.length).to.eq(1);
        let orOptions = game.interrupts[0].playerInput as OrOptions;
        game.interrupts.splice(0, 1);
        orOptions.options[0].cb([card]);
        expect(player.cardsInHand.length).to.eq(1);
        expect(player.cardsInHand[0]).not.to.eq(card);
        expect(game.dealer.discarded.length).to.eq(1);
        expect(game.dealer.discarded[0]).to.eq(card);
        expect(game.interrupts.length).to.eq(0);
    });
    it("Runs twice for multiple science tags", function () {
        const card = new MarsUniversity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.cardsInHand.push(card, card);
        card.onCardPlayed(player, game, new Research());
        expect(game.interrupts.length).to.eq(1);
        let orOptions = game.interrupts[0].playerInput as OrOptions;
        game.interrupts.splice(0, 1);
        orOptions.options[1].cb();
        expect(game.interrupts.length).to.eq(1);
        orOptions = game.interrupts[0].playerInput as OrOptions;
        game.interrupts.splice(0, 1);
        orOptions.options[1].cb();
        expect(game.interrupts.length).to.eq(0);
    });
});
