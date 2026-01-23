import services from "../ServiceLocator";
import {BasePopup} from "./BasePopup";

export class NoFundsPopup extends BasePopup {
    create() {
        this.bg = this.addObject('NotEnoughFundsPopup', {}, {x: 's50%', y: 's50%', anchor: 0.5, zIndex: 0, zOrder: 0});
        this.closeButton.position.set(1303, 252);

        if ( services.config.homeLink || 1 ) {
             this.addObject('ButtonWithTitle', {title: 'DEPOSIT', onClick: this.onClick.bind(this)}, {x: 960, y: 892});
        }
    }

    onClick() {
        console.log( "NoFundsPopup.js | postMessage: goToHomePage#" + services.config.depositLink );
        if(window.parent.postMessage) window.parent.postMessage( "goToHomePage#" + services.config.depositLink, "*" );
    }
}
