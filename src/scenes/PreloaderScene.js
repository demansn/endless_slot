import {SuperContainer} from "../lib/objects/SuperContainer";
import {PreloaderBackground} from "../gameObjects/PreloaderBackground";
import {InfoPlayer} from "../preloader/InfoPlayer";
import {PreloaderLoadingBar} from "../gameObjects/PreloaderLoadingBar";
import {Signal} from "typed-signals";
import {SelectSexualOrientation} from "../preloader/SelectSexualOrientation";
import {SelectCharacterPopup} from "../preloader/SelectCharacterPopup";
import {SelectSexualOrientationInfo} from "../preloader/SelectSexualOrientationInfo";
import {Gender, SEXUAL_ORIENTATION} from "../constants";
import { ButtonWithTitle } from "../gameObjects/ButtonWithTitle";

export class PreloaderScene extends SuperContainer {
    /**
     * @type {ButtonWithTitle}
     */
    startButton;
    /**
     * @type {PreloaderLoadingBar}
     */
    progressBar;

    constructor() {
        super();
        this.name = "PreloaderScene";

        this.addObject(PreloaderBackground);

        this.preloadInfo = this.addObject(SuperContainer, {}, {visible: true});
        this.infoPlayer = this.preloadInfo.addObject(InfoPlayer, {}, {x: "s50%", y: "s1%"})
        this.progressBar = this.preloadInfo.addObject('LoadingBar', {}, {x: "s50%", y: "s80%"});
        this.startButton = this.preloadInfo.addObject("StartButton", {}, {x: "s50%", y: "s90%"});
        this.startButton.enabled = false;
        this.startButton.visible = false;

        this.onStart = new Signal();

        this.startButton.on('clicked', () => this.onStart.emit());
    }

    showStart() {
        this.preloadInfo.visible = false;

        this.selectOrientationPopup = this.addObject(SelectSexualOrientation, {}, {visible: true, x: 's50%', y: 's50%', scale:1});
        this.selectOrientationPopup.x  -= this.selectOrientationPopup.width / 2;
        this.selectOrientationPopup.y -= this.selectOrientationPopup.height / 2;
        this.selectOrientationPopup.on('ok', this.onSelectOrientation.bind(this));

        this.selectCharacterPopup = this.addObject(SelectCharacterPopup, {}, {visible: false, x: 's50%', y: 's50%'});
        this.selectCharacterPopup.pivot.set(this.selectCharacterPopup.width / 2, this.selectCharacterPopup.height / 2);
        this.selectCharacterPopup.on('select', this.onSelectCharacter.bind(this));

        this.message = this.addObject(SelectSexualOrientationInfo);
        this.message.on('ok', this.onClickOk.bind(this));
        this.message.visible = false;

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('autostart')) {
            this.data.yourGender =Gender.MALE;
            this.data.partnerGender = Gender.FEMALE;
            this.data.sexualOrientation = SEXUAL_ORIENTATION.NORMAL;

            this.onStart.emit();
        }
    }

    onSelectOrientation({yourGender, partnerGender, orientation}) {
        if (!yourGender || !partnerGender || !orientation) {
            this.message.visible = true;
            return;
        }

        this.data.sexualOrientation = orientation;
        this.data.yourGender = yourGender;
        this.data.partnerGender = partnerGender;

        this.selectCharacterPopup.seSexualOrientation(orientation, yourGender);
        this.infoPlayer.setSexualOrientation(this.data.sexualOrientation);
        this.selectOrientationPopup.visible = false;
        this.selectCharacterPopup.visible = true;
    }

    onSelectCharacter(character) {
        this.data.character = character;
        this.selectCharacterPopup.visible = false;
        this.startButton.enabled = true;
        this.startButton.visible = true;
        this.progressBar.visible = false;
        this.preloadInfo.visible = true;
    }

    updateProgress(progress) {
        this.progressBar.setProgress(progress);
    }

    onClickOk() {
        this.message.visible = false;
    }
}
