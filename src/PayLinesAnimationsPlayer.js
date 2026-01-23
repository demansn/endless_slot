import {PayLineAnimation} from "./game/PayLineAnimtaion";
import {SuperContainer} from "./lib/objects/SuperContainer";

export class PayLinesAnimationsPlayer extends SuperContainer {
    constructor({payLines, symbolWidth, symbolHeight, reels}) {
        super();

        this.payLinesAnimationsByNumber = {};
        this.payLinesNumber = payLines.length;
        this.payLines = payLines;

        for (let i = 0; i < payLines.length; i++) {
            const payLine = payLines[i];
            this.payLinesAnimationsByNumber[i] = new PayLineAnimation({payLine, symbolWidth, symbolHeight, reels, line: i});
            this.addChild(this.payLinesAnimationsByNumber[i]);
        }

        this.currentPayLineIndex = 0;
    }

    findPayLineIndexByPatter(pattern) {
        return this.payLines.findIndex((payLine) => {
            return payLine.every(({row}, index) => {
                return row === pattern[index];
            });
        });
    }

     playPayLine(pattern) {
        const payLineIndex = this.findPayLineIndexByPatter(pattern);
        const payLineAnimation = this.payLinesAnimationsByNumber[payLineIndex];

         payLineAnimation.play();

         return payLineAnimation;
    }

    getPayLine(payLineIndex) {
        return  this.payLinesAnimationsByNumber[payLineIndex];
    }

    stopPayLine(payLineIndex) {
        const payLineAnimation = this.payLinesAnimationsByNumber[payLineIndex];
        payLineAnimation.stop();
    }

    stopAllPayLines() {
        for (let i = 0; i < this.payLinesNumber; i++) {
            this.stopPayLine(i);
        }
    }

    stopCurrentPayLine() {
        this.stopPayLine(this.currentPayLineIndex);
    }

}
