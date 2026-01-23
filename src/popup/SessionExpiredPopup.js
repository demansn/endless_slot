import {services} from "../ServiceLocator";
import {BasePopup} from "./BasePopup";

export class SessionExpiredPopup extends BasePopup {
    create({message}) {
        this.bg = this.addObject('SessionExpiredPopup', {}, {x: 's50%', y: 's50%', anchor: 0.5, zIndex: 0, zOrder: 0});
        this.closeButton.position.set(1298, 303);
        this.closeButton.visible = false;

        if ( services.config.homeLink || 1 ) {
            this.addObject('ButtonWithTitle', {title: 'RELOAD', onClick: this.onClick.bind(this)}, {x: 903, y: 892});
        }
    }

    onClick() {
        console.log( "SessionExpiredPopup.js | postMessage: goToHomePage#" + services.config.homeLink );
        if(window.parent.postMessage) window.parent.postMessage( "goToHomePage#" + services.config.homeLink, "*" );
    }
}
