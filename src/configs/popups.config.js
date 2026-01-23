import OptionsPopup from "../popup/OptionsPopup";
import {WinPopup} from "../popup/WinPopup";
import {ErrorPopup} from "../popup/ErrorPopup";
import {NoFundsPopup} from "../popup/NoFundsPopup";
import {SessionExpiredPopup} from "../popup/SessionExpiredPopup";
import AutoplayPopup from "../popup/AutoplayPopup";
import {ShopPopup} from "../popup/shop/ShopPopup";
import {BetsPopup} from "../popup/bets/BetsPopup";
import {InfoPopup} from "../popup/info/InfoPopup";
import {TotalWinPopup} from "../popup/TotalWinPopup";
import {LevelUpPopup} from "../popup/LevelUpPopup";
import {IntroPopup} from "../popup/IntroPopup";

export const PopupsConfig = [{
        name: 'options',
        Class: OptionsPopup
    }, {
        name: 'win',
        Class: WinPopup
    }, {
        name: 'error',
        Class: ErrorPopup
    }, {
        name: 'noFunds',
        Class: NoFundsPopup
    }, {
        name: 'sessionExpired',
        Class: SessionExpiredPopup
    }, {
        name: 'autoplay',
        Class: AutoplayPopup
    }, {
        name: 'ShopPopup',
        Class: ShopPopup
    }, {
        name: 'bets',
        Class: BetsPopup
    }, {
        name: 'info',
        Class: InfoPopup
    }, {
        name: 'IntroPopup',
        Class: IntroPopup
    }, {
        name: 'TotalWinPopup',
        Class: TotalWinPopup
    }, {
        name: "LevelUpPopup",
        Class: LevelUpPopup
    }
];
