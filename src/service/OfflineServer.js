import {GameLogic} from "./GameLogic";
import Utils from "../Utils";

const FREE_SPINS_BY_CASCADES = {
    4: 10,
    5: 20,
    6: 30,
    7: 50
};

export class OfflineServer extends GameLogic {
    constructor({gameConfig}) {
        super(gameConfig);
        const { symbols, rows, columns, ...parameters } = gameConfig;

        this.balance = this.urlParams.has("balance") ? Utils.tryParse(this.urlParams.get("balance")) : 0;

        this.bonusRouns = 3;
        this.bonusRound = 0;
        this.bonuses = [];
        this.winsNotBreakes = 0;

        this.freeSpinsData = {};
    }

    getInitResponse() {
        const supergame = [];

        if (this.urlParams.has('jackpot')) {
            supergame.push({supergame_hash: 'offline-jackpot', supergame: 1});
        }

        return {
            "session_uuid": "offline",
            "freespin": [],
            "last_spin": [
                ["apple", "apple", "apple", "apple", "apple"],
                ["apple", "apple", "apple", "apple", "apple"],
                ["apple", "apple", "apple", "apple", "apple"],
                ["apple", "apple", "apple", "apple", "apple"],
                ["apple", "apple", "apple", "apple", "apple"],
                ["apple", "apple", "apple", "apple", "apple"],
            ]
        }
    }

    async spin() {
        this.freeSpins = null;
        this.balance -= this.bet;
        this.currentFreeSpins = null;

        if (this.balance < 0) {
            this.balance = 0;
        }

        if (this.snowflakes === 4) {
            this.snowflakes = 0;
        }

        await this.await();

        if (this.urlParams.has('custom_message')) {
            this.balance = this.balance + this.bet;
            throw new Error(this.urlParams.get('custom_message'));
        }

        const result = this.getSpinResponse();

        this.balance = this.balance + result.totalWin;

        if (result.results.some(({type}) => type === 'payLines')) {
            this.snowflakes += 1;
        } else {
            this.snowflakes = 0;
        }

        if (this.snowflakes >= 4) {
            result.isBigWin = true;
        }

        this.totalWin = result.totalWin;

        if (result.results) {
            const lastResult = result.results[result.results.length - 1];
            if (lastResult && lastResult.matrix) {
                this.lastSpin = lastResult.matrix.clone();
            }
        }

        const cascades = result.results.filter(({type}) => type === 'payLines').length;
        const freeSpins = FREE_SPINS_BY_CASCADES[cascades];

        if (freeSpins) {
            this.freeSpins = [this.getFreeSpinsData(freeSpins)];
        }

        return result;
    }

    async freeSpin() {
        await this.await();

        if (this.urlParams.has('custom_message')) {
            throw new Error(this.urlParams.get('custom_message'));
        }

        const result = this.getSpinResponse();

        // if (response.total_win !== undefined) {
        //     this.totalWin = response.total_win;
        // }
        //
        this.currentFreeSpins.freespin_left -= 1;
        this.currentFreeSpins.freespin_win = result.totalWin || 0;
        this.currentFreeSpins.freespin_total_win += result.totalWin || 0;

        if (this.currentFreeSpins.freespin_left === 0) {
            this.balance = this.balance + this.currentFreeSpins.freespin_total_win;
        }

        // if (result.results) {
        //     const lastResult = result.results[result.results.length - 1];
        //     if (lastResult && lastResult.matrix) {
        //         this.lastSpin = lastResult.matrix.clone();
        //     }
        // }
        return result;
    }

    async asyncRequest(method, params) {
        return new Promise((resolve, reject) => {
                if (method === "/player") {
                    resolve(this.getInitResponse());
                }
        });
    }

    async await() {
        return new Promise(resolve => window.setTimeout(resolve, Math.random() * 1000));
    }

    getSpinResponse({freespin = false} = {}) {
        const bigWinCheat = this.urlParams.has('bigwin');
        const cascadeCheat = this.urlParams.has('cascade');
        const wildCheat = this.urlParams.has('wild');
        const winCheat = this.urlParams.has('win');
        const changeCheat = this.urlParams.has('change');
        const results = this.math.getResults({bet: this.bet});

        if (bigWinCheat) {
            if (!results.results.filter(({type}) => type === 'payLines').length) {
                return this.getSpinResponse();
            } else {
                results.isBigWin = true;
            }
        } else if (cascadeCheat && results.results.filter(({type}) => type === 'payLines').length < 4) {
            return this.getSpinResponse();
        } else if (changeCheat && results.results.filter(({type}) => type === 'change').length < 1) {
            return this.getSpinResponse();
        } else if (winCheat && results.results.filter(({type}) => type === 'reSpin').length < 1) {
            return this.getSpinResponse();
        }

        return results;
    }

    getResponse() {
        return this.math.getResults({bet: this.bet});
    }

    async getSuperGameResult(hash) {
        let results = [];
        let win = 0;
        let freespins_win = 0;
        const variants = [];

        for (let i = 0; i < 3; i++) {
            const result = this.getResult();

            results.push(result);
        }

        results.forEach(({type, value}) => {
            if (type === 'fs') {
                freespins_win += value;
                variants.push(`${value}-freespins`);
            } else if(type === 'm') {
                win += value;
                variants.push(`X${value}`);
            }
        });

        await this.await();

        return {
            status: "success",
            demo: this.demo,
            bet: this.bet,
            custom_message: "",
            before_balance: this.balance,
            after_balance: this.balance + win,
            variants,
            money: {
                win,
                multi: 0
            },
            "freespin": {
                freespins_win,
                "freespins_hash": 'offline-freespin',
                "freespins_bet_level": this.bet
            },
        }
    }

    getFreeSpinsData(amount) {
        return {
            freespin_hash: 'offline-freespin',
            bet_level: this.bet,
            freespin_left: amount,
            freespin_total: amount,
            freespin_total_win: 0
        };
    }

    getResult() {
        const results = [
            {type: 'fs', value: 1},
            {type: 'fs', value: 1},
            {type: 'fs', value: 1},
            {type: 'fs', value: 1},
            {type: 'fs', value: 1},
            {type: 'fs', value: 2},
            {type: 'fs', value: 2},
            {type: 'fs', value: 2},
            {type: 'fs', value: 5},
            {type: 'fs', value: 10},
            {type: 'fs', value: 50},
            {type: 'm', value: 0},
            {type: 'm', value: 0},
            {type: 'm', value: 0},
            {type: 'm', value: 0},
            {type: 'm', value: 2},
            {type: 'm', value: 2},
            {type: 'm', value: 2},
            {type: 'm', value: 5},
            {type: 'm', value: 5},
            {type: 'm', value: 5},
            {type: 'm', value: 10},
            {type: 'm', value: 20},
            {type: 'm', value: 50},
            {type: 'm', value: 100},
        ];
        const freespinCheat = this.urlParams.has('freespin');
        const moneyCheat = this.urlParams.has('money');
        const bothCheat = this.urlParams.has('both');
        const loseCheat = this.urlParams.has('lose');
        let bonus = results[Math.floor(Math.random() * results.length)];

        if (freespinCheat) {
            const onlyFreeSpins = results.filter(b => b.type === 'fs');

            bonus = onlyFreeSpins[Math.floor(Math.random() * onlyFreeSpins.length)];
        } else if (moneyCheat) {
            const onlyMultipliers = results.filter(b => b.type === 'm' && b.value > 0);

            bonus = onlyMultipliers[Math.floor(Math.random() * onlyMultipliers.length)];
        } else if (bothCheat) {
            const all = results.filter(b => b.value === 0);

            bonus = all[Math.floor(Math.random() * all.length)];
        } else if (loseCheat) {
            const all = results.filter(b => b.value === 0);

            bonus = all[Math.floor(Math.random() * all.length)];
        }

        return bonus;
    }

    // pear, grape, apple, banana, shop, truck, juicer, freespin, scatter, wild
}
