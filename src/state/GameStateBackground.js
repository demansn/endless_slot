import gsap from "gsap";
import {SuperContainer} from "../lib/objects/SuperContainer";
import {CHARACTER, Features, Gender} from "../constants";
import {CharacterAnimation} from "../gameObjects/CharacterAnimation";
import services from "../ServiceLocator";

export class GameStateBackground extends SuperContainer {
    constructor({level}) {
        super();

        this.bagrounds = {
            [Features.MAIN_GAME]: this.createBackground('Background1'),
            [Features.FREE_SPINS]: this.createBackground('Background4'),
            [Features.FULL_PLEASURE]: this.createBackground('Background4'),
            [Features.DOUBLE_LECHERY]: this.createBackground('Background3'),
        };

        this.character = this.addObject(CharacterAnimation, {isMan:  this.data.partnerGender === Gender.MALE, level, number:  this.data.character}, { layer: 'underReels', x: 1816, y: 1080});

        if (services.app.isMobileDevice) {
            this.character.scale.set(0.9);
            const MAX_WIDTH = Math.min(services.app.renderer.width, 2600);
            const dx = (MAX_WIDTH - services.app.gameSize.width) / 2;
            this.character.x = Math.max(1800, MAX_WIDTH - dx - this.character.width * 0.3);
        }

        for (let key in this.bagrounds) {
            this.bagrounds[key].visible = false;
        }

        this.currentBg = this.bagrounds[Features.MAIN_GAME];
        this.currentBg.visible = true;
        this.currentBg.alpha = 1;
        this.currentBg.play(true);

        if (!this.data.isElementAnimation) {
            this.character.stop();
        }

        this.data.on('isElementAnimation', (value) => {
           if (value) {
               this.character.play(true);
           } else {
                this.character.stop();
           }
        });
    }

    toggleTo(name, force) {
        return this.toggleBg(this.currentBg, this.bagrounds[name], force);
    }

    toggleBg(from, to, force) {
        const duration = 0.5;

        this.currentBg = to;

        if (force) {
            to.visible = true;
            to.alpha = 1;

            from.visible = false;

            return
        }

        to.visible = true;
        to.alpha = 0;
        to.play(true);

        return gsap.timeline()
            .add([
                gsap.to(to, {alpha: 1, duration}),
                gsap.to(from, {alpha: 0, duration})
            ])
            .add(() => {
                from.visible = false;
                from.stop();
            });
    }


    setCharacterLevel(level = 1) {
        this.character.setLevel(level);
    }

    createBackground(animation) {
        return this.addObject('SpineAnimation', {spine: 'Background', animation, autoPlay: false, loop: true}, {x: 's50%', y: 's50%'});
    }
}
