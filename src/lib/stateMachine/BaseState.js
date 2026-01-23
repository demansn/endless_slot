import {StateMachine} from "./StateMachine.js";

export class BaseState {
    #state = null;

    constructor({owner, name, states, scenes, dependencies, options, ...rest}) {
        this.owner = owner;
        this.name = name;
        this.#state = states ? new StateMachine({owner: this, states, dependencies, ...rest}) : null;

        this.options = options || {};
    }

    getOption(name) {
        return this.options[name];
    }

    enter() {

    }

    exit() {

    }

    update(td) {

    }

    goTo(name, parameters) {
        if (!this.#state) {
            throw new Error('State machine is not defined');
        }

        this.#state.goTo(name, parameters);
    }

    isCurrentState(name) {
        return this.#state && this.#state.currentState === name;
    }

    get currentState() {
        if (this.#state) {
            return this.#state.getCurrentState();
        }
    }
}
