import {SuperContainer} from "../lib/objects/SuperContainer";
import services from "../ServiceLocator";

export class VitalOrigin extends SuperContainer {
    constructor() {
        super({
            textures: services.get('resources'),
            styles: services.get('styles'),
            layers: services.get('layers'),
            screenSize: services.get('app').screenSize
        });
    }
}
