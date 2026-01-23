import {Service} from "./Service";
import Utils from "../Utils";
import {Signal} from "typed-signals";
import { BonusesService } from "./ShopService";
import {FREE_SPINS_TYPES} from "./api/OfflineAPI";

export const BonusItemStatus = {
    PURCHASED: 'purchased',
    ACTIVATED: 'activated',
    DEFAULT: 'default',
}

export class GameLogic extends Service {
    constructor(parameters) {
        super(parameters);
        const {symbols, rows, columns, bets} = parameters.gameConfig;

        this.api = parameters.services.get('api');
        this.math = parameters.services.get('gameMath');
        /**
         * @type {BonusesService}
         */
        this.bonuses = parameters.services.get('shop');
        this.data = parameters.services.get('data');
        this.bets = bets;
        this.urlParams = new URLSearchParams( window.location.search );
        this.balance = this.urlParams.has("balance") ? Utils.tryParse(this.urlParams.get("balance")) : 0;
        this.symbols = symbols;
        this.rows = rows;
        this.cols = columns;
        this.parameters = parameters;

        this.freeSpins = new FreeSpinsData([FREE_SPINS_TYPES.NORMAL, FREE_SPINS_TYPES.DOUBLE_LECHERY, FREE_SPINS_TYPES.FULL_PLEASURE]);
        this.bet = 0.5;

        this.superGames = [];
        this.levels = [];
        this.xp = 0;
        this.maxXP = 0;

        this.onError = new Signal();
    }

    get balance() {
        return this.data.balance;
    }

    set balance(value) {
        this.data.balance = value;
    }

    getCurrentLevelByXP(xp = this.xp) {
        let currentLevel = 1;

        const levels = [...this.levels].sort((a, b) => b.level - a.level);

        for (let i = 0; i < levels.length; i++) {
            const levelInfo = levels[i];
            if (xp >= levelInfo.xp) {
                return levelInfo.level;
            }
        }

        return currentLevel;
    }

    getProgress(xp) {
        return xp / this.maxXP * 100;
    }

    getPlayerLevel() {
        return {
            xp: this.xp,
            current: this.level,
            progress: this.getProgress(this.xp),
        }
    }

    async getPayTable() {
        return await this.api.getPayTable({bet: this.bet});
    }

    async player() {
        const parameters = {
            balance: this.balance
        };
        const {
            doubleLecheryFinals = [],
            rewards = [],
            level,
            balance, superGames = [], bonuses = [], last_spin, freeSpins, total_win, xp, levels, ...rest
        } = await this.api.player(parameters);

        this.balance = this.balance;
        this.totalWin = total_win || 0;

        this.freeSpins.setFreeSpins(freeSpins);

        if (superGames.length) {
            this.superGames.push(...superGames);
        }

        if (rewards && rewards.length) {
            this.setRewards(rewards);
        }

        this.bonuses.setItems({ bonuses });
        this.doubleLecheryFinals = doubleLecheryFinals;

        this.lastSpin = last_spin && last_spin.length > 0 ? this.math.spinElementsToMatrix(last_spin) : null;
        this.xp = xp || 0;
        this.levels = levels || this.levels;
        this.maxXP = this.levels[this.levels.length - 1].xp;
        this.level = level || this.getCurrentLevelByXP(this.xp);

        if (this.xp > this.maxXP) {
            this.maxXP = this.xp;
        }
    }

    checkError(response) {
        if (response.custom_message === '-1') {
            this.balance += this.bet;
            throw {
                custom_message: response.custom_message,
                message: 'Server error',
                code: 'reject'
            }
        }

        if (response.custom_message) {
            throw {
                custom_message: response.custom_message,
                message: 'Server error',
                code: 'internal_error'
            }
        }


        if (response.error || response.status === 'error') {
            throw {
                message: 'Server error',
                code: 'internal_error'
            }
        }
    }

    async spin() {
        const parameters = this.getDefaultPostParams();

        if (!this.canBet()) {
            throw {
                message: 'Not enough balance',
                code: 'not_enough_balance'
            };
        }

        this.balance -= this.bet;

        if (this.balance < 0) {
            this.balance = 0;
        }

        const response = await this.api.spin({...parameters, bet: this.bet});

        this.checkError(response);

        this.balance = response.after_balance;
        this.xp = response.xp;

        if (this.xp > this.maxXP) {
            this.maxXP = this.xp;
        }

        const {rewards = []} = response;

        if (response.total_win !== undefined) {
            this.totalWin = response.total_win;
        }
        if (response.bonuses) {
            this.bonuses.setItems({ bonuses: response.bonuses });
        }
        if (response.superGames && response.superGames.length) {
            this.superGames.push(...response.superGames);
        }
        if (response.freeSpins && response.freeSpins.length) {
            this.freeSpins.addFreeSpins(response.freeSpins);
        }

        if (rewards && rewards.length) {
            this.setRewards(response.rewards);
        }

        this.level = response.level || this.getCurrentLevelByXP(this.xp);

        const result = this.math.spinDataToResults(response, this);
        this.setLastSpinFromResults(result);

        return result;
    }

    async freeSpin() {
        if (!this.freeSpins.current) {
            throw new Error('No free spins available');
        }
        const freeSpins = this.freeSpins.current;

        const response = await this.api.freeSpin({
            hash: freeSpins.hash,
            bet: freeSpins.bet,
            balance: this.balance
        }, freeSpins.type);

        this.checkError(response);

        if (response.total_win !== undefined) {
            this.totalWin = response.total_win;
        }

        if (response.freeSpins && response.freeSpins.length) {
            this.freeSpins.addFreeSpins(response.freeSpins);
        }

        if (response.superGames && response.superGames.length) {
            this.superGames.push(...response.superGames);
        }

        if (response.bonuses) {
            this.bonuses.setItems({ bonuses: response.bonuses });
        }

        if (response.rewards && response.rewards.length) {
           this.setRewards(response.rewards);
        }

        this.freeSpins.updateFreeSpins({
            has: response.freespin_hash,
            totalWin: response.freespin_total_win,
            left: response.freespin_left,
            final: response.freespin_final
        });

        this.balance = response.after_balance;

        const result = this.math.spinDataToResults(response, this);
        this.setLastSpinFromResults(result);

        return result;
    }

    setLastSpinFromResults(result) {
        if (result.results) {
            const lastResult = result.results[result.results.length - 1];
            if (lastResult && lastResult.matrix) {
                this.lastSpin = lastResult.matrix.clone();
            }
        }
    }

    async spinSuperGame() {
        if (this.hasSuperGame()) {
            const { hash } = this.nextSuperGame();

            const response = await this.api.superGame({
                hash,
                balance: this.balance,
            });

            this.checkError(response);

            this.balance = response.after_balance;

            return response;
        }
    }

    async finishDoubleLechery(hash) {
        const response = await this.api.finishDoubleLechery({hash, balance: this.balance});

        this.checkError(response);

        const {multiplier, totalWin, after_balance} = response;
        this.balance = after_balance;

        return {
            multiplier,
            totalWin
        };
    }

    rewards = [];

    setRewards(rewards) {
        this.rewards = rewards.map((reward, index) => {
            return {
                hash: reward.reward_hash,
                type: reward.reward_type,
                name: reward.reward_name,
                active: reward.active,
                next: index + 2,
                from: index + 1,
            }
        });
    }

    async activateReward(reward) {
        const { hash } = reward;
        const rewardIndex = this.rewards.findIndex((r) => r.hash === hash);

        if (rewardIndex === -1) {
            throw {message: 'Reward not found', code: 'reward_not_found'};
        }

        const response = await this.api.activateReward({hash, balance: this.balance});
        this.checkError(response);

        const { freeSpins, superGames } = response;

        if (rewardIndex !== -1) {
            this.rewards[rewardIndex].active = 0;
        }

        if (freeSpins && freeSpins.length) {
            this.freeSpins.addFreeSpins(freeSpins);
        }

        if (superGames && superGames.length) {
            this.superGames.push(...superGames);
        }

        return response;
    }

    hasRewards() {
        return this.rewards.some((reward) => reward.active);
    }

    nextActiveReward() {
        for (let i = 0; i < this.rewards.length; i++) {
            const reward = this.rewards[i];

            if (reward.active) {
                return {...reward, next: i + 2};
            }
        }
    }

    getDefaultPostParams() {
        return {
            balance: this.balance,
        };
    }

    hasSuperGame() {
        return this.superGames.length > 0;
    }

    hasDoubleLecheryFinal() {
        return this.doubleLecheryFinals.length > 0;
    }

    nextDoubleLecheryFinal() {
        if (this.doubleLecheryFinals.length > 0) {
            return this.doubleLecheryFinals.shift();
        }

        return null;
    }

    nextSuperGame() {
        return this.superGames.shift();
    }

    hasFreeSpins() {
        return this.freeSpins.hasFreeSpins() || this.freeSpins.isActive();
    }

    getFreeSpinsType() {
        return this.freeSpins.getFreeSpinsType();
    }

    nextFreeSpins() {
        if (!this.freeSpins.current) {
            this.freeSpins.startFreeSpins();
        }
    }

    hasRestore() {
        return this.hasFreeSpins() || this.hasSuperGame();
    }

    canBet() {
        return this.balance >= this.bet;
    }

    getFreeSpinsTotalWin() {
        return this.freeSpins.getFreeSpinsTotalWin();
    }

    getFreeSpinsLeft() {
        return this.freeSpins.getFreeSpinsLeft();
    }

    getTotalWin() {
        return this.totalWin;
    }

    freeSpinsDone() {
        return this.freeSpins.freeSpinsDone();
    }
}

class FreeSpinsData {
    constructor(types) {
        this.types = types;
        this.freeSpins = [];
        this.current = null;
    }

    setFreeSpins(freeSpins) {
        this.freeSpins = freeSpins;
        this.sortFreeSpins();

        for (let i = 0; i < this.freeSpins.length; i++) {
            const fs = this.freeSpins[i];
            if (fs.left !== fs.total) {
                this.current = fs;
                break;
            }
        }
    }

    sortFreeSpins() {
        this.freeSpins = this.freeSpins.sort((a, b) => {
            const aType = this.types.indexOf(a.type);
            const bType = this.types.indexOf(b.type);

            if (aType === bType) {
                return 0;
            }

            return aType < bType ? -1 : 1;
        });
    }

    addFreeSpins(freeSpins = []) {
        this.freeSpins.push(...freeSpins);
        this.sortFreeSpins();
    }

    hasFreeSpins() {
        return this.freeSpins && this.freeSpins.length > 0;
    }

    isActive() {
        return this.current && this.current.left !== this.current.total;
    }

    startFreeSpins() {
        if (this.hasFreeSpins()) {
            this.current = this.freeSpins.shift();
        }
    }

    getFreeSpinsHash() {
        return this.current ? this.current.hash : null;
    }

    getFreeSpinsTotal() {
        return this.current ? this.current.total : 0;
    }

    getFreeSpinsLeft() {
        return this.current ? this.current.left : 0;
    }

    getFreeSpinsTotalWin() {
        return this.current ? this.current.totalWin : 0;
    }

    getFreeSpinsBet() {
        return this.current ? this.current.bet : 0;
    }

    getFreeSpinsType() {
        return this.current ? this.current.type : null;
    }

    isLastFreeSpin() {
        return this.current ? this.current.left === 1 : false;
    }

    freeSpinsDone() {
        return this.current ? this.current.left === 0 : false;
    }

    clearCurrent() {
        this.current = null;
    }

    updateFreeSpins(data) {
        if (this.current && this.current.hash === data.has) {
            this.current.left = data.left;
            this.current.totalWin = data.totalWin;
            this.current.final = data.final;
        }
    }
}

