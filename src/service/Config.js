import {Service} from "./Service";

export class ConfigService extends Service {
    init() {
        const kUrlParams = new URLSearchParams(window.location.search);

        const config = this.services.get('resources').get('config').data;

        Object.assign(this, config);

        this.isNoFundsPopup = kUrlParams.has("isNoFundsPopup");
        this.isActivatedFreespins = kUrlParams.has("activatedFreespins");
        this.depositLink = kUrlParams.has("depositLink") ? kUrlParams.get("depositLink") : null;
        this.homeLink = kUrlParams.has("homeLink") ? kUrlParams.get("homeLink") : null;
        this.isOfflineMode = kUrlParams.has("offline");
        this.isHD = kUrlParams.has("hd");
        this.resourcesResolutionSuffix = "";
    }
}
