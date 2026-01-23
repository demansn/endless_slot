import {gsap} from "gsap";
import {SubGameState} from "./SubGameState";
import { DoubleLecheryScene } from "../../scenes/DoubleLecheryScene";
import GameStates from "../GameStates";

export class BonusGameDoubleLecheryFinal extends SubGameState {
    enter(hash) {
        super.enter();

        /**
         * @type {DoubleLecheryScene}
         */
        this.doubleLecheryScene = this.gameState.doubleLecheryScene;
        this.hash = hash;

        this.showDoubleLechery();
    }

    showDoubleLechery() {
        this.doubleLecheryScene.show();
        this.doubleLecheryScene.once('cardClick', this.handleOpenCard, this);
    }

    async handleOpenCard(index) {
        try {
            const {multiplier, totalWin} = await this.gameLogic.finishDoubleLechery(this.hash);

            await this.openCard(index, multiplier);

            if (totalWin > 0) {
                await this.popups.showPopup('TotalWinPopup', {win: totalWin, id: 1});
            }

            this.gameState.goTo(GameStates.IDLE);
        } catch (e) {
            this.gameState.goTo(GameStates.ERROR, e);
        }
    }

    async openCard(index, multiplier) {
        return new Promise(resolve => {
            gsap.timeline()
                .add(this.doubleLecheryScene.openCard(index, multiplier))
                .add(this.doubleLecheryScene.hide(), '+=1')
                .call(resolve);
        });
    }

    exit() {
        super.exit();
        this.hash = null;
        this.hud.setMainGameState();
        this.gameState.setMainGameBackground();
        this.hud.animateWin(0);
        this.hud.setBalance(this.gameLogic.balance);
        this.gameState.playMainTheme();
    }

    spin() {}
}
