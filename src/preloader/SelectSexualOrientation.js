import {SuperContainer} from "../lib/objects/SuperContainer";
import {CheckBox, RadioGroup} from "@pixi/ui";
import {Gender, SEXUAL_ORIENTATION} from "../constants";
import {VerticalBlock} from "../lib/objects/VerticalBlock";
import {Rectangle} from "pixi.js";
import {SOUNDS} from "../constants/sounds";
import services from "../ServiceLocator";

function getCheckBox(onCheck, gender) {
    const checkBox = new CheckBox({
        style: {
            unchecked: `checkbox_checkbox_on`,
            checked: `checkbox_checkbox_off`,
        },
    });

    checkBox.onCheck.connect(() => {
        onCheck(checkBox.checked, gender);
    });

    checkBox.innerView.on('pointerover', () => {
        services.audio.playSfx(SOUNDS.ui.hover);
    });
    checkBox.innerView.on('pointerdown', () => {
        services.audio.playSfx(SOUNDS.ui.click);
    });

    // checkBox.scale.set(2.5);
    // checkBox.activeView.hitArea = checkBox.hitArea = new Rectangle(-100, -100, 200, 200);

    return checkBox;
}

export class SelectSexualOrientation extends SuperContainer {
    constructor() {
        super();

        this.addObject('SelectSexualOrientationBG', {}, {});
        this.addObject('Button', {template: 'ok_btn_[ButtonState]', onClick: this.onSelect.bind(this)}, {x: 417, y: 766});

        this.yourGenderMaleCheckBox = getCheckBox(this.onCheckYouGenderMale.bind(this), Gender.MALE);
        this.yourGenderFemaleCheckBox = getCheckBox(this.onCheckYouGenderMale.bind(this), Gender.FEMALE);

        this.parnerGenderMaleCheckBox = getCheckBox(this.onCheckPartnerGenderMale.bind(this), Gender.MALE);
        this.parnerGenderFemaleCheckBox = getCheckBox(this.onCheckPartnerGenderMale.bind(this), Gender.FEMALE);

        this.yourGender = this.addObject(VerticalBlock, {gap: 18}, {x: 730, y: 314});
        this.yourGender.addChild(this.yourGenderMaleCheckBox);
        this.yourGender.addChild(this.yourGenderFemaleCheckBox);

        this.parnerGender = this.addObject(VerticalBlock, {gap: 18}, {x: 730, y: 597});
        this.parnerGender.addChild(this.parnerGenderMaleCheckBox);
        this.parnerGender.addChild(this.parnerGenderFemaleCheckBox);

        this.yourGenderValue = null;
        this.parnerGenderValue = null;
    }

    onCheckYouGenderMale(checked, gender) {
        if (checked) {
            if (gender === Gender.MALE) {
                this.yourGenderFemaleCheckBox.forceCheck(!checked);
            } else {
                this.yourGenderMaleCheckBox.forceCheck(!checked);
            }

            this.yourGenderValue = gender;
        } else {
            this.yourGenderValue = null;
        }
    }

    onCheckPartnerGenderMale(checked, gender) {
        if (checked) {
            if (gender === Gender.MALE) {
                this.parnerGenderFemaleCheckBox.forceCheck(!checked);
            } else {
                this.parnerGenderMaleCheckBox.forceCheck(!checked);
            }

            this.parnerGenderValue = gender;
        } else {
            this.parnerGenderValue = null;
        }
    }

    onSelect() {
        const yourGender = this.yourGenderValue;
        const partnerGender = this.parnerGenderValue;
        let orientation = SEXUAL_ORIENTATION.NORMAL;

        if (yourGender === Gender.MALE && partnerGender === Gender.MALE) {
            orientation = SEXUAL_ORIENTATION.GUY
        } else if (yourGender ===  Gender.FEMALE && partnerGender === Gender.FEMALE) {
            orientation = SEXUAL_ORIENTATION.LESB
        }

        this.emit('ok', {yourGender, partnerGender, orientation});
    }
}
