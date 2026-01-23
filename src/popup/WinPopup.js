import {BasePopup} from "./BasePopup";
import {WinValueCounter} from "../lib/WinValueCounter";
import gsap from "gsap";
import {Gender, SEXUAL_ORIENTATION} from "../constants";
import services from "../ServiceLocator";
import {SOUNDS} from "../constants/sounds";

export const WinTypes = {
    BIG_WIN: 'bigwin',
    MEGA_WIN: 'megawin',
    ULTRA_WIN: 'ultrawin',
    JACKPOT: 'jackpot',
}

export class WinPopup extends BasePopup {
    create() {
        super.create();
        this.closeButton.visible = false
    }

    async show({winType = WinTypes.BIG_WIN, win = 0, ...options} = {}) {
        await super.show(options);

        this.bigWinValue = this.addObject('Text', {text: '', style: 'PopupWinText'}, {anchor: 0.5, pivot: {y: -0}, visible: false, layer: 'overPopups'});
        this.megaWinValue = this.addObject('Text', {text: '', style: 'PopupWinText'}, {anchor: 0.5, pivot: {y: -0}, visible: false, layer: 'overPopups'});
        this.ultraWinValue = this.addObject('Text', {text: '', style: 'PopupWinText'}, {anchor: 0.5, pivot: {y: -0}, visible: false, layer: 'overPopups'});
        this.jackpotWinValue = this.addObject('Text', {text: '', style: 'PopupWinText'}, {anchor: 0.5, pivot: {y: -0}, visible: false, layer: 'overPopups'});

        const tl = gsap.timeline();
        let countUpDuration = 0
        let sfx = null;
        const onStart = () => {
            sfx = services.audio.playSfx(SOUNDS.money.counting, {loop: true})
        };

        tl.to(this, {
            duration: 0.25,
            alpha: 1,
        }, 0.1);
        const firstAnim = this.getAnimation(WinTypes.BIG_WIN, this.bigWinValue);
        tl.add([
            firstAnim,
            () => services.audio.playSfx(SOUNDS.bigWins.big),
            () => onStart()
        ], 0);
        countUpDuration = firstAnim.duration();
        this.bigWinValue.visible = true;

        if ([WinTypes.MEGA_WIN, WinTypes.ULTRA_WIN, WinTypes.JACKPOT].includes(winType)) {
            this.ultraWinValue.visible = true;
            tl.add([
                this.getAnimation(WinTypes.ULTRA_WIN, this.ultraWinValue),
                () => services.audio.playSfx(SOUNDS.bigWins.ultra)
            ]);
            countUpDuration += countUpDuration;
        }

        if ([WinTypes.MEGA_WIN, WinTypes.JACKPOT].includes(winType)) {
            this.jackpotWinValue.visible = true;
            tl.add([
                this.getAnimation(WinTypes.JACKPOT, this.jackpotWinValue),
                () => services.audio.playSfx(SOUNDS.bigWins.jackpot)
            ]);
            countUpDuration +=( countUpDuration * 0.8);
        }

        if ([WinTypes.MEGA_WIN].includes(winType)) {
            this.megaWinValue.visible = true;
            tl.add([
                this.getAnimation(WinTypes.MEGA_WIN, this.megaWinValue),
                () => services.audio.playSfx(SOUNDS.bigWins.mega)
            ]);
            countUpDuration += (countUpDuration * 0.35);
        }

        tl.to(this, {
            duration: 0.25,
            alpha: 0,
            onComplete: () => {
                this.close();
            }
        });


        const onEnd = () => {
            if (sfx) {
                sfx.stop();
            }
        }

        this.winCounter = new WinValueCounter({
            onEnd,
            value: 0,
            duration: countUpDuration * 0.7,
            text:  [this.bigWinValue, this.megaWinValue, this.ultraWinValue, this.jackpotWinValue]
        });
        this.winCounter.setWin(0);
        this.winCounter.countTo(win);
    }

    getAnimation(skin, counter) {
        const animationsByType = {
            [WinTypes.BIG_WIN]: 'WIN/Big_Win_[TYPE]',
            [WinTypes.JACKPOT]: 'WIN/Jackpot_Win_[TYPE]',
            [WinTypes.MEGA_WIN]: 'WIN/Mega_Win_[TYPE]',
            [WinTypes.ULTRA_WIN]: 'WIN/Ultra_Win_[TYPE]',
        }
        const isMan = this.data.isManPreferences;
        const type = isMan ? 'guy' : 'girl';
        const name = animationsByType[skin].replace('[TYPE]', type);
        const animation = this.addObject('SpineAnimation', {spine: 'Popup', animation: name, slotObjects: {'Popup/Popup_o_3': counter}}, {x: 's50%', y: 's50%', alpha: 0});

        animation.gotToEnd();

        const timeLine = gsap.timeline();

        timeLine.add(animation.play(true), 0);
        timeLine.to(animation, {alpha: 1, duration: 0.1}, 0.1);
        timeLine.to(animation, {alpha: 0, duration: 0.1});

        return timeLine;
    }
}
