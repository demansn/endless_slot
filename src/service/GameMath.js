import {ReelsMatrix} from "../ReelsMatrix.js";
import {ReelsSymbols} from "../game/ReelsSymbols.js";
import {Service} from "./Service";
import {SlotMath} from "./gameMath/SlotMath.js";
import {WinTypes} from "../popup/WinPopup";
import {FREE_SPINS_TYPES, HIRES_SYMBOLS, SYMBOLS} from "./api/OfflineAPI";

export class GameMath extends Service {
    constructor(parameters) {
        super(parameters);
        this.gameConfig = parameters.gameConfig;
        this.rows = this.gameConfig.rows;
        this.columns = this.gameConfig .columns;

        this.symbols = new ReelsSymbols(this.gameConfig.symbols);
        this.slotMath = new SlotMath(this.gameConfig);
    }

    get payLines() {
        return this.slotMath.paylinesPositions;
    }

    spinElementsToMatrix(spinElements) {
        return ReelsMatrix.fromSpinElements(spinElements, this.symbols);
    }

    spinDataToResults(spinData, gameLogic) {
        const {
            bet,
            spin,
            total_win: totalWin,
            bigwin, jackpot, ultrawin, megawin,
            bonus_element,
            freeSpins,
            superGames,
            freespin_type,
            xp,
            multiplier
        } = spinData;
        const firstSpin = spin[0];
        const firstSpinMatrix = this.spinElementsToMatrix(firstSpin.spin_elements, this.symbols);
        const results = [];

        results.push({type: 'stop', matrix: firstSpinMatrix, bonus_element});

        for (let i = 0; i < spinData.spin.length; i++) {
            const {spin_elements, spin_win: win, paylines} = spinData.spin[i];
            const scatters = this.slotMath.getSymbolPositions(spin_elements, SYMBOLS.SCATTER);
            const wilds = this.slotMath.getSymbolPositions(spin_elements, SYMBOLS.WILD);
            const wheels = this.slotMath.getSymbolPositions(spin_elements, SYMBOLS.WHEEL);
            const matrixForResult = this.spinElementsToMatrix(spin_elements, this.symbols);
            const hirestSymbols = this.slotMath.getSymbolPositions(spin_elements, ...HIRES_SYMBOLS);
            const noWin = paylines && paylines.length === 0;
            const isLastSpin = i === spin.length - 1;

            if (i > 0) {
                const blockedReels = [];
                const blockedSymbols = [];
                if (wilds.length === 2) {
                    for (let i = 0; i < wilds.length; i++) {
                        if (!blockedReels.includes(wilds[i].column)) {
                            blockedReels.push(wilds[i].column);
                        }
                    }
                } else if (scatters.length === 2) {
                    blockedSymbols.push(...scatters);
                }

                results.push({matrix: matrixForResult, beforeMatrix: matrixForResult, type: 'respin', blockedSymbols, blockedReels});
            }

            if (paylines && paylines.length) {
                if (wheels.length) {
                    results.push({type: 'symbols', positions: wheels});
                }
                results.push({matrix: matrixForResult, beforeMatrix: matrixForResult, paylines, multiplier, win, type: 'payLines', totalWin});
            }
        }

        if (xp) {
            results.push({
                type: 'xp',
                level: gameLogic.getPlayerLevel(),
            });
        }

        if (bigwin || jackpot || ultrawin || megawin) {
            let winType = WinTypes.BIG_WIN;

            if (megawin) {
                winType = WinTypes.MEGA_WIN;
            }

            if (ultrawin) {
                winType = WinTypes.ULTRA_WIN;
            }

            if (jackpot) {
                winType = WinTypes.JACKPOT;
            }

            results.push({type: 'bigWin', win: totalWin, winType});
        }

        if (superGames && superGames.length && !freespin_type) {
            const lastSpin = spinData.spin[spin.length - 1].spin_elements;
            const positions = this.slotMath.getSymbolPositions(lastSpin, SYMBOLS.SCATTER);

            if (positions.length > 2) {
                results.push({type: 'symbols', positions});
            }
        }

        if (freeSpins && freeSpins.length > 0 && !freespin_type) {
            const lastSpin = spinData.spin[spin.length - 1].spin_elements;
            let positions = this.slotMath.getSymbolPositions(lastSpin, SYMBOLS.WILD);
            const freeSpinType = freeSpins[0].type;

            if (freeSpinType === FREE_SPINS_TYPES.FULL_PLEASURE) {
                positions = this.slotMath.getSymbolPositions(lastSpin, HIRES_SYMBOLS);
            }

            if (positions.length > 2) {
                results.push({type: 'symbols', positions});
            }
        }

        return {results, totalWin};
    }
}
