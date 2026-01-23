import {SubGameState} from "./SubGameState";
import GameStates from "../GameStates";
import {FREE_SPINS_TYPES} from "../../../service/api/OfflineAPI";
import {BONUSES} from "../../../constants";

export class LevelReward extends SubGameState {
    enter() {
        super.enter();

        this.levelUp();
    }

    async levelUp() {
        // active reward
        // show popup
        const reward = this.gameLogic.nextActiveReward();

        if (reward) {
            this.showAnimation(reward);
        } else {
            this.gameState.goTo(GameStates.IDLE);
        }
    }

    async showAnimation(reward) {
        try {
            const { freeSpins = [], superGames = [] } = await this.gameLogic.activateReward(reward);

            let winType = BONUSES.FREE_SPINS;
            let value = 0;

            if (freeSpins.length > 0) {
                if (freeSpins[0].type === FREE_SPINS_TYPES.NORMAL) {
                    winType = BONUSES.FREE_SPINS;
                } else if (freeSpins[0].type === FREE_SPINS_TYPES.FULL_PLEASURE) {
                    winType = BONUSES.FULL_PLEASURE;
                } else if (freeSpins[0].type === FREE_SPINS_TYPES.DOUBLE_LECHERY) {
                    winType = BONUSES.DOUBLE_LECHERY;
                }
            }

            if (superGames.length > 0) {
                winType = BONUSES.NAUGHTY_CHARACTER;
            }

            await this.gameState.levelUp({
                next: reward.next,
                current: reward.next - 1,
                winType
            });

            this.levelUp();
        } catch (e) {
            this.gameState.goTo(GameStates.ERROR, e);
        }
    }

    exit() {}
    spin() {}
}
