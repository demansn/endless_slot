import {DataModel} from "../service/DataModel";
import {Plugins} from "../service/Plugins";
import {Api} from "../service/api/Api";
import {ResourceLoader} from "../service/ResourceLoader";
import {manifest} from "./resources-manifest";
import {ConfigService} from "../service/Config";
import {Session} from "../service/Session";
import {SavedData} from "../service/SavedData";
import {Styles} from "../service/Styles";
import {FontStylesConfig} from "./fontStyles.config";
import {GameLogic} from "../service/GameLogic";
import SpinTest from "../service/SpinTest";
import App from "../service/App";
import {GameLayers} from "../service/GameLayers";
import AudioManager from "../service/AudioManager";
import {SuperContainer} from "../lib/objects/SuperContainer";
import {PopupsManager} from "../service/PopupsManager";
import {PopupsConfig} from "./popups.config";
import {CurrencyFormatter} from "../service/CurrencyFormatter";
import {GameMath} from "../service/GameMath";
import {BonusesService} from "../service/ShopService";

export const Model = {
    yourGender: null,
    partnerGender: null,
    sexualOrientation: null,
    character: 1,
    bet: 1,
    musicVolume: 50,
    soundsVolume: 50,
    animationSpeed: 0,
    isSpeedAnimation: false,
    isMute: false,
    isElementAnimation: true,
    isWinAnimation: true,
    autoplayGameLimit: 30,
    autoplayWinLimit: 250,
    autoplayLossLimit: 120,
    isManPreferences: false,
    balance: 0,
    bonusGames: [],
    freeSpinAutoSpin: true
};
export const services = {
    data: {Service: DataModel, options: {data: Model, dontSaveKeys: ['yourGender', 'partnerGender', 'sexualOrientation', 'character']}},
    gameConfig: {Service: ({gameConfig}) => gameConfig},
    gameMath: {Service: GameMath},
    plugins: {Service: Plugins},
    api: {Service: Api},
    resources: {Service: ResourceLoader, options: {manifest}},
    config: {Service: ConfigService},
    session: {Service: Session},
    saved: {Service: SavedData},
    styles: {Service: Styles, options: FontStylesConfig},
    shop: {Service: BonusesService},
    gameLogic: {Service: GameLogic},
    // TODO move to game logic
    spinTest: {Service: SpinTest},
    app: {Service: App},
    layers: {Service: GameLayers, options: {layers: ['default', 'underReels', 'reels', 'overReel', 'paylineLayer',  'symbolsAnimationLayer', 'hud', 'popups', 'overPopups']}},
    audio: {Service: AudioManager},
    superContainerInit: {
        Service: ({services}) => {
            SuperContainer.textures = services.get('resources');
            SuperContainer.styles = services.get('styles');
            SuperContainer.layers = services.get('layers');
            SuperContainer.screenSize = services.get('app').gameSize;
            SuperContainer.rendererSize = {
                width: services.get('app').renderer.width,
                height: services.get('app').renderer.height
            };
            SuperContainer.data = services.get('data');
        }
    },
    popups: {Service: PopupsManager, options: {popups: PopupsConfig}},
    currencyFormatter: {Service: CurrencyFormatter},
}
