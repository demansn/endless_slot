import {Mather} from "../../lib/objects/Mather";
import MyButton from "../../lib/MyButton";

Mather.registerObjectFactory("SettingsButton", () => {
    return new MyButton( { on: "settings_options_default_btn", hover: "settings_options_hover_btn", pressed: "settings_options_pressed_btn" } );
});
