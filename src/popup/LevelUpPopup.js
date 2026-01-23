import {BasePopup} from "./BasePopup";
import gsap from "gsap";
import {BONUSES, Gender, SEXUAL_ORIENTATION} from "../constants";
import services from "../ServiceLocator";
import {SOUNDS} from "../constants/sounds";

// Other_Games/Double_Lechery_girl
// Other_Games/Double_Lechery_guy
// Other_Games/Full_Pleasure_girl
// Other_Games/Full_Pleasure_guy
// Other_Games/Naughty_Character_girl
// Other_Games/Naughty_Character_guy

// WIN/Big_Win_girl
// WIN/Big_Win_guy
// WIN/Jackpot_Win_girl
// WIN/Jackpot_Win_guy
// WIN/Mega_Win_girl
// WIN/Mega_Win_guy
// WIN/Ultra_Win_girl
// WIN/Ultra_Win_guy


// const ANIMATIONS = {
//     LEVLE/LVLUP_1-2_freespines
// LEVLE/LVLUP_2-3_freespines
// LEVLE/LVLUP_2-3_FULLPLEASURE_girl
// LEVLE/LVLUP_2-3_FULLPLEASURE_guy
// LEVLE/LVLUP_3-4_freespines
// LEVLE/LVLUP_3-4_FULLPLEASURE_girl
// LEVLE/LVLUP_3-4_FULLPLEASURE_guy
// LEVLE/LVLUP_4-5_DOUBlE_LECHERY
// LEVLE/LVLUP_4-5_freespines
// LEVLE/LVLUP_5-6_DOUBlE_LECHERY
// LEVLE/LVLUP_5-6_freespines
// LEVLE/LVLUP_5-6_NAUGHTY_CHARACTER_girl
// LEVLE/LVLUP_5-6_NAUGHTY_CHARACTER_guy
// }

const WIN = {
    [BONUSES.FREE_SPINS]: 'freespines',
    [BONUSES.FULL_PLEASURE]: 'FULLPLEASURE_[TYPE]',
    [BONUSES.DOUBLE_LECHERY]: 'DOUBlE_LECHERY',
    [BONUSES.NAUGHTY_CHARACTER]: 'NAUGHTY_CHARACTER_[TYPE]',
};

export class LevelUpPopup extends BasePopup {
    create() {
        this.closeButton.visible = false;
    }
    show({ current, next, winType = BONUSES.FREE_SPINS }) {
        super.show();

        const isMan =this.data.isManPreferences;
        const type = isMan ? 'guy' : 'girl';
        const end = WIN[winType].replace('[TYPE]', type);
        const animation = `LEVLE/LVLUP_${current}-${next}_${end}`;

        this.animation = this.addObject('SpineAnimation', {spine: 'Popup', animation}, {x: 's50%', y: 's50%'});
        this.animation.play();

        const tl = gsap.timeline();
        const animationDuration = this.animation.getAnimationDuration();

        this.alpha = 0;

        services.audio.playSfx(SOUNDS.level.upPopup);

        tl.to(this, {
            duration: 0.25,
            alpha: 1,
        });

        tl.to(this, {
            duration: 0.25,
            alpha: 0,
        }, `+=${animationDuration - 0.25}`);

        tl.add(() => this.close());
    }
}
