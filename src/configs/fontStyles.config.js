import {TextStyle} from "pixi.js";

export const getFontStyle =(name) => {
    return FontStylesConfig[name];
}

const TextFill = {
    "fill": [
        "#FFFA6F",
        "#FFB238"
    ],
    "fillGradientStops": [
        0,
        1
    ],
};

const FontStroke = {
    "stroke": "#4D0102",
    "strokeThickness": 2,
}

export const fontFamily = 'Croissant One';

const DefaultTextStyle = {
    fontFamily,
    fontSize: 24,
    ...FontStroke,
    ...TextFill,
}

export const FontStylesConfig = {
    DefaultTextStyle:  new TextStyle(DefaultTextStyle),

    ErrorMessageTextStyle:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 36,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 700,
        strokeThickness: 4,
        fill: 0xffffff,
    }),

    ValueField:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 36,
        align: 'center',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowAngle: 0,
        dropShadowDistance: 0,
        dropShadowBlur: 10,
        dropShadowColor: "#ff0000",
    }),

    ValueFieldTitle:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 22,
        align: 'center',
        fill: 0xffffff,
        stroke: 0x000000
    }),

    XPFieldTitle:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 22,
        align: 'center',
    }),

    BonusIconBadge:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 36,
        align: 'center',
    }),

    BonusIconTitle:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 30,
        align: 'center',
        strokeThickness: 20,
    }),

    MultiplierWinText:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 36,
        align: 'center',
    }),

    FreeSpinsCounterTitle:  new TextStyle({
        ...DefaultTextStyle,
        fill: 0xffffff,
        align: 'center',
    }),

    FreeSpinsCounter:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 26,
        align: 'center',
    }),

    TotalWinText:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 66,
        align: 'center',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowAngle: 0,
        dropShadowDistance: 0,
        dropShadowBlur: 10,
        dropShadowAlpha: 0.8,
        dropShadowColor: "#ff0000",
    }),

    ShopTitle:  new TextStyle({
        ...DefaultTextStyle,
        "fontSize": 30,
        "strokeThickness": 3,
        align: 'center',
    }),

    RouletteWheelText:   new TextStyle({
        ...DefaultTextStyle,
        align: 'center',
        fontSize: 70,
    }),

    ProgressLevelPointLevel:  new TextStyle({
        ...DefaultTextStyle,
        align: 'center',
        fontSize: 30,
    }),

    ProgressLevelPointLevelMobile:  new TextStyle({
        ...DefaultTextStyle,
        align: 'center',
        fontSize: 40,
    }),
    ProgressLevelPointXP:  new TextStyle({
        ...DefaultTextStyle,
        align: 'center',
        fontSize: 30,
        strokeThickness: 6,
        lineHeight: 32,
    }),

    ProgressLevelPointXPMobile:  new TextStyle({
        ...DefaultTextStyle,
        align: 'center',
        fontSize: 24,
        strokeThickness: 6,
        lineHeight: 32,
    }),

    SelectSexualOrientationInfo: {
        ...DefaultTextStyle,
        fontSize: 36,
        wordWrap: true,
        wordWrapWidth: 700,
        align: 'center',
    },
    WinLineValue: new TextStyle({
        fontFamily,
        fontSize: 85,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
   TotalWinValue: new TextStyle({
        fontFamily,
        fontSize: 100,
        ...TextFill,
        align: 'center',
       stroke: 0x350406,
       strokeThickness: 8,
       dropShadow: true,
       dropShadowAngle: 0,
       dropShadowBlur: 20,
       dropShadowDistance: 0,
       dropShadowAlpha: 0.8
    }),
    BigWinValue: new TextStyle({
        fontFamily,
        fontSize: 120,
        fill: 0xFFD900,
        align: 'center',
        stroke: 0x350406,
        strokeThickness: 8,
    }),
    FreeSpinsIntroCount: new TextStyle({
        fontFamily,
        fontSize: 60,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
    FreeSpinsIntro: new TextStyle({
        fontFamily,
        fontSize: 24,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
    FreeSpinsHeaderTitle: new TextStyle({
        fontFamily,
        fontSize: 35,
        fill: 0x84E2FB,
        fontWeight: 'bold',
        align: 'center',
    }),
    FreeSpinsHeaderCount: new TextStyle({
        fontFamily,
        fontSize: 35,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
    CascadeValueTitleOpen: new TextStyle({
        fontFamily,
        fontSize: 14,
        fill: 0xFFFFFF,
        fontWeight: 'bold',
        align: 'center',
    }),
    CascadeValueTitleClose: new TextStyle({
        fontFamily,
        fontSize: 14,
        fill: 0x112F48,
        fontWeight: 'bold',
        align: 'center',
    }),
    CascadeValueOpen: new TextStyle({
        fontFamily,
        fontSize: 40,
        fill: 0xFFFFFF,
        fontWeight: 'bold',
        align: 'center',
    }),
    CascadeValueClose: new TextStyle({
        fontFamily,
        fontSize: 40,
        fill: 0x112F48,
        fontWeight: 'bold',
        align: 'center',
    }),
    bonusTargetValue: new TextStyle({
        fontFamily,
        fontSize: 65,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),

    bonusOneWinValue: new TextStyle({
        fontFamily,
        fontSize: 200,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
    bonusOneMultiplierValue: new TextStyle({
        fontFamily,
        fontSize: 110,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
    bonusTwoWinValue: new TextStyle({
        fontFamily,
        fontSize: 110,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
    bonusWinValue: new TextStyle({
        fontFamily,
        fontSize: 180,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
    bonusTitle: new TextStyle({
        fontFamily,
        fontSize: 100,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
    freeSpinsIntroTitle: new TextStyle({
        fontFamily,
        fontSize: 36,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
    freeSpinsIntroCount: new TextStyle({
        fontFamily,
        fontSize: 95,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
    freeSpinsOutroCount: new TextStyle({
        fontFamily,
        fontSize: 95,
        fill: 0xFCFEFA,
        fontWeight: 'bold',
        align: 'center',
    }),
    TimeStyle: new TextStyle({
        fontFamily,
        fontSize: 20,
        fill: 0xffffff,
        fontWeight: 'bold',
        align: 'center',
    }),
    LabelValueTitle:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 12,
        fill: 0xffffff,
        align: 'center'
    }),
    LabelValue:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 24,
        align: 'center',
    }),

    ProgressButtonTitleDefault:  new TextStyle({
        ...DefaultTextStyle,
        fill: 0xffffff,
        fontSize: 12,
        align: 'center',
    }),

    CurrentXPTitle:  new TextStyle({
        ...DefaultTextStyle,
        fill: 0xffffff,
        strokeThickness: 1,
        stroke: 0x000000,
    }),

    CurrentXPValue:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 40,
    }),

    ProgressButtonTitlePressed:  new TextStyle({
        ...DefaultTextStyle,
        fill: 0xffffff,
        fontSize: 12,
        align: 'center',
    }),
    ProgressButtonTitleHover:  new TextStyle({
        ...DefaultTextStyle,
        fill: 0xffffff,
        fontSize: 12,
        align: 'center',
    }),
    PayTableTitle:  new TextStyle({
        fontFamily,
        fontSize: 45,
        fill: 0xffffff,
        fontWeight: 'bold',
        align: 'center',
    }),
    SettingSliderTitle:  new TextStyle({
       ...DefaultTextStyle,
        "fontSize": 36,
        "stroke": "#000000",
        "strokeThickness": 3
    }),
    SettingSliderValue:  new TextStyle({
        ...DefaultTextStyle,
        "fontSize": 36,
        "stroke": "#000000",
        "strokeThickness": 3,
        align: 'center'
    }),

    CheckBoxWithLabel:  new TextStyle({
        ...DefaultTextStyle,
        "fontSize": 36,
        "stroke": "#000000",
        "strokeThickness": 3
    }),
    PopupTitle:  new TextStyle({
        ...DefaultTextStyle,
        align: 'center',
        "fontSize": 50,
    }),
    NoFunds:  new TextStyle({
        fontFamily,
        "fill": [
            "#ffd900",
            "#e74d00"
        ],
        "fillGradientStops": [
            0.23,
            1
        ],
        "fontSize": 50,
        "lineJoin": "round",
        "miterLimit": 15,
        "stroke": "#350406",
        "strokeThickness": 3,
        dropShadow: true,
        dropShadowAlpha: 0.5,
        dropShadowAngle: 1.1,
        dropShadowBlur: 5,
        dropShadowColor: "#000000",
        dropShadowDistance: 0,
        align: 'center',
    }),
    SessionExpired:  new TextStyle({
        fontFamily,
        "fill": [
            "#ffd900",
            "#e74d00"
        ],
        "fillGradientStops": [
            0.23,
            1
        ],
        "fontSize": 45,
        "lineJoin": "round",
        "miterLimit": 15,
        "stroke": "#350406",
        "strokeThickness": 3,
        dropShadow: true,
        dropShadowAlpha: 0.5,
        dropShadowAngle: 1.1,
        dropShadowBlur: 5,
        dropShadowColor: "#000000",
        dropShadowDistance: 0,
        align: 'center',
    }),
    SelectBetSelected:  new TextStyle({
        fontFamily,
        fontSize: 50,
        fill: 0xffffff,
        fontWeight: 'bold',
    }),

    SelectBetUnselected:  new TextStyle({
        fontFamily,
        fontSize: 50,
        fill: 0xFAFAFE,
        fontWeight: 'bold',
    }),

    NoFundsPopupTitle:  new TextStyle({
        fontFamily,
        fontSize: 50,
        wordWrap: true,
        wordWrapWidth: 740,
        fill: 0xffffff,
        fontWeight: 'bold',
        align: 'center',
    }),

    BonusGameTitle:  new TextStyle({
        fontFamily,
        fontSize: 80,
        fill: 0xFFFFFf,
        fontWeight: 'bold',
        align: 'center',
    }),
    SymbolPayoutInfoNumbers:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 24,
    }),
    SymbolPayoutInfoPayout:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 24,
        "fill": 0xffffff,
        lineHeight: 22
    }),

    ButtonWithTitle_btn_default:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 30,
        align: 'center',
    }),

    ButtonWithTitle_btn_pressed:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 30,
        align: 'center',
    }),

    ButtonWithTitle_btn_hover:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 30,
        dropShadow: true,
        dropShadowAngle: 0,
        dropShadowDistance: 2,
        align: 'center',
    }),

    ButtonWithTitle_btn_disabled:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 30,
        align: 'center',
    }),

    ShopItemDescription:  new TextStyle({
        ...DefaultTextStyle,
        fontSize: 19,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 250,
    }),

    infoText:  new TextStyle({
        fontFamily,
        fontSize: 24,
        fill: 0xE87B07,
        stroke: 0x350406,
        strokeThickness: 4,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 380,
    }),

    InfoPageDescription:  new TextStyle({
        fontFamily,
        fontSize: 30,
        fill: 0xE87B07,
        stroke: 0x350406,
        strokeThickness: 8,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 1070,
    }),

    BonusInfoDescription:  new TextStyle({
        fontFamily,
        fontSize: 30,
        fill: 0xE87B07,
        stroke: 0x350406,
        strokeThickness: 8,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 300,
    }),

    SpecialSymbolDescription:  new TextStyle({
        fontFamily,
        fontSize: 24,
        fill: 0xE87B07,
        stroke: 0x350406,
        strokeThickness: 8,
        wordWrap: true,
        wordWrapWidth: 350,
    }),

    SuccessfulPurchaseTitle:  new TextStyle({
        fontFamily,
        fontSize: 42,
        "fill": [
            "#FFD900",
            "#E74D00"
        ],
        "fillGradientStops": [
            0.23,
            1
        ],
        stroke: 0x350406,
        strokeThickness: 8,
        align: 'center',
    }),

    SuccessfulPurchaseSubTitle:  new TextStyle({
        fontFamily,
        fontSize: 24,
        fill: 0xFFFFFF,
        stroke: 0x350406,
        strokeThickness: 2,
        align: 'center',
    }),

    BuyBonusIconCount:  new TextStyle({
        fontFamily,
        fontSize: 40,
        "fill": [
            "#FFD900",
            "#E74D00"
        ],
        "fillGradientStops": [
            0.23,
            1
        ],
        stroke: 0x350406,
        strokeThickness: 8,
        align: 'center',
    }),

    BuyBonusIconTitle:  new TextStyle({
        fontFamily,
        fontSize: 60,
        "fill": [
            "#FFD900",
            "#E74D00"
        ],
        "fillGradientStops": [
            0.23,
            1
        ],
        stroke: 0x350406,
        strokeThickness: 8,
        align: 'center',
    }),

    PopupWinText:  new TextStyle({
        fontFamily,
        fontSize: 100,
        "fill": [
            "#FFD900",
            "#E74D00"
        ],
        "fillGradientStops": [
            0.23,
            1
        ],
        stroke: 0x350406,
        strokeThickness: 8,
        align: 'center',
        dropShadow: true,
        dropShadowAngle: 0,
        dropShadowBlur: 20,
        dropShadowDistance: 0,
        dropShadowAlpha: 0.8
    }),
};
