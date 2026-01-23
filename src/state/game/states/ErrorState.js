import {SubGameState} from "./SubGameState";
import {services} from "../../../ServiceLocator";
import gsap from "gsap";
import GameStates from "../GameStates";

export class ErrorState extends SubGameState {
    enter(error) {
        gsap.globalTimeline.timeScale(0);

        this.gameState.timeMult = 0;
        this.gameState.interactive = false;
        this.gameState.interactiveChildren = false;

        let popup = 'sessionExpired';

        console.error(error);

        if (error.code === 'not_enough_balance') {
            popup = 'noFunds';
        }

        if (error.custom_message) {
            popup = 'error';
        }

        services.get('popups').showPopup(popup, error);

        if (error.code === 'not_enough_balance') {
            this.gameState.goTo(GameStates.IDLE);
            this.gameState.interactive = true;
            this.gameState.interactiveChildren = true;
        }
    }
}
