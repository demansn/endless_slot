import {SuperContainer} from "../lib/objects/SuperContainer";

export class CharacterAnimation extends SuperContainer {
    constructor({isMan, number, level}) {
        super();

        this.isMan = isMan;
        this.number = number;

        this.spine = this.addObject('SpineAnimation', {spine: 'Characters', animation: this.getAnimation(level), autoPlay: true, loop: true});
    }

    setLevel(level = 1) {
        this.setAnimation(this.getAnimation(level));
    }

    setAnimation(animation) {
        this.spine.setAnimation(animation);
        this.spine.play(true);
    }

    getAnimation(level = 1) {
        const gender = this.isMan ? 'Guy' : 'Girl';

        return `${gender}${this.number}/${gender}_${this.number}_lvl${level}`;
    }

    play(loop = true) {
        this.spine.play(loop);
    }

    stop() {
        this.spine.stop();
        this.spine.goToStart();
    }
}
