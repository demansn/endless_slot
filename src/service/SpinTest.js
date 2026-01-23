import Utils from "../Utils";

export default class SpinTest  {
    constructor({gameConfig}) {
        const {rows, columns, paysLinesTable} = gameConfig;
        this.rows = rows;
        this.columns = columns;
        this.kConfigWin = paysLinesTable;
        this.paylinesPositions = paysLinesTable.map(table => {
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

    createArray = (indexTrue, size) =>
    {
        let arr = new Array(size);
        for (let i = 0; i < arr.length; i++) arr[i] = i === indexTrue;
        return [...arr];
    }

    test(spinData)
    {
        let result = {
            arrReel: [[], [], [], [], [], []],
            arrWinnerLine: [],
            arrPayLine: []
        };

        for (let i = 0; i < this.columns; ++i)
        {
            for (let j = 0; j < this.rows; ++j)
            {
                result.arrReel[i][j] = spinData[j][i];
            }
        }

        let spinResult = this.kConfigWin
            .reduce((accumulator, currentPattern, index) =>
            {
                let checkSymbol = null;

                let fullPattern = currentPattern;

                currentPattern = currentPattern
                    .reduce((prevLine, currLine, i) =>
                    {
                        currLine = currLine.map((row, j) =>
                        {
                            return row ? result.arrReel[i][j] : false;
                        });

                        if (!checkSymbol || checkSymbol === "wild")
                        {
                            checkSymbol = currLine.find((el) => el !== false);
                        }

                        if (i > 0)
                        {
                            const preSymbol = prevLine[i - 1].find((el) => el !== false);
                            if (!preSymbol || !(currLine.includes(checkSymbol) || currLine.includes("wild")))
                            {
                                //currLine = [false, false, false];
                                currLine = this.createArray(-1, 5);
                            }
                        }

                        if (currLine.includes("scatter"))
                        {
                            //currLine = [false, false, false];
                            currLine = this.createArray(-1, 5);
                        }

                        prevLine.push(currLine);

                        return prevLine;
                    }, []);

                if (!currentPattern[2].some((el) => el !== false))
                {
                    return accumulator;
                }

                let check = true;

                for (const [index, pattern] of accumulator.entries())
                {
                    for (const lineIndex in pattern)
                    {
                        const lineIDX = pattern[lineIndex].findIndex(el => el !== false);
                        const currIDX = currentPattern[lineIndex].findIndex(el => el !== false);

                        if (lineIDX === currIDX)
                        {
                            check = false;
                        }
                        if (lineIDX !== currIDX)
                        {
                            if (lineIDX === -1)
                            {
                                accumulator.splice(index, 1);
                                check = true;
                                break;
                            }
                            if (currIDX === -1)
                            {
                                check = false;
                                break;
                            }
                            check = true;
                            break
                        }
                    }
                    if (!check)
                    {
                        break;
                    }
                }

                if (check)
                {
                    accumulator.push([currentPattern, [...fullPattern]]);
                }

                return accumulator;
            }, []);

        for (const winLine of spinResult)
        {
            let pattern = [];
            let fullPattern = [];

            for (let i in winLine[0])
            {
                for (let j in winLine[0][i])
                {
                    if (winLine[0][i][j])
                    {
                        pattern.push({x: Utils.tryParse(i), y: Utils.tryParse(j)});
                    }
                    if (winLine[1][i][j])
                    {
                        fullPattern.push({x: Utils.tryParse(i), y: Utils.tryParse(j)});
                    }
                    //pattern.push({x: Utils.tryParse(i), y: Utils.tryParse(j)});
                }
            }

            result.arrWinnerLine.push(pattern);
            result.arrPayLine.push(fullPattern);
        }

        return result;
    }

    generateNonWinningMatrix(rows, cols) {
        let matrix;
        do {
            matrix = Array.from({ length: rows }, () => Array(cols).fill(null));

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (!matrix[i][j]) {
                        let symbolPlaced = false;
                        while (!symbolPlaced) {
                            const symbolData = getRandomSymbol();
                            if (i + symbolData.height <= rows && j + symbolData.width <= cols) {
                                let canPlace = true;
                                for (let y = 0; y < symbolData.height; y++) {
                                    for (let x = 0; x < symbolData.width; x++) {
                                        if (matrix[i + y][j + x] !== null) {
                                            canPlace = false;
                                            break;
                                        }
                                    }
                                    if (!canPlace) break;
                                }
                                if (canPlace) {
                                    for (let y = 0; y < symbolData.height; y++) {
                                        for (let x = 0; x < symbolData.width; x++) {
                                            matrix[i + y][j + x] = symbolData.texture;
                                        }
                                    }
                                    symbolPlaced = true;
                                }
                            }
                        }
                    }
                }
            }
        } while (hasWinningLine(matrix));

        return matrix;
    }

    hasWinningLine(matrix) {
        for (const paylines of this.kConfigWin) {
            for (const line of paylines) {
                let count = 0;
                for (let i = 0; i < line.length; i++) {
                    const symbol = matrix[line[i]][i];
                    if (symbol === null) break;
                    if (i === 0 || symbol === matrix[line[i - 1]][i - 1]) {
                        count++;
                        if (count >= 3) return true;
                    } else {
                        count = 1;
                    }
                }
            }
            return false;
        }
    }
}
