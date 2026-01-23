import {CheckBox} from "@pixi/ui";
import services from "../../ServiceLocator";
import {ShopItemButtonUnchecked} from "./ShopItemButtonUnchecked";
import {ShopItemButtonChecked} from "./ShopItemButtonChecked";

export class ShopItemActionButton extends CheckBox {
    constructor({text}) {
        super({
            style: {
                unchecked: new ShopItemButtonUnchecked(text),
                checked: new ShopItemButtonChecked(text)
            }
        });

        this.onChange.connect(() => {
            services.audio.playSfx('Click_2');
        });
    }

    setText(text) {
        this.style.unchecked.setText(text);
        this.style.checked.setText(text);
    }
}
