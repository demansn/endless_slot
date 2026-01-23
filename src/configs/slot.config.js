import {symbols} from "./symbols.config";
import {paysLinesTables} from "./paysLinesTables.config";

export const slotConfig = {
    bets: [0.05, 0.25, 0.5, 1, 2, 2.5, 5, 7.5, 10, 25, 50, 100],
    columns: 5,
    rows: 3,
    symbols,
    paysLinesTable: paysLinesTables
};
