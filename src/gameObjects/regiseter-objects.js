import {Mather} from "../lib/objects/Mather";
import {SpineAnimation} from "./SpineAnimation";
import {SuperContainer} from "../lib/objects/SuperContainer";
import {InlineBlock} from "../lib/objects/InlineBlock";
import {ProgressButton} from "../game/ui/ProgressButton";
import {ButtonWithTitle} from "./ButtonWithTitle";
import {Button} from "./Button";
import {VerticalBlock} from "../lib/objects/VerticalBlock";
import {Graphics} from "pixi.js";
import {VerticalLine} from "../lib/objects/VerticalLine";
import {Fill} from "./Fill";
import {BonusIcon} from "./bonusIcons/BonusIcon";
import {SwitchButton} from "./SwitchButton";
import {MoneyBar} from "../game/ui/MoneyBar";
import {FreeSpinsCounter} from "./hud/FreeSpinsCounter";
import {TimeView} from "../lib/TimeView";
import {LevelBar, LevelProgressBar} from "../game/ui/LevelBar";
import {Bonuses} from "../game/ui/Bonuses";
import SpinButton from "../state/SpinButton";
import {ValueField} from "../game/ValueField";
import {PreloaderLoadingBar} from "./PreloaderLoadingBar";

Mather.registerObjectConstructor('Graphics', Graphics);
Mather.registerObjectConstructor('SuperContainer', SuperContainer);
Mather.registerObjectConstructor('SpineAnimation', SpineAnimation);
Mather.registerObjectConstructor('InlineBlock', InlineBlock);
Mather.registerObjectConstructor('VerticalBlock', VerticalBlock);
Mather.registerObjectConstructor('ButtonWithTitle', ButtonWithTitle);
Mather.registerObjectConstructor('Button', Button);
Mather.registerObjectConstructor('VerticalLine', VerticalLine);
Mather.registerObjectConstructor('Fill', Fill);
Mather.registerObjectConstructor('SpinButton', SpinButton);

Mather.registerObjectFactory('LoadingBar', () => {
    return new PreloaderLoadingBar({fillPaddings: {  top: 26, left: 18 }});
});

Mather.registerObjectFactory('StartButton', (parameters) => {
    return new ButtonWithTitle({title: 'Start', ...parameters});
});

// HUD
Mather.registerObjectFactory('AutoSpinButton', () => {
    return new ProgressButton({title: 'AUTO'})
});

Mather.registerObjectFactory('RouletteBonus', () => {
    return new BonusIcon({icon: 'rouletteBonus', title: 'ROULETTE'});
});

Mather.registerObjectFactory('WildBonus_normal', (parameters) => {
    return new BonusIcon({icon: 'wildBonus_normal', title: 'WILD'});
});

Mather.registerObjectFactory('WildBonus_lesb', (parameters) => {
    return new BonusIcon({icon: 'wildBonus_lesb', title: 'WILD'});
});

Mather.registerObjectFactory('WildBonus_guy', (parameters) => {
    return new BonusIcon({icon: 'wildBonus_guy', title: 'WILD'});
});

Mather.registerObjectFactory('ScatterBonus_guy', (parameters) => {
    return new BonusIcon({icon: 'scatterBonus_guy', title: 'SCATTER'});
});

Mather.registerObjectFactory('ScatterBonus_normal', (parameters) => {
    return new BonusIcon({icon: 'scatterBonus_normal', title: 'SCATTER'});
});

Mather.registerObjectFactory('ScatterBonus_lesb', (parameters) => {
    return new BonusIcon({icon: 'scatterBonus_lesb', title: 'SCATTER'});
});

Mather.registerObjectFactory('AutoSpinButton', (parameters) => {
    return new ProgressButton({title: 'AUTO'})
});
Mather.registerObjectFactory('BetButton', ({bet, ...parameters}) => {
    return new ProgressButton({title:bet, value: 0, titleFormat: (b) => `BET\n${b}`, ...parameters})
});
Mather.registerObjectFactory('OptionsButton', (parameters) => {
    return new Button({template: "settings_btn_[ButtonState]", ...parameters});
});
Mather.registerObjectFactory('HomeButton', (parameters) => {
    return new Button({template: "home_btn_[ButtonState]", ...parameters});
});
Mather.registerObjectFactory('AccountButton', (parameters) => {
    return new Button({template: 'account_btn_[ButtonState]', ...parameters});
});
Mather.registerObjectFactory('InfoButton', (parameters) => {
    return new Button({template: "info_btn_[ButtonState]", ...parameters});
});
Mather.registerObjectFactory('MenuButton', (parameters) => {
    return new Button({template: "Menu_btn_[ButtonState]", ...parameters});
});
Mather.registerObjectFactory('SoundSwitch', (parameters) => {
    return new SwitchButton({template: 'sound_[SwitchState]_btn_[ButtonState]', ...parameters});
});
Mather.registerObjectFactory('BalanceField', (parameters) => {
    return new MoneyBar({title: 'BALANCE', value: 0, ...parameters});
});
Mather.registerObjectFactory('WinField', (parameters) => {
    return new MoneyBar({title: 'WIN', value: 0, ...parameters});
});
Mather.registerObjectFactory('FreeSpinsCounter', (parameters) => {
    return new FreeSpinsCounter({value: 0, ...parameters});
});
Mather.registerObjectFactory('BonusButton', (parameters) => {
    return new ButtonWithTitle({title: 'Bonus', ...parameters});
});
Mather.registerObjectFactory('DoubleLecheryWin', (parameters) => {
    return new MoneyBar({title: 'DOUBLE LECHERY WIN', value: 0, ...parameters});
});

Mather.registerObjectFactory('AnimationSpeedButton', (parameters) => {
    return new SwitchButton({template: 'slow_[SwitchState]_btn_[ButtonState]', ...parameters});
});

Mather.registerObjectFactory('TimeView', (parameters) => {
    return new TimeView({...parameters});
});

Mather.registerObjectFactory('BonusButton', (parameters) => {
    return new ButtonWithTitle({title: "Bonus", ...parameters});
});

Mather.registerObjectFactory('LevelBar', (parameters) => {
    return new LevelBar(parameters);
});

Mather.registerObjectFactory('Bonuses', (parameters) => {
    return new Bonuses(parameters);
});

Mather.registerObjectFactory('LevelProgressBar', (parameters) => {
    return new LevelProgressBar(parameters);
});

Mather.registerObjectFactory('ProgressLevelPoints', (parameters) => {
    return new ProgressLevelPoints(parameters);
});

Mather.registerObjectFactory('BalanceFieldMobile', (parameters) => {
    return new ValueField({title: 'BALANCE', ...parameters});
});

Mather.registerObjectFactory('WinFieldMobile', (parameters) => {
    return new ValueField({title: 'WIN', ...parameters});
});

Mather.registerObjectFactory('XPFieldMobile', (parameters) => {
    return new ValueField({title: 'XP', ...parameters});
});

Mather.registerObjectFactory('FreeSpinCounterMobile', (parameters) => {
    return new ValueField({title: 'FREESPINS', ...parameters});
});

Mather.registerObjectFactory('DoubleLecheryWinMobile', (parameters) => {
    return new ValueField({title: 'DOUBLE LECHERY WIN', value: 0, winFrame: true, ...parameters});
});

Mather.registerObjectFactory('ArrowButton', (parameters) => {
    return new Button({template: 'arrow_btn_[ButtonState]', ...parameters});
});


