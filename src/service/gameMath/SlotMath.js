import {ReelsSymbols} from "../../game/ReelsSymbols.js";

export class SlotMath {
    /*
    * @param {slotConfig}
     */
    constructor({rows, columns, symbols, paysLinesTable}) {
        this.rows = rows;
        this.columns = columns;
        this.paysLinesTable = paysLinesTable;
        this.minSymbolsInWinPayline = 3;
        this.symbols = new ReelsSymbols(symbols);
        this.allPositions = [];
        for (let column = 0; column < this.columns; column++) {
            for (let row = 0; row < this.rows; row++) {
                this.allPositions.push({row, column});
            }
        }

        this.paylinesPositions = this.paysLinesTable.map(table => {
            let positions = [];

            for (let column = 0; column < this.columns; column++) {
                for (let row = 0; row < this.rows; row++) {
                    if (table[row][column]) {
                        positions.push({row, column});
                    }
                }
            }

            return positions;
        });

    }

    cloneSpinElements(spinElements) {
        return spinElements.map(row => [...row]);
    }

    getSpins(options = {}) {
        let {firstSpinElements, onlySymbols} = options;
        const spins = [];
        let spin = this.getSpin(firstSpinElements, onlySymbols);

        spins.push(spin);

        const scattersPositions = this.getSymbolPositions(spin.spin_elements, 'scatter');
        const wildPositions = this.getSymbolPositions(spin.spin_elements, 'wild');
        const isBonusWin = scattersPositions.length >= 3 || wildPositions.length >= 3;

        if (!isBonusWin) {
            if (scattersPositions.length === 2) {
                spins.push(...this.getReSpinWithBlockedPositions(spin.spin_elements, scattersPositions));
            } else if(wildPositions.length === 2) {
                // get reels from wilds
                const blockedReels = [];
                for (let i = 0; i < wildPositions.length; i++) {
                    if (!blockedReels.includes(wildPositions[i].column)) {
                        blockedReels.push(wildPositions[i].column);
                    }
                }

                spins.push(...this.getReSpinWithBlockedReels(spin.spin_elements, blockedReels));
            }
        }

        return spins;
    }

    getSpin(spinElements, onlySymbols) {
        let spin_elements = spinElements ? spinElements : this.getRandomSpinElements(onlySymbols);
        const paylines = this.getPayLinesFromSpinElements(spin_elements);

        return {spin_elements, paylines};
    }

    getReSpinWithBlockedReels(spinElements, reels) {
        const blockedPositions = [];

        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];

            for (let j = 0; j < this.rows; j++) {
                blockedPositions.push({row: j, column: reel});
            }
        }

        return this.getReSpinWithBlockedPositions(spinElements, blockedPositions);
    }

    getReSpinWithBlockedPositions(spinElements, positions) {
        const spins = [];

        // replace not blocked positions
        const spinElementsCopy = this.cloneSpinElements(spinElements);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (!positions.some(p => p.row === i && p.column === j)) {
                    spinElementsCopy[i][j] = this.symbols.getRandom().name;
                }
            }
        }

        const spin = this.getSpin(spinElementsCopy);
        spins.push(spin);

        return spins;
    }

    addWinsToSpins(spins, multipliersTable, bet, multiplier = 1) {
        let totalWin = 0;

        for (let i = 0; i < spins.length; i++) {
            const spin = spins[i];
            if (spin.paylines && spin.paylines.length) {
                const paylines = spin.paylines;

                for (let j = 0; j < paylines.length; j++) {
                    const payline = paylines[j];
                    const payLineSymbol = payline.symbols[0];
                    const payLineMultiplier = multipliersTable[payLineSymbol][payline.pattern.length] || 1;
                    payline.win = payLineMultiplier * bet * multiplier;
                    payline.multiplier = multiplier;
                }

                spin.spin_win = paylines.reduce((sum, {win}) => sum + win, 0);
                totalWin += spin.spin_win;
            }
        }

        return totalWin;
    }

    getRandomSpinElements(onlySymbols) {
        const spinElements = [];

        for (let i = 0; i < this.rows; i++) {
            const row = [];

            for (let j = 0; j < this.columns; j++) {
                row.push(this.symbols.getRandom(onlySymbols).name);
            }

            spinElements.push(row);
        }

        return spinElements;
    }

    getPayLinesFromSpinElements(spinElements) {
        const payLines = [];
        const payLinesPositions = this.paylinesPositions;

        for (let line = 0; line < payLinesPositions.length; line++) {
            const payLinePositions = payLinesPositions[line];
            const pattern = [];
            const patternDefinition = payLinePositions.map(({row}) => row);
            const symbols = [];
            let payLineSymbol = null;

            for (let j = 0; j < payLinePositions.length; j++) {
                const position = payLinePositions[j];
                const symbol = spinElements[position.row][position.column];
                const isWild = this.symbols.isWild(symbol);
                payLineSymbol = isWild ? null : symbol;

                if (payLineSymbol !== null || this.symbols.isNotPay(symbol)) {
                    break;
                }
            }

            if (payLineSymbol !== null) {
                for (let i = 0; i < payLinePositions.length; i++) {
                    const position = payLinePositions[i];
                    const symbol = spinElements[position.row][position.column];
                    const isWild = this.symbols.isWild(symbol);
                    const isSameSymbol = symbol === payLineSymbol || isWild;

                    if (isSameSymbol) {
                        pattern.push(position.row);
                        symbols.push(symbol);
                    } else {
                        break;
                    }
                }
            }

            if (pattern.length >= this.minSymbolsInWinPayline) {
                payLines.push({pattern, line, symbols, patternDefinition});
            }
        }

        return payLines;
    }

    hasAllSymbols(spinElements, symbols) {
        return symbols.every(symbol => {
            return this.getSymbolPositions(spinElements, symbol).length > 0;
        });
    }

    getSymbolPositions(rows, ...findSymbols) {
        const symbols = [];

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (findSymbols.includes(rows[i][j])) {
                    symbols.push({row: i, column: j});
                }
            }
        }

        return symbols;
    }

    hasSymbols(spinElements, symbols) {
        return symbols.every(symbol => {
            return this.getSymbolPositions(spinElements, symbol).length > 0;
        });
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}
