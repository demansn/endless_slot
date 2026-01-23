import * as PIXI from "pixi.js";
import {services} from "../ServiceLocator";

const BUTTON_STATES = {
    DEFAULT: 'default',
    PRESSED: 'pressed',
    HOVER: 'hover',
    DISABLED: 'disabled'
};

export class ButtonStateManager {
    constructor() {
    }
}

export default class MyButton extends PIXI.Sprite {
    _resPath = null;

    _isPressed = false;
    _isOver = false;
    _isActive = false;


    get isActive() {
        return this._isActive;
    }


    constructor(resPath, programStates) {
        super();

        this._resPath = resPath;
        this.programStates = programStates;

        this.buttonMode = true;
        this.interactive = true;

        this.texture = services.resources.get(resPath.on);

        // Listen to events.
        if (resPath.hover) {
            this.on("pointerover", this.onPointer_Over, this);
        }
        if (resPath.pressed || resPath.sfx && resPath.sfx.click) {
            this.on("pointerdown", this.onPointer_Down, this);
            this.on("pointerup", this.onPointer_Up, this);
            this.on("pointerupoutside", this.onPointer_Up, this);
        }
        if (resPath.hover || resPath.pressed) {
            this.on("pointerout", this.onPointer_Out, this);
        }
    }

    reset() {
        this.texture = services.resources.get(this._resPath.on);
        this._isPressed = false;
        this._isOver = false;
        this._isActive = false;
    }

    onPointer_Over() {
        if (!this._isPressed) {
            if (this._resPath.sfx && this._resPath.sfx.hover) {
                services.audio.playSfx(this._resPath.sfx.hover);
            } else {
                services.audio.playSfx("4.0_ver_3");
            }

            this.texture = services.resources.get(this._resPath.hover);
            this.programStates && (this.tint = 0x9E9E9E);
        }

        this._isOver = true;
    }

    onPointer_Out() {
        if (!this._isPressed) {
            this.texture = services.resources.get(this._isActive ? this._resPath.active : this._resPath.on);
            this.programStates && (this.tint = 0xffffff);
        }

        this._isOver = false;
    }

    onPointer_Down() {
        if (this._resPath.sfx && this._resPath.sfx.click) {
            services.audio.playSfx(this._resPath.sfx.click);
        } else {
            services.audio.playSfx("3.0_ver_2");
        }

        if (this._resPath.pressed) {
            this.texture = services.resources.get(this._isActive ? this._resPath.active : this._resPath.pressed);
            this.programStates && this.scale.set(0.95);
        }

        this._isPressed = true;
    }

    onPointer_Up() {
        this.texture = services.resources.get(this._isOver ? this._resPath.hover : (this._isActive ? this._resPath.active : this._resPath.on));
        this.programStates && this.scale.set(1);
        this.programStates && (this.tint = 0xffffff);

        this._isPressed = false;
    }

    setEnabled(isEnabled) {
        this.buttonMode = isEnabled;
        this.interactive = isEnabled;

        if (this._resPath.off) {
            this.texture = services.resources.get(isEnabled ? this._resPath.on : this._resPath.off);
        } else {
            if (!isEnabled) {
                this.texture = services.resources.get(this._resPath.on);
            } else {
                this.texture = services.resources.get(this._isOver ? this._resPath.hover : this._resPath.on);
            }
            this.alpha = isEnabled ? 1 : 0.5;
        }
    }

    setActive(isActive) {
        this._isActive = isActive;

        if (isActive) {
            this.texture = services.resources.get(this._resPath.active);
        } else {
            this.texture = services.resources.get(this._isOver ? this._resPath.hover : this._resPath.on);
        }
    }

    setTextures(resPath) {
        this._resPath = resPath;

        if (!this.buttonMode && this._resPath.off) {
            this.texture = services.resources.get(this._resPath.off);
        } else {
            this.texture = services.resources.get(this._isOver ? this._resPath.hover : this._resPath.on);
        }
    }

    async emulateClick() {
        this.onPointer_Down();
        await new Promise(r => setTimeout(r, 100));
        this.onPointer_Up();
    }
}

/*export interface IButtonResPath
{
    on: string;
    pressed?: string;
    hover?: string;
    off?: string;
    active?: string;
}*/
