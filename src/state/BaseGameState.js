import {BaseState} from "../lib/stateMachine/BaseState";
import {SuperContainer} from "../lib/objects/SuperContainer";

export class BaseGameState extends BaseState {
    /**
     * Dependencies
     * @type {ServiceLocator}
     */
    dependencies = null;
    constructor(parameters) {
        super(parameters);

        this.dependencies = parameters.dependencies;
        this.gameLogic = parameters.dependencies.get('gameLogic');
        this.gameConfig = parameters.dependencies.get('gameConfig');
        this.data = parameters.dependencies.get('data');
        this.root = new SuperContainer();
        this.root.name = parameters.name;
        this.root.parentLayer = this.dependencies.get('layers').get('default');
        this.dependencies.get('app').stage.addChild(this.root);
    }
    /**
     *
     * @type {SuperContainer}
     */
    root = null;
    enter() {
        super.enter();
    }

    exit() {
        super.exit();

        this.root.destroy();
    }

    update(dt) {
        super.update(dt);
        const currentState = this.currentState;

        if (currentState && currentState.update) {
            currentState.update(dt);
        }
    }
}
