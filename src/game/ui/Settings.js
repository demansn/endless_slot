import {SuperContainer} from "../../lib/objects/SuperContainer";
import services from "../../ServiceLocator";
export default class Settings extends SuperContainer {
    constructor() {
        super();

        this.content = this.addObject('InlineBlock', {gap: -9, horizontalAlign: "center", verticalAlign: "middle"}, {y: -5});
        this.content.addObject('OptionsButton', {}, {scale: 0.5});
         this.content.addObject('InfoButton', {}, {scale: 0.5});
        this.content.addObject('SoundSwitch', {value:  this.data.isMute}, {scale: 0.5});
        this.content.addObject('HomeButton', {}, {visible: Boolean(services.config.homeLink || true), scale: 0.5});
        this.content.layout();
    }
}
