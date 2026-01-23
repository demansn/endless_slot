import {services} from "./ServiceLocator";
import gsap from "gsap";

export default class Utils {
    static getPayLinesPositions(tables) {
        return tables.map(rows => {
            let positions = [];

            for (let row = 0; row < rows.length; row++) {
                for (let column = 0; column < rows[row].length; column++) {
                    if (rows[row][column]) {
                        positions.push({row, column});
                    }
                }
            }

            return positions;
        });
    }

    static randomBoolean() {
        return Math.random() > 0.5;
    }

    static randomInteger(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }

    static shuffleArray(array) {
        return array
            .map(value => ({value, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value);
    }

    static formatCoinText(coins) {
        let result = null;

        if (coins >= 10000) {
            result = coins.toString().slice(0, 2) + "K";
        } else {
            result = coins.toString();
        }

        return result;
    }

    static fitTextWidth(text, maxWidth) {
        text.scale.set(1);
        if (text.width > maxWidth) {
            text.scale.set(maxWidth / text.width);
        }
    }

    static toClientUTC(serverUTC) {
        let regex = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)/;
        let arrMatch = serverUTC.match(regex);

        return Date.UTC(arrMatch[1], arrMatch[2] - 1, arrMatch[3], arrMatch[4], arrMatch[5], arrMatch[6]);
    }

    static findTimeScale(speedMult) {
        return 1 + (speedMult / 75);
    }

    static calcFreeSpins(arrFreespin) {
        let result = 0;

        for (let freespin of arrFreespin) {
            result += freespin.count - freespin.played;
        }

        return result;
    }

    static texMapsToTexArray(textureId, textureCount) {
        let textures = {};
        for (let i = 0; i < textureCount; ++i) {
            Object.assign(textures, services.resources.get(textureId + i.toString()));
        }

        return Object.values(textures);
    }

    static createTexArray(textureId, textureCount) {
        let result = [];
        for (let i = 0; i < textureCount; ++i) {
            result.push(services.resources.get(textureId + i.toString()));
        }

        return result;
    }

    static createTextStyle(fontSize, fontFamily) {
        return {
            fontSize: fontSize,
            fontFamily: fontFamily,
            stroke: 0x251913,
            strokeThickness: 2,
            lineJoin: "round",
            fill: [
                "#f4d6a6",
                "#f6e2be",
                "#f7eacd",
                "#f7edd2",
                "#ffffff"
            ],
            fillGradientStops: [
                1,
                0.59,
                0.42,
                0.21,
                0.1
            ]
        };
    }

    static createTextStyleLin1(fontSize, fontFamily, fontWeight = undefined) {
        let addFontWeight = {};
        if (fontWeight) addFontWeight = {fontWeight};

        return {
            fontSize: fontSize,
            fontFamily: fontFamily,
            ...addFontWeight,
            lineJoin: "round",
            fill: [
                "#DEB877",
                "#F7F6D7",
                "#E9CC9C",
                "#DBD19A"
            ],
            fillGradientStops: [
                1,
                0.63,
                0.37,
                0.0
            ]
        };
    }

    static createTextStyleForShadowedSerif(fontSize, ...addFontWeight) {
        return {
            fontSize,
            fontFamily: 'Modak',
            ...addFontWeight,
            stroke: 0x630707,
            strokeThickness: 2,
            lineJoin: "round",
            fill: [
                "#F1A23F",
                "#CF9218",
                "#F7F6D7",
                "#FFD25F",
                "#F1A23F"
            ],
            fillGradientStops: [
                1,
                0.76,
                0.54,
                0.24,
                0.0
            ]
        };
    }

    static createTextStyleLinTime(fontSize, fontFamily, fontWeight = undefined) {
        let addFontWeight = {};
        if (fontWeight) addFontWeight = {fontWeight};

        return {
            fontSize: fontSize,
            fontFamily: fontFamily,
            ...addFontWeight,
            //stroke: 0x251913,
            //strokeThickness: 2,
            lineJoin: "round",
            fill: [
                "#A4844E",
                "#A4844E",
                "#D8C9A3",
                "#A4844E",
                "#E8DFAF"
            ],
            fillGradientStops: [
                1,
                0.76,
                0.54,
                0.24,
                0.0
            ]
        };
    }

    static createTextStyleLinSupergame(fontSize, fontFamily, fontWeight = undefined) {
        let addFontWeight = {};
        if (fontWeight) addFontWeight = {fontWeight};

        return {
            fontSize: fontSize,
            fontFamily: fontFamily,
            ...addFontWeight,
            //stroke: 0x251913,
            //strokeThickness: 2,
            lineJoin: "round",
            fill: [
                "#8B6535",
                "#A4844E",
                "#F7F6D7",
                "#A4844E",
                "#DBD19A"
            ],
            fillGradientStops: [
                1,
                0.76,
                0.54,
                0.24,
                0.0
            ]
        };
    }

    static createTextStyleLinHUDLabel( fontSize, fontFamily, fontWeight=undefined )
    {
        let addFontWeight = {};
        if(fontWeight) addFontWeight = {fontWeight};

        return {
            fontSize: fontSize,
            fontFamily: fontFamily,
            ...addFontWeight,
            //stroke: 0x251913,
            //strokeThickness: 2,
            lineJoin: "round",
            fill: [
                "#A4844E",
                "#DBD19A"
            ],
            fillGradientStops: [
                1,
                0.0
            ]
        };
    }

    static createTextStyleForPopup(fontSize = 140) {
        return {
            fontSize,
            fontFamily: "Modak",
            lineJoin: "round",
            align: 'center',
            stroke: 0x630707,
            strokeThickness: 10,
            fill: [
                "#F1A23F",
                "#CF9218",
                "#F7F6D7",
                "#FFD25F",
                "#F1A23F"
            ],
            fillGradientStops: [
                1,
                0.76,
                0.54,
                0.24,
                0.0
            ]
        };
    }

    static createTextStyleForPopupLabels(fontSize = 46) {
        return {
            fontSize,
            fontFamily: "Modak",
            lineJoin: "round",
            align: 'center',
            fill: "#4A2517"
        };
    }

    static createTextStyleForPopupLabelsValue(fontSize = 46) {
        return {
            fontSize,
            fontFamily: "Modak",
            lineJoin: "round",
            align: 'center',
            fill: "#BB3227"
        };
    }


    static createTextStyleForPayLineWin(fontSize = 85) {
        return Utils.createTextStyleForPopup(fontSize);
    }

    static tryParse(value) {
        if (typeof value === "string") {
            value = parseFloat(value.replace(",", ""));
        }

        return value;
    }

    static toSlotIndex(slotId) {
        let result = null;

        switch (slotId) {
            case "rune-1": {
                result = 0;
                break;
            }
            case "rune-2": {
                result = 1;
                break;
            }
            case "rune-3": {
                result = 2;
                break;
            }
            case "rune-4": {
                result = 3;
                break;
            }
            case "rune-5": {
                result = 4;
                break;
            }
            case "rune-blue-1": {
                result = 5;
                break;
            }
            case "rune-blue-2": {
                result = 6;
                break;
            }
            case "rune-orange-1": {
                result = 7;
                break;
            }
            case "rune-orange-2": {
                result = 8;
                break;
            }
            case "big-orange": {
                result = 9;
                break;
            }
            case "big-blue": {
                result = 10;
                break;
            }
            case "wild": {
                result = 11;
                break;
            }
        }

        return result;
    }

    static toSlotId(slotIndex) {
        let result = null;

        switch (slotIndex) {
            case 0: {
                result = "rune-1";
                break;
            }
            case 1: {
                result = "rune-2";
                break;
            }
            case 2: {
                result = "rune-3";
                break;
            }
            case 3: {
                result = "rune-4";
                break;
            }
            case 4: {
                result = "rune-5";
                break;
            }
            case 5: {
                result = "rune-blue-1";
                break;
            }
            case 6: {
                result = "rune-blue-2";
                break;
            }
            case 7: {
                result = "rune-orange-1";
                break;
            }
            case 8: {
                result = "rune-orange-2";
                break;
            }
            case 9: {
                result = "big-orange";
                break;
            }
            case 10: {
                result = "big-blue";
                break;
            }
            case 11: {
                result = "wild";
                break;
            }
        }

        return result;
    }

    static isSlotIdHigh(slotId) {
        switch (slotId) {
            case "big-orange":
            case "big-blue":
            case "wild":
                return true;
            default:
                return false;
        }
    }

    static isSlotIndexHigh(slotId) {
        switch (slotId) {
            case Utils.toSlotIndex("big-orange"):
            case Utils.toSlotIndex("big-blue"):
            case Utils.toSlotIndex("wild"):
                return true;
            default:
                return false;
        }
    }

    static SlotIds = ["rune-1", "rune-2", "rune-3", "rune-4", "rune-5", "rune-blue-1", "rune-blue-2", "rune-orange-1", "rune-orange-2", "big-orange", "big-blue", "wild"];

    static randomSlotId() {
        return Utils.SlotIds[Utils.randomInteger(0, Utils.SlotIds.length - 1)];
    }

    static randomNotHighSlotId() {
        return Utils.SlotIds[Utils.randomInteger(0, Utils.SlotIds.length - 3 - 1)];
    }

    static alignWinLine(winLineSprite, color, yAffect) {
        if (color === "orange") winLineSprite.anchor.set(0.1749174917491749174, 0.5538461538461538461);
        else if (color === "blue") winLineSprite.anchor.set(0.1749174917491749174, 0.5538461538461538461);
        else if (color === "yellow") winLineSprite.anchor.set(0.158415841584158415841584, 0.5230769230769230769230);

        if (yAffect === 0) {
            winLineSprite.scale.set(0.75, 1.0);
            winLineSprite.angle += 0.55;
        } else {
            winLineSprite.scale.set(1.0, 1.0);
        }
    }

    static convertTemplateToResPath(resPathTemplate) {
        let resPath = {
            on: `${resPathTemplate}_default`,
            hover: `${resPathTemplate}_hover`,
            pressed: `${resPathTemplate}_clicked`,
            off: `${resPathTemplate}_disabled`,
            active: `${resPathTemplate}_disabled`
        };
        if (!services.resources.get(resPath.on) )resPath.on = undefined;
        if (!services.resources.get(resPath.hover)) resPath.hover = undefined;
        if (!services.resources.get(resPath.pressed)) resPath.pressed = undefined;
        if (!services.resources.get(resPath.off)) {
            resPath.off = undefined;
            resPath.active = undefined;
        }

        return resPath;
    }

    static getPartialIndexesFromSlotIdArrayCorrectedFromTop(arr) {
        let result = Utils.getPartialIndexesFromSlotIdArrayFromBottom(arr);

        //correct high element`s partial indexes if order is incorrect (especially for bottom high elements)
        let captured = -1;
        let skipped = result[0] === -1 || result[0] === 0;
        let startFrom = skipped ? 0 : 3 - result[0]; //skip first high element

        for (let i = startFrom; i < result.length; i++) {
            let currentPartialIndex = result[i];

            if (currentPartialIndex === -1) {
                captured = -1;
            } else {
                if (captured === -1) {
                    captured = currentPartialIndex;
                }

                result[i] -= captured;
            }
        }

        return result;
    }

    static getPartialIndexesFromSlotIdArrayFromBottom(arr) {
        let counter = 0;
        let capturedIndex = null;

        let result = new Array(arr.length);
        result.fill(-1);

        for (let i = arr.length - 1; i !== -1; i--) {
            let slot = arr[i];
            if (!Utils.isSlotIdHigh(slot)) {
                counter = 0;
                capturedIndex = -1;
            } else {
                if (capturedIndex !== null && capturedIndex !== slot) {
                    counter = 0;
                    capturedIndex = -1;
                }

                result[i] = 2 - counter;

                counter++;
                capturedIndex = slot;

                if (counter > 2) {
                    counter = 0;
                    capturedIndex = -1;
                }
            }

        }

        return result;
    }

    static flipArray2D(matrix) {
        const rows = matrix.length, cols = matrix[0].length;
        const grid = [];
        for (let j = 0; j < cols; j++) {
            grid[j] = Array(rows);
        }
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[j][i] = matrix[i][j];
            }
        }
        return grid;
    }

    static calculateAffectedIndexes(arrSlotId, explodedIndexes) {
        let affectedIndexes = new Array(arrSlotId.length);

        arrSlotId = arrSlotId.map(i => {
            return {
                content: i,
                affectedIndex: 0
            }
        });

        //clear exploded elements
        for (let i = arrSlotId.length - 1; i !== -1; i--) if (explodedIndexes.includes(i)) arrSlotId[i].content = null;

        //calculate falling elements
        for (let i = arrSlotId.length - 1; i !== -1; i--) {
            let notAllNull = true;
            while (!arrSlotId[i].content && notAllNull) {
                notAllNull = false;

                for (let j = i - 1; j !== -1; j--) {
                    arrSlotId[j + 1] = arrSlotId[j];
                    if (arrSlotId[j + 1].content) {
                        notAllNull = true;
                        arrSlotId[j + 1].affectedIndex--;
                    }
                }
                arrSlotId[0] = {content: null, affectedIndex: 0};
            }
        }

        //let maxAffectedIndex = Math.min(...(arrSlotId.map(i => i.affectedIndex)));
        //console.log("max", maxAffectedIndex)
        let maxAffectedIndex = -explodedIndexes.length;

        for (let i = arrSlotId.length - 1; i !== -1; i--) {
            if (!arrSlotId[i].content) {
                arrSlotId[i] = {content: null, affectedIndex: maxAffectedIndex};
            }
        }

        return arrSlotId.map(i => i.affectedIndex);
    }
}

export function asyncDelay(delay) {
    return new Promise(r => gsap.delayedCall(delay, r));
}


export function delayedAsyncAction(delay, callback) {
    let cancel;

    const promise = new Promise((resolve, reject) => {
        const tween = gsap.delayedCall(delay, () => {
            callback();
            resolve();
        });

        cancel = () => {
            tween.kill();
            resolve();
        };
    });

    promise.cancel = cancel;

    return promise;
}

