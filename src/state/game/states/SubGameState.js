import {BaseState} from "../../../lib/stateMachine/BaseState";

export class SubGameState extends BaseState {
    /**
     *
     * @type {GameLogic}
     */
    gameLogic = null;

    /**
     *
     * @type {BonuesService}
     */
    bonuses = null;

    /**
     * @type {GameState}
     */
    gameState = null;
    /**
     *
     * @type {Game}
     */
    game = null;
    /**
     *
     * @type {HUD}
     */
    hud = null;
    /**
     *
     * @type {PopupsManager}
     */
    popups = null;
    constructor(parameters) {
        super(parameters);

        this.gameLogic = parameters.dependencies.get('gameLogic');
        this.data = parameters.dependencies.get('data')
        this.popups = parameters.dependencies.get('popups')
        this.bonuses = parameters.dependencies.get('shop');
        this.gameState = parameters.owner;
        this.game = this.gameState.game;
        /**
         * @type {HUD}
         */
        this.hud = this.gameState.hud;
    }
    enter() {
    }

    exit() {
    }

    update(dt) {
    }

    spin() {
    }
}
