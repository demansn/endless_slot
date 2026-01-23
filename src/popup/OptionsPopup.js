import {BasePopup} from "./BasePopup";
import {SettingSlider} from "./options/SettingSlider";
import {CheckBoxWithLabel} from "./options/CheckBoxWithLabel";
import services from "../ServiceLocator";

export default class OptionsPopup extends BasePopup {
    create() {
        this.closeButton.position.set(1631, 162);
        this.bg = this.addObject('PopupBG', {}, {anchor: 0.5, x: 's50%', y: 's50%'});
        this.title = this.addObject('Text', {text: 'OPTIONS', style: 'PopupTitle'}, {y: 155, x: 's50%', anchor: 0.5});
        this.content = this.addObject("VerticalBlock", {gap: 50, horizontalAlign: "center", verticalAlign: "middle", lineHeight: 300}, {name: 'content', y: 400, x: 's50%'});
        this.content.addObject(SettingSlider,
            {title: 'MUSIC VOLUME', value: this.data.musicVolume, onChanged: this._onMusicSlider_Changed.bind(this)}
        );
        this.content.addObject(SettingSlider,
            {title: 'SOUND VOLUME', value: this.data.soundsVolume, onChanged: this._onSoundsSlider_Changed.bind(this)}
        );
        this.content.addObject(SettingSlider,
            {title: 'ANIMATION SPEED', value: this.data.animationSpeed, onChanged: this._onSpeedSlider_Changed.bind(this)}
        );

        this.checkBoxLine = this.addObject('InlineBlock', {gap: 70, horizontalAlign: "center", verticalAlign: "middle", lineHeight: 50, lineWidth: 1000}, {y: this.content.y + this.content.height + 50, x: 's50%'});
        this.checkBoxLine.addObject(CheckBoxWithLabel, {
            onChange: this._onWinAnimationCheckBox_Changed.bind(this),
            label: 'WIN ANIMATION',
            value: this.data.isWinAnimation
        });
        this.checkBoxLine.addObject(CheckBoxWithLabel, {
            onChange: this._onElementAnimationCheckBox_Changed.bind(this),
            label: 'ELEMENT ANIMATION',
            value: this.data.isElementAnimation
        });
        this.checkBoxLine.pivot.y -= this.checkBoxLine.height / 2;

        this.content.x -= this.content.width / 2;
        this.checkBoxLine.x -= this.checkBoxLine.width / 2 - 60;
    }

    _onMusicSlider_Changed(value) {
        this.data.musicVolume = value;
        services.audio.changeMusicVolume(value / 100);
    }

    _onSoundsSlider_Changed(value) {
        this.data.soundsVolume = value;
        services.audio.changeSFXVolume(value / 100);
    }

    _onSpeedSlider_Changed(value) {
        this.data.animationSpeed = value;
    }

    _onElementAnimationCheckBox_Changed(value) {
        this.data.isElementAnimation = value;
    }

    _onWinAnimationCheckBox_Changed(value) {
        this.data.isWinAnimation = value;
    }
}
