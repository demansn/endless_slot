import {Container, Sprite} from "pixi.js";
import gsap from "gsap";
import {SpineAnimation} from "../gameObjects/SpineAnimation";

export class WinCounter extends Container {
    constructor() {
        super();

        this.counters = [];

        for (let i = 0; i < 4; i++) {
            const counter = this.createCounter();

            counter.x = counter.width / 2;
            counter.y = ( i) * (counter.height * 0.5);
            counter.positionY = (i) * (counter.height * 0.5);

            this.addChild(counter);
            this.counters.push(counter);
        }
    }

    createCounter(){
        const star = new SpineAnimation({spine: 'Effects', animation: 'Stars/Stars1'});

        star.gotToEnd();
        star.visible = false;

        return star;
    }

    showNext(number) {
        this.show(number - 1);

        const current = this.counters.filter((counter) => counter.visible).length;


       if (current >= number) {
            return;
        }

        const count = this.counters.find((counter) => !counter.visible);

        if (!count) {
            return;
        }

        count.visible = true;

        if (!count.isPlaying) {
            count.play(true);
        }

        return this.move(count);
    }

    show(number) {
        this.counters.forEach((counter, index) => {
            gsap.killTweensOf(counter);
            counter.visible = index < number;
            counter.y = counter.positionY;
            counter.x = 0;
            counter.scale.set(1);
            counter.alpha = 1;

            if (counter.visible && !counter.isPlaying) {
                counter.play(true);
            }
        });
    }

    hide() {
        this.counters.forEach((counter) => {
            counter.visible = false;
            counter.stop();
            counter.y = counter.positionY;
            gsap.killTweensOf(counter);
        });
    }

    move(count) {
        // relative screen center
        const screenCenter = {
            x: - 550,
            y: 140
        };

        const duration = 0.5;

       return gsap
           .timeline()
           .set(count, {...screenCenter, alpha: 0.4})
           .set(count.scale, {x: 5, y: 5})
           .add([
                gsap.to(count.scale, {x: 1, y: 1, duration}),
                gsap.to(count, {y: count.positionY, x: 0, alpha:1, duration})
           ])
    }
}
