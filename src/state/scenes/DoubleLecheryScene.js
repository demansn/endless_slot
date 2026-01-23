import {gsap} from "gsap";
import {SuperContainer} from "../../lib/objects/SuperContainer";
import {InlineBlock} from "../../lib/objects/InlineBlock";
import {BLEND_MODES} from "pixi.js";
import services from "../../ServiceLocator";
import {SOUNDS} from "../../constants/sounds";

export class DoubleLecheryScene extends SuperContainer {
    constructor() {
        super();

        this.bg = this.addObject('Fill', {alpha: 0.9});
        this.content = this.addObject(InlineBlock, {verticalAlign: 'center', horizontalAlign: 'middle'}, {x: 's50%', y: 's50%'});
        this.content.sortableChildren = true;
        this.cards = [
            this.content.addObject(BonusCard, {index: 0, onClick: this.onCardClick.bind(this)}),
            this.content.addObject(BonusCard, {index: 1, onClick: this.onCardClick.bind(this)}),
            this.content.addObject(BonusCard, {index: 2, onClick: this.onCardClick.bind(this)}),
            this.content.addObject(BonusCard, {index: 3, onClick: this.onCardClick.bind(this)}),
        ];

        this.content.layout();
        this.content.x -= this.content.width / 2;
        this.content.y -= this.content.height / 2;
    }

    onCardClick(index) {
        this.emit('cardClick', index);
    }

    openCard(index, multiplier) {
        this.cards.forEach((card, i) => {
            if (i !== index) {
                card.diactivate(0.5);
                card.zIndex = 0;
            }
        });
        const animationsByMultiplier = {
            0: 'X0',
            1: 'X1',
            2: 'X2',
            0.5: 'X1.5',
        };

        this.cards[index].zIndex = 1;

        return gsap.timeline()
            .add(this.cards[index].playTurnOver(animationsByMultiplier[multiplier]))
            .add({}, '+=2.5')
    }

    reset() {
        this.cards.forEach(card => card.reset());
    }

    show() {
        this.visible = true;
        this.alpha = 0;
        return gsap.to(this, {alpha: 1, duration: 0.25});
    }

    hide() {
        return gsap.to(this, {alpha: 0, duration: 0.25, onComplete: () => {
                this.visible = false;
                this.reset();
            }});
    }
}

export class BonusCard extends SuperContainer {
    constructor({index, onClick}) {
        super();

        this.hilightContainer = this.addObject(SuperContainer, {}, {x: 127 + 88, y: -95, alpha: 0, visible: false});
        this.hilightContainer.addObject('light', {}, {anchor: {x: 0.5}, y: -485, blendMode: BLEND_MODES.ADD_NPM});
        this.hilightContainer.addObject('light', {}, {anchor: {x: 0.5}, y: 85});

        this.active = this.addObject('cardActive');
        this.inactive = this.addObject('cardInactive', {}, {alpha: 0});
        this.actionButton = this.addObject('ButtonWithTitle', {title: 'TURN OVER', onClick: ()=> onClick(index)}, {});
        this.actionButton.x = 225;
        this.actionButton.y = this.active.height;
        this.animationContainer = this.addObject(SuperContainer, {}, {x: 234, y: this.active.height / 2, alpha: 0});

        this.hilightContainer.x = this.active.width / 2;
    }

    playTurnOver(animation) {
        const timeline = gsap.timeline();

        this.actionButton.visible = false;
        this.hilightContainer.visible = true;

        timeline.add([
            () => {
                services.audio.playSfx(SOUNDS.special.card);
                this.playSpineAnimation(animation);
            },
            gsap.to(this.active, {alpha: 0, duration: 0.2}),
            gsap.to(this.animationContainer, {delay: 0.1, alpha: 1, duration: 0.2}),
        ]).add([
            gsap.to(this.hilightContainer, {alpha: 1, duration: 0.25}),
            gsap.to(this.animationContainer.scale, {x: 1.1, y: 1.1, duration: 0.25}),
        ], '+=0.2');

        return timeline;
    }

    diactivate(delay = 0) {
        this.actionButton.visible = false;

        gsap.timeline({delay}).add([
            gsap.to(this.inactive, {alpha: 1, duration: 0.5}),
             gsap.to(this.active, {alpha: 0, duration: 0.5}),
            gsap.to(this, {alpha: 0.8, duration: 0.5}),
        ])
    }

    playSpineAnimation(animation) {
        this.animation = this.animationContainer.addObject('SpineAnimation', {spine: 'OtherGames', animation});
        return this.animation.play();
    }

    reset() {
        this.actionButton.visible = true;
        this.hilightContainer.visible = false;
        this.hilightContainer.alpha = 0;
        this.animationContainer.alpha = 0;
        this.animationContainer.scale.set(1);
        this.animationContainer.removeChild(this.animation);
        this.active.alpha = 1;
        this.inactive.alpha = 0;
        this.alpha = 1;
    }
}
