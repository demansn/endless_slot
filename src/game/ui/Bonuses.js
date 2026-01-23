import {SuperContainer} from "../../lib/objects/SuperContainer";
import {InlineBlock} from "../../lib/objects/InlineBlock";
import {SHOP_ITEMS} from "../../service/api/OfflineAPI";
import {GrayscaleFilter} from "pixi-filters";
import services from "../../ServiceLocator";
import {SOUNDS} from "../../constants/sounds";

const BONUSES = {
    'SCATTER': {icon: 'Scatter', alias: SHOP_ITEMS.SCATTER},
    'WILD':  {icon: 'Wild',  alias: SHOP_ITEMS.WILD},
    'ROULETTE':  {icon: 'Roulette',  alias: SHOP_ITEMS.WHEEL},
};

const BonusesBySexualOrientation = [BONUSES.SCATTER.icon, BONUSES.WILD.icon];

export class Bonuses extends InlineBlock {
    constructor() {
        super({gap: -20})
        this.bonuses = {};

        [BONUSES.ROULETTE, BONUSES.SCATTER, BONUSES.WILD].forEach(({icon, alias}) => {
            this.bonuses[alias] = this.addObject(Bonus, {icon, isActive: false, alias, sexualOrientation: this.data.sexualOrientation}, {});
        });
    }

    updateBonuses(activeBonuses) {
        for (const alias in this.bonuses) {
            const bonus = activeBonuses.find(bonus => bonus.alias === alias);

            if (bonus) {
                this.bonuses[alias].setActive(true);
                this.bonuses[alias].setProgress(bonus.count / bonus.total * 100);
            } else {
                if (this.bonuses[alias].isActive) {
                    this.bonuses[alias].setActive(false);
                    services.audio.playSfx(SOUNDS.bonus.end);
                }
            }
        }
    }
}

export class Bonus extends SuperContainer {
    constructor({icon, isActive, alias, sexualOrientation}) {
        super();
        this.alias = alias;
        const prefix = BonusesBySexualOrientation.includes(icon) ? `${icon}Bonus_${sexualOrientation}` : `${icon}Bonus`

        this.active = this.addObject(`${prefix}` );
        this.isActive = isActive;

        this.setActive(isActive);
        this.scale.set(0.7);
    }

    setActive(isActive) {
        this.active.filters = isActive ? []: [new GrayscaleFilter()];
        this.active.cacheAsBitmap = !isActive;
        this.isActive = isActive;
        if (!isActive) {
            this.setProgress(0);
        }
    }

    setProgress(progress) {
        this.active.setProgress(progress);
    }
}
