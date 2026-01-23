import services from "../ServiceLocator";
import {SuperContainer} from "../lib/objects/SuperContainer";
import {Service} from "./Service";

export class PopupsManager extends Service {
    /**
     * @type {BasePopup}
     */
    currentPopup = null;

    constructor(props) {
        super(props);

        this.configs = [];

        this.options.popups.forEach((popupConfig) => {
            this.configs[popupConfig.name] = popupConfig;
        });
    }

    init() {
        const stage = services.get('app').stage;
        const layers = services.get('layers');

        this.root = new SuperContainer();
        this.root.name = 'Popups';
        this.root.parentLayer = layers.get('popups');
        this.root.zOrder = 1000;
        this.root.zIndex = 1000;

        stage.addChild(this.root);
    }

    isShownPopup() {
        return this.currentPopup !== null;
    }

    getPopupConfig(name) {
        if (!this.configs[name]) {
            throw new Error(`Popup with name ${name} not found`);
        }

        return this.configs[name];
    }

    async showPopup(name, options = {}) {
        if (this.currentPopup) {
            await this.currentPopup.close();
        }

        const {Class, ...config} = this.getPopupConfig(name);

        this.currentPopup = new Class({...config, ...options});
        this.root.addChild(this.currentPopup);

        this.currentPopup.show(options);

        return new Promise((resolve) => {
            this.currentPopup.once('closed', resolve);
            this.currentPopup.once('closed', this.removeCurrentPopup.bind(this));
        });
    }

    removeCurrentPopup() {
        if (this.currentPopup) {
            this.root.removeChild(this.currentPopup);
            this.currentPopup.destroy({children: true});
            this.currentPopup = null;
        }
    }
}
