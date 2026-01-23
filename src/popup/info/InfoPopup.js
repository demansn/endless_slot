import {BasePopup} from "../BasePopup";
import {SymbolPayoutPage} from "./pages/SymbolPayoutPage";
import {InfoPage} from "./pages/InfoPage";
import {Gender, SEXUAL_ORIENTATION} from "../../constants";


export  class InfoPopup extends BasePopup {
    create() {
        this.bg = this.addObject('', {}, {anchor: 0.5, x: '58%', y: '50%'});
        this.title = this.addObject('Text', {text: 'BETS', style: 'PopupTitle'}, {y: 180, x: 's50%', anchor: 0.5, alpha: 0});
        this.content = this.addObject('SuperContainer', {}, {y: 260, x: 's50%'});

        /**
         * @type {Model}
         */
        const isMan =this.data.isManPreferences;

        const PAGES = [
            () => new SymbolPayoutPage(),
            () => new InfoPage({config: {name: isMan ? 'naughtyLevelManPage' : 'naughtyLevelGirlPage', x: 0, y:  -190, anchor: {x: 0.5}}}),
            () => new InfoPage({config: {name: isMan ? 'fullPleasureManPage' : 'fullPleasureGirlPage', x: -177, y: -386, anchor: {x: 0.5}}}),
            () => new InfoPage({config: {name: 'naughtyCharacterPage', x: 4, y: -388, anchor: {x: 0.5}}}),
            () => new InfoPage({config: {name: 'bonusesPage', x: 14, y: -190, anchor: {x: 0.5}}}),
            () => new InfoPage({config: {name: 'additionalPage', x: -8, y: -190, anchor: {x: 0.5}}}),
            () => new InfoPage({config: {name: 'doubleLecheryPage', x: -78, y: -190, anchor: {x: 0.5}}}),
        ];

        this.currentPageIndex = 0;
        this.pages = PAGES.map(Page => Page());
        this.pages.forEach( page => this.content.addChild(page));

        this._switchNextBtn = this.addObject('Button', {template: 'arrow_btn_[ButtonState]'}, {x: 1710, y: 's50%', anchor: 0.5, scale: {x:-1}});
        this._switchNextBtn.on("clicked", this._onSwitchNextScreen, this);

        this._switchPrevBtn = this.addObject('Button', {template: 'arrow_btn_[ButtonState]'}, {x: 200, y: 's50%', anchor: 0.5});
        this._switchPrevBtn.on("clicked", this._onSwitchPrevScreen, this);

        this.setCurrentPage(0);
    }

    setCurrentPage(index) {

        this.currentPageIndex = index;

        if (this.currentPageIndex > this.pages.length - 1) {
            this.currentPageIndex = 0;
        }

        if (this.currentPageIndex < 0) {
            this.currentPageIndex = this.pages.length - 1;
        }

        this.pages.forEach(page => page.visible = false);
        this.pages[this.currentPageIndex].visible = true;

        this.title.text = this.pages[this.currentPageIndex].name;
    }

    _onSwitchPrevScreen() {
        this.setCurrentPage(this.currentPageIndex - 1);
    }

    _onSwitchNextScreen() {
        this.setCurrentPage(this.currentPageIndex + 1);
    }
}
