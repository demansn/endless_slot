import {services} from "../ServiceLocator";
import {BaseGameState} from "./BaseGameState";
import {Gender, SEXUAL_ORIENTATION} from "../constants";
import { PreloaderScene } from "../scenes/PreloaderScene";

export default class PreloaderState extends BaseGameState {
    isLoaderCompleted = false;
    _bfKeyDown = null;

    /**
     * @type {PreloaderScene}
     */
    scene;

    enter() {
        this.isLoaderCompleted = false;

        this._bfKeyDown = this.onDocumentKeyDown.bind(this);
        document.addEventListener("keydown", this._bfKeyDown);

        this.scene = this.root.addObject(PreloaderScene);
        this.scene.onStart.connect(this.startGame.bind(this));

       services.get('resources').load("main", {
           onLoaded: this.onLoaded.bind(this),
           onProgress: this.onLoaderProgress.bind(this)
       });
    }

    onLoaded() {
        this.isLoaderCompleted = true;
        this.scene.showStart();
    }

    startGame() {
        if (!this.isLoaderCompleted) {
            return
        }
        this.data.isManPreferences = this.data.partnerGender === Gender.MALE;
        this.owner.goTo('GameState');
    }

    exit() {
        super.exit();
        document.removeEventListener("keydown", this._bfKeyDown);
        this._bfKeyDown = null;
    }

    onLoaderProgress(progress) {
        this.scene.updateProgress(progress);
    }

    onDocumentKeyDown(event) {
        if (event.code === "Space") {
            this.startGame();
        }
    }
}
