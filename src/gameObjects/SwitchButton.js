import {SuperContainer} from "../lib/objects/SuperContainer";
import {Button} from "./Button";
import {Switcher} from "@pixi/ui";

const templateToName = (template, state) => template.replace('[SwitchState]', state);

export const SwitchState = {
    ON: 'on',
    OFF: 'off',
};

export class SwitchButton extends SuperContainer {
    constructor({onSwitch, template, value}) {
        super();

        this.onView = typeof template === 'string' ? this.addObject(Button, {template: templateToName(template, SwitchState.ON)}) : this.addChild(template);
        this.offView = typeof template === 'string' ? this.addObject(Button, {template:  templateToName(template, SwitchState.OFF)}) : this.addChild(template);
        this.switcher = this.addChild(new Switcher([this.onView, this.offView]));

        this.onView.onPress.connect(this.onClickOn.bind(this));
        this.offView.onPress.connect(this.onClickOff.bind(this));
        this.switcher.onChange.connect(this.onSwitch.bind(this));
        this.switcher.onChange.connect(onSwitch);

        this.switch(value ? 0 : 1);
    }

    setEnabled(value) {
        this.onView.enabled = value;
        this.offView.enabled = value;
    }

    onClickOn() {
        this.switcher.switch(0);
    }

    onClickOff() {
        this.switcher.switch(1);
    }

    switch(value) {
        this.switcher.forceSwitch(value ? 0 : 1)
    }

    onSwitch(state) {
        this.emit('switch', state);
    }
}
