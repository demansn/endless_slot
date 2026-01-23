import {gsap} from "gsap";
import {SubGameState} from "./SubGameState";
import {ServiceLocator, services} from "../../../ServiceLocator";
import GameStates from "../GameStates";

export class BonusGameNaughtyCharacterGame extends SubGameState {
    enter() {
        super.enter();

        /**
         * @type {RouletteScene}
         */
        this.roulette = this.gameState.rouletteScene;
        this.roulette.on('spin', this.onSpin, this);
    }

    async onSpin() {
        try {
            this.roulette.disabledSpinButton();

            const {supergame_multi, supergame_total_win} = await this.gameLogic.spinSuperGame();
            const tl = gsap.timeline();

            tl.add(this.roulette.spin(supergame_multi));
            tl.add(() => this.showTotalWin(supergame_total_win));
        } catch (e) {
            this.gameState.goTo(GameStates.ERROR, e);
        }
    }

    async showTotalWin(win) {
        if (win) {
            await services.get('popups').showPopup('TotalWinPopup', {win, id: 3});
        }

        this.hud.setBalance(this.gameLogic.balance);
        this.goToIdleState();
    }

    goToIdleState() {
        this.gameState.goTo(GameStates.IDLE);
    }

    exit() {
        super.exit();
        this.roulette.off('spin', this.onSpin, this);
        this.roulette.hide();
    }
}
