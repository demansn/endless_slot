import {BasePopup} from "./BasePopup";
import gsap from "gsap";
import {Gender, SEXUAL_ORIENTATION} from "../constants";
import services from "../ServiceLocator";
import {SOUNDS} from "../constants/sounds";

export class IntroPopup extends BasePopup {
    static TYPE = {
        DOUBLE_LECHERY: 'Double_Lechery',
        FULL_PLEASURE: 'Full_Pleasure',
        NAUGHTY_CHARACTER: 'Naughty_Character',
        FREE_SPINS: 'FREE_SPINS',
    };

    create() {
        this.closeButton.visible = false;
    }
    show({type}) {
        super.show();
        const AnimationsByType = {
            [IntroPopup.TYPE.DOUBLE_LECHERY]: 'Other_Games/Double_Lechery_[TYPE]',
            [IntroPopup.TYPE.FULL_PLEASURE]: 'Other_Games/Full_Pleasure_[TYPE]',
            [IntroPopup.TYPE.NAUGHTY_CHARACTER]: 'Other_Games/Naughty_Character_[TYPE]',
            [IntroPopup.TYPE.FREE_SPINS]: 'Other_Games/FreeSpins_[TYPE]',
        };
        const isMan =this.data.isManPreferences;
        const animation = AnimationsByType[type].replace('[TYPE]', isMan ? 'guy' : 'girl');
        this.animation = this.addObject('SpineAnimation', {spine: 'Popup', animation}, {x: 's50%', y: 's50%'});
        this.animation.play();

        const tl = gsap.timeline();
        const animationDuration = this.animation.getAnimationDuration();

        this.alpha = 0;

        services.audio.playSfx(SOUNDS.bonus.start);

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
