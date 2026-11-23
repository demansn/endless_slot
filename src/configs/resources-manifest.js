import FromFigma from '../../assets/img/meta.json';

export const manifest = {
    bundles: [
        {
           name: 'logo',
           assets: [
               {alias: 'config', src: './assets/config.json'},
               {alias: 'company_logo', src: './assets/img/company/logo@2x.png'},
               {alias: 'company_title_start', src: './assets/img/company/title_start.png'},
               {alias: 'company_title_end', src: './assets/img/company/title_end.png'},
               {alias: 'loading_bar', src: './assets/img/company/loading_bar.png'},
               {alias: 'loading_bar_base', src: './assets/img/company/loading_bar_base.png'},
               {alias: 'rotate_logo', src: './assets/img/rotate/logo.png', platform: 'mobile'},
               {alias: 'rotate_bg', src: './assets/img/rotate/bg.png', platform: 'mobile'},
               {alias: 'rotate_phone', src: './assets/img/rotate/phone.png', platform: 'mobile'},
           ]
        },
        {
            name: 'preloader',
            assets: [
                {"alias":"ok_btn_default","src":"./assets/img/buttons/ok/default.png"},
                {"alias":"ok_btn_hover","src":"./assets/img/buttons/ok/hover.png"},
                {"alias":"ok_btn_pressed","src":"./assets/img/buttons/ok/pressed.png"},
                {"alias":"ok_btn_disabled","src":"./assets/img/buttons/ok/disabled.png"},
            ]
        },
        {
            "name": "main",
            "assets": [
                // spine animation/
                {"alias": "BackgroundData", "src": "./assets/spine/Background/Background.json"},
                {"alias": "BackgroundAtlas", "src": "./assets/spine/Background/Background.atlas"},

                {"alias": "CharactersData", "src": "./assets/spine/Characters/Characters.json"},
                {"alias": "CharactersAtlas", "src": "./assets/spine/Characters/Characters.atlas"},

                {"alias": "lvlData", "src": "./assets/spine/lvl/lvl.json"},
                {"alias": "lvlAtlas", "src": "./assets/spine/lvl/lvl.atlas"},

                {"alias": "OtherGamesData", "src": "./assets/spine/Other_Games/Other_Games.json"},
                {"alias": "OtherGamesAtlas", "src": "./assets/spine/Other_Games/Other_Games.atlas"},

                {"alias": "payLineData", "src": "./assets/spine/PayLine/Symbols.json"},
                {"alias": "payLineAtlas", "src": "./assets/spine/PayLine/Symbols.atlas"},

                {"alias": "PopupData", "src": "./assets/spine/PopUp/Popup.json"},
                {"alias": "PopupAtlas", "src": "./assets/spine/PopUp/Popup.atlas"},

                {"alias": "symbolsData", "src": "./assets/spine/Symbols/Symbols.json"},
                {"alias": "symbolsAtlas", "src": "./assets/spine/Symbols/Symbols.atlas"},
            ]
        }
    ],
};

const preloaderBundle = manifest.bundles.find(item => item.name === 'preloader');
const mainBundle = manifest.bundles.find(item => item.name === 'main');

FromFigma.forEach(item => {
    if (item.src.includes('assets/img/preloader') && preloaderBundle) {
        preloaderBundle.assets.push(item);
    } else if (mainBundle) {
        mainBundle.assets.push(item);
    }
})
