import {SuperContainer} from "../lib/objects/SuperContainer";
import {FancyButton} from "@pixi/ui";
import services from "../ServiceLocator";
import {SOUNDS} from "../constants/sounds";

export class ButtonWithTitle extends SuperContainer {
    /**
    * @type {FancyButton}
     */
    #view;
    constructor({title, onClick, disabled}) {
        super();

        this.#view = this.addObject(FancyButton,{
            defaultView: new ButtonState({state: 'Default', title}),
            hoverView: new ButtonState({state: 'Hover', title}),
            pressedView: new ButtonState({state: 'Pressed', title}),
            disabledView: new ButtonState({state: 'Disabled', title}),
            anchor: 0.5,
        });

        this.#view.onPress.connect(() => {
            this.emit('clicked');
        });

        if (onClick) {
            this.on('clicked', onClick);
        }

        if (disabled) {
            this.enabled = false;
        }

        this.#view.onHover.connect(this.onHover.bind(this));
        this.#view.onPress.connect(this.onPressed.bind(this));
    }

    onHover() {
        services.audio.playSfx(SOUNDS.ui.hover);
    }

    onPressed() {
        services.audio.playSfx(SOUNDS.ui.click);
    }

    set enabled(value) {
        this.#view.enabled = value;
    }

    get enabled() {
        return this.#view.enabled;
    }

    setState(state) {
        this.#view.setState(state);
    }

    setTitle(title){
        this.#view.defaultView.title = title;
        this.#view.hoverView.title = title;
        this.#view.pressedView.title = title;
        this.#view.disabledView.title = title;
    }
}

class ButtonState extends SuperContainer {
    constructor({title, state}) {
        super();

        const stateName = `ButtonWithTitle_btn_${state.toLowerCase()}`;
        const bg = this.addObject(stateName, {},);
        this.text = this.addObject('Text', {text: title.toUpperCase(), style: stateName}, {x: (bg.width / 2) - 6, y: (bg.height / 2) - 6, anchor: 0.5});

        if (state === 'Disabled' || state === 'Pressed') {
            this.text.alpha = 0.5;
        }
    }

    set title(value){
        this.text.text = value;
    }
}
