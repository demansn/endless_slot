import {Service} from "./Service";

export class Styles extends Service {
    get(name) {
        if (!this.options[name]) {
            console.error(`Style with name ${name} not found`);
            return {};
        }

        return this.options[name];
    }
}
