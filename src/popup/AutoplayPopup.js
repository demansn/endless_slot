import * as PIXI from "pixi.js";
import {services} from "../ServiceLocator";
import {BasePopup} from "./BasePopup";
import {SuperContainer} from "../lib/objects/SuperContainer";

export default class AutoplayPopup extends BasePopup {
    create({onStarted}) {
        super.create();

        this.bg = this.addObject('PopupBG', {}, {anchor: 0.5, x: 's50%', y: 's50%'});
        this.title = this.addObject('Text', {text: 'AUTOPLAY', style: 'PopupTitle'}, {y: 155, x: 's50%', anchor: 0.5});
        this.closeButton.position.set(1631, 162);
        this.onStarted = onStarted;

        let window = this.addObject('SuperContainer');

        let oldWindow = window;
        window = new PIXI.Container();

        this._gameLimit = new AutoplaySettingsBar({
            title: 'NUMBER OF GAMES:',
            value: this.data.autoplayGameLimit,
            onChanged: this.onChangeGameLimit.bind(this),
            maxValue: Math.POSITIVE_INFINITY
        });

        this._winLimit = new AutoplaySettingsBar({
            title: 'WIN LIMIT:',
            value: this.data.autoplayWinLimit,
            onChanged: this.onChangeWinLimit.bind(this),
            maxValue: Math.POSITIVE_INFINITY,
            valueFormatter: (value) => `${value}${services.session.currency ?? ''}`
        });

        this._lossLimit = new AutoplaySettingsBar({
            title: 'LOSS LIMIT:',
            value: this.data.autoplayLossLimit,
            onChanged: this.onChangeLossLimit.bind(this),
            maxValue: Math.POSITIVE_INFINITY,
            step: 10,
            valueFormatter: (value) => `${value}${services.session.currency ?? ''}`
        });

        window.addChild(this._gameLimit, this._winLimit, this._lossLimit);
        window.children.forEach((c, i) => {
            c.y = (c.height + 30) * i;
        });

        window.position.set(services.app.width / 2 - window.width / 2, 400);
        oldWindow.addChild(window);

        window = oldWindow;

        const startButton = window.addObject('ButtonWithTitle', {title: 'START'}, {x: 's50%', y: 830,  anchor: 0.5});
        startButton.on("clicked", this._onStartBtn_Click, this);
    }

    onChangeGameLimit(value) {
        this.data.autoplayGameLimit = value;
    }

    onChangeWinLimit(value) {
        this.data.autoplayWinLimit = value;
    }

    onChangeLossLimit(value) {
        this.data.autoplayLossLimit = value;
    }

    _onStartBtn_Click() {
        this.onStarted(this.data.autoplayGameLimit,  this.data.autoplayWinLimit,  this.data.autoplayLossLimit );
        this.close();
    }
}

export class AutoplaySettingsBar extends SuperContainer {
    constructor({title, value, onChanged, maxValue, step = 1, valueFormatter}) {
        super();

        this.value = value;
        this.onChangedCallback = onChanged;
        this.maxValue = maxValue;
        this.step = step;
        this.valueFormatter = valueFormatter;

        this.title = this.addObject('Text', {text: title, style: 'SettingSliderTitle'}, {anchor: {y: 0.5}});
        this.lessBtn = this.addObject('Button', {template: 'minus_btn_[ButtonState]'}, {x: 700, anchor: 0.5});
        this.lessBtn.on("clicked", this.onClickLesBtn, this);
        this.valueText = this.addObject('Text', {text: 0, style: 'SettingSliderValue'}, {x: this.lessBtn.x + 160, y:32, anchor: 0.5});
        this.moreBtn = this.addObject('Button', {template: 'plus_btn_[ButtonState]'}, {x:  this.valueText.x + 80, anchor: 0.5});
        this.moreBtn.on("clicked", this.onClickMoreBtn, this);
        this.valueText.text = value;

        this.setValueText(value);
    }

    setValueText(value) {
        this.valueText.text = this.valueFormatter ? this.valueFormatter(value) : value;
    }

    onClickLesBtn() {
        this.value -= this.step;

        if (this.value < 0) {
            this.value = 0;
        }

        this.setValueText(this.value);
        this.onChangedCallback(this.value);
    }

    onClickMoreBtn() {
        this.value += this.step;

        if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }

        this.setValueText(this.value);
        this.onChangedCallback(this.value);
    }
}
