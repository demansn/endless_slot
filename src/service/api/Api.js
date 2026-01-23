import {Service} from "../Service";
import {OfflineAPI} from "./OfflineAPI";
import {RemoteAPI} from "./RemoteAPI";

export class Api extends Service {
    #api;
    /**
     * @type {string}
     */
    #session = '';
    /**
     * @type {string}
     */
    #demo = '';

    init() {
        this.paramters = new URLSearchParams(window.location.search);
        const isOffline = this.paramters.has('offline');

        this.#demo = this.paramters.has("demo") ? this.paramters.get("demo") : '0';
        this.#session =  this.paramters.has("session") ? this.paramters.get("session") : '';

        this.#api = isOffline ? new OfflineAPI(this.services.get('gameMath'), this.gameConfig) : new RemoteAPI(this.services.get('gameMath'), this.gameConfig);
    }

    async spin(parameters) {
        const response = await this.#api.spin({...this.getDefaultPostParams(), ...parameters});

        console.log(response);
        
        return response;
    }

    async player(parameters) {
        return await this.#api.player({...this.getDefaultPostParams(), ...parameters});
    }

    async freeSpin(parameters, type) {
        return await this.#api.freeSpin({...this.getDefaultPostParams(), ...parameters}, type);
    }

    async superGame(parameters) {
        return await this.#api.superGame({...this.getDefaultPostParams(), ...parameters});
    }

    async buyBonus(parameters, ...args) {
        return await this.#api.buyBonus({...this.getDefaultPostParams(), ...parameters}, ...args);
    }

    async activateBonus(parameters, ...args) {
        return await this.#api.activateBonus({...this.getDefaultPostParams(), ...parameters}, ...args);
    }

    async getPayTable(parameters) {
        return await this.#api.getPayTable({...this.getDefaultPostParams(), ...parameters});
    }

    async finishDoubleLechery(parameters) {
        return await this.#api.finishDoubleLechery({...this.getDefaultPostParams(), ...parameters});
    }

    async activateReward(parameters) {
        return await this.#api.activateReward({...this.getDefaultPostParams(), ...parameters});
    }

    async getShopItems(parameters) {
        return await this.#api.getShopItems({...this.getDefaultPostParams(), ...parameters});
    }

    async getReadyBonuses(parameters) {
        return await this.#api.getReadyBonuses({...this.getDefaultPostParams(), ...parameters});
    }

    getDefaultPostParams() {
        return {
            session_uuid: this.#session,
            demo: this.#demo,
        };
    }
}
