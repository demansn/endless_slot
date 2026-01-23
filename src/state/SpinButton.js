import {Button} from "../gameObjects/Button";
import services from "../ServiceLocator";

export default class SpinButton extends Button {
    constructor() {
        super({template: 'spin_btn_[ButtonState]'});

        this.on("pointertap", () => {
            services.audio.playSfx("Spin_Click");
        });
        // this.on("pointerover", () => {
        //     services.audio.playSfx("4.0_ver_3");
        // });
    }

    setActive(isActive) {

    }

    setEnabled(isEnabled) {
        this.enabled = isEnabled;
    }
}
