import gsap from "gsap";
import {BasePopup} from "./BasePopup";
import {WinValueCounter} from "../lib/WinValueCounter";
import services from "../ServiceLocator";
import {Gender, SEXUAL_ORIENTATION} from "../constants";
import {SOUNDS} from "../constants/sounds";

export  class TotalWinPopup extends BasePopup {

    static TYPE = {

    }
    create() {
        this.closeButton.visible = false;
    }

    // Other_Games/Total_win_1_girl
// Other_Games/Total_win_1_guy
// Other_Games/Total_win_2_girl
// Other_Games/Total_win_2_guy
// Other_Games/Total_win_3_girl
// Other_Games/Total_win_3_guy

    show({win = 0, id = 1}) {
        super.show();
        services.audio.playSfx(SOUNDS.bonus.results);
        this.winValue = this.addObject('Text', {style: 'PopupWinText', text: '0'}, {anchor: 0.5, layer: 'overPopups'});

        this.winCounter = new WinValueCounter({value: 0, duration: 4, text:  this.winValue});
        this.winCounter.setWin(0);
        this.winCounter.countTo(win);

        const isMan =this.data.isManPreferences;
        const type = isMan ? 'guy' : 'girl';
        const animation = `Other_Games/Total_win_${id}_${type}`;
        const slotObjects = {
            "Popup/Popup_o_3": this.winValue
        }

        this.animation = this.addObject('SpineAnimation', {spine: 'Popup', animation, slotObjects}, {x: 's50%', y: 's50%'});
        this.animation.play(true);

        const tl = gsap.timeline();
        const animationDuration = this.animation.getAnimationDuration();

        this.alpha = 0;

        tl.to(this, {
            duration: 0.25,
            alpha: 1,
        });

        let sfx;
        tl.add(() => {
            sfx = services.audio.playSfx(SOUNDS.money.counting, {loop: true});
        });

        tl.to(this, {
            duration: 0.25,
            alpha: 0,
        }, `+=${animationDuration - 0.25}`);

        tl.add(() => this.close());

        tl.add(() => {
            if (sfx) {
                sfx.stop();
            }
        }, `${animationDuration - 1}`);

        return tl;
    }
}

