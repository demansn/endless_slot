import {SuperContainer} from "../lib/objects/SuperContainer";
import {CHARACTER, Gender, SEXUAL_ORIENTATION} from "../constants";
import {CharacterAnimation} from "../gameObjects/CharacterAnimation";

export class SelectCharacterPopup extends SuperContainer {
    constructor() {
        super();

        this.addObject('SpineAnimation', {spine: 'Background', animation: 'Background2', autoPlay: true, loop: true}, {x: '50%', y: '50%'});

        this.mans  = this.addObject(SuperContainer, {}, {x: 575, y: 1445, visible: false});
        this.mans.addObject(Character, {isMan: true, name: CHARACTER.MAN1.name, onSelect: this.onSelect.bind(this)}, {x: 470});
        this.mans.addObject(Character, {isMan: true, name: CHARACTER.MAN2.name, onSelect: this.onSelect.bind(this)}, {x: 1046});
        this.mans.addObject(Character, {isMan: true, name: CHARACTER.MAN3.name, onSelect: this.onSelect.bind(this)}, {x: 1650});

        this.girls  = this.addObject(SuperContainer, {}, {x: 575, y: 1445,  visible: false});
        this.girls.addObject(Character, {name: CHARACTER.GIRL1.name, onSelect: this.onSelect.bind(this)}, {x: 470});
        this.girls.addObject(Character, {name: CHARACTER.GIRL2.name, onSelect: this.onSelect.bind(this)}, {x: 1046});
        this.girls.addObject(Character, {name: CHARACTER.GIRL3.name, onSelect: this.onSelect.bind(this)}, {x: 1650});
    }

    seSexualOrientation(orientation = SEXUAL_ORIENTATION.NORMAL, gender = Gender.MALE) {
        this.mans.visible = orientation === SEXUAL_ORIENTATION.GUY || (orientation === SEXUAL_ORIENTATION.NORMAL && gender === Gender.FEMALE);
        this.girls.visible = !this.mans.visible;

        if (this.mans.visible) {
            this.girls.destroy();
        } else {
            this.mans.destroy();
        }
    }

    onSelect(name) {
        this.emit('select', name);
    }
}

export class Character extends SuperContainer {
    constructor({isMan, name, onSelect}) {
        super();
        this.name = name;
        this.addObject(CharacterAnimation, {level: 1, isMan, number: name}, {x: 0, y: 0, scale: 0.8});
        const btn = this.addObject('Button', {template: 'selectCharacter_btn_[ButtonState]', onClick: () => onSelect(name)}, {x: 0, y: -128, anchor: {x: 0.5, y: 0}});

        btn.x = -btn.width / 2;
    }
}
