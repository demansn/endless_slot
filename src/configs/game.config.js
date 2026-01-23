import LogoState from "../state/LogoState";
import PreloaderState from "../state/PreloaderState";
import GameState from "../state/GameState";
import GameStates from "../state/game/GameStates";
import {Idle} from "../state/game/states/Idle";
import {Spinning} from "../state/game/states/Spinning";
import {WinPresentation} from "../state/game/states/WinPresentation";
import {Restore} from "../state/game/states/Restore";
import {ErrorState} from "../state/game/states/ErrorState";
import {services} from "./services.config";
import {slotConfig} from "./slot.config";
import {FreespinIntro} from "../state/game/states/FreespinIntro";
import {FreespinOutro} from "../state/game/states/FreespinOutro";
import {FreespinSpinning} from "../state/game/states/FreespinSpinning";
import {FreespinWinPresentation} from "../state/game/states/FreespinWinPresentation";
import {ButtonWithTitle} from "../gameObjects/ButtonWithTitle";
import {BonusGameNaughtyCharacterIntro} from "../state/game/states/BonusGameNaughtyCharacterIntro";
import {BonusGameNaughtyCharacterGame} from "../state/game/states/BonusGameNaughtyCharacterGame";
import {BonusGameDoubleLecheryIntro} from "../state/game/states/BonusGameDoubleLecheryIntro";
import {BonusGameDoubleLecherySpinning} from "../state/game/states/BonusGameDoubleLecherySpinning";
import {BonusGameDoubleLecheryOutro} from "../state/game/states/BonusGameDoubleLecheryOutro";
import {BonusGameDoubleLecheryWinPresentation} from "../state/game/states/BonusGameDoubleLecheryWinPresentation";
import {ShopState} from "../state/game/states/ShopState";
import {BonusGameDoubleLecheryFinal} from "../state/game/states/BonusGameDoubleLecheryFinal";
import {LevelReward} from "../state/game/states/LevelReward";
import {FreespinIdle} from "../state/game/states/FreespinIdle";

export const gameObjects = {
    TurnOverButton: {
        Class: ButtonWithTitle,
        options: {
            title: 'Turn Over',
        }
    }
}

export const GameConfig = {
    services,
    gameObjects,
    states: {
        LogoState: LogoState,
        PreloaderState: PreloaderState,
        GameState: {
            Class: GameState,
            states: {
                [GameStates.IDLE]: Idle,
                [GameStates.SPINNING]: Spinning,
                [GameStates.WINNING]: WinPresentation,
                [GameStates.RESTORE]: Restore,
                [GameStates.ERROR]: ErrorState,
                [GameStates.FREE_SPIN_INTRO]: FreespinIntro,
                [GameStates.FREE_SPIN_OUTRO]: FreespinOutro,
                [GameStates.FREE_SPIN_SPINNING]: FreespinSpinning,
                [GameStates.FREE_SPIN_IDLE]: FreespinIdle,
                [GameStates.FREE_SPIN_WINNING]: FreespinWinPresentation,
                [GameStates.BonusGameNaughtyCharacterIntro]: BonusGameNaughtyCharacterIntro,
                [GameStates.BonusGameNaughtyCharacterGame]: BonusGameNaughtyCharacterGame,
                [GameStates.BonusGameDoubleLecheryIntro]: BonusGameDoubleLecheryIntro,
                [GameStates.BonusGameDoubleLecheryOutro]: BonusGameDoubleLecheryOutro,
                [GameStates.BonusGameDoubleLecheryWinPresentation]: BonusGameDoubleLecheryWinPresentation,
                [GameStates.BonusGameDoubleLecherySpinning]: BonusGameDoubleLecherySpinning,
                [GameStates.BonusGameDoubleLecheryFinal]: BonusGameDoubleLecheryFinal,
                [GameStates.ShopState]: ShopState,
                [GameStates.LevelReward]: LevelReward,
            }
        },
    },
    serverUrl: 'https://api.arctic-fight.crazymonkey.club/api/v1',
    symbolWidth: 213,
    symbolHeight: 230,
    ...slotConfig
}

