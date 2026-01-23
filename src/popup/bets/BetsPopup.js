import {BasePopup} from "../BasePopup";
import {SelectBet} from "./SelectBet";

export class BetsPopup extends BasePopup {
    create({bets, bet, onBetChanged}) {
        this.onBetChanged = onBetChanged;
        this.bg = this.addObject('PopupBG', {}, {anchor: 0.5, x: 's50%', y: 's50%'});
        this.title = this.addObject('Text', {text: 'BETS', style: 'PopupTitle'}, {y: 155, x: 's50%', anchor: 0.5});
        this.content = this.addObject('SuperContainer', {}, {y: 300, x: 's50%'});
        this.closeButton.position.set(1631, 162);

        this.buttons = [];
        this.bets = bets;
        this.bet = bet;
        this.betIndex = bets.indexOf(bet);

        const gap = 50;

        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 4; ++j) {
                const index =  i * 4 + j;
                let button = new SelectBet({
                    value: this.bets[index],
                    index,
                    onSelect: this.onSelectedBet.bind(this)
                });

                button.position.set(j * (button.width - gap), i * (button.height));
                this.content.addChild(button);

                this.buttons.push(button);
            }
        }

        this.content.x -= this.content.width / 2;
        this.buttons[this.betIndex].setActive(true);
    }

    onSelectedBet(bet, index) {
        this.buttons.forEach(btn => {
            if (btn.value !== bet) {
                btn.unselect();
            }
        });

        this.emit('betChanged', bet, index);
        this.onBetChanged && this.onBetChanged(bet, index);
        this.close();
    }
}
