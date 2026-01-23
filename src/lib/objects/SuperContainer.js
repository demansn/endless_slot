import {gsap} from "gsap";
import {Container} from "pixi.js";
import {Mather} from "./Mather.js";
import {DisplayObjectStateMachine} from "./DisplayObjectStateMachine.js";
import {FrameLayout} from "../FrameLayout";

export class SuperContainer extends Container {
    static textures = null;
    static styles = null;
    static layers = null;
    static screenSize = {width: 0, height: 0};
    static rendererSize = {width: 0, height: 0};
    static data;

    #mather = null;

    /**
     * @type {{width: number, height: number}}
     */
    screenSize = {width: 0, height: 0};
    /**
     * @type {{width: number, height: number}}
     */
    rendererSize = {width: 0, height: 0};

    /**
     * @type {DataModel }
     */
    data = null;

    /**
     * @type {FrameLayout}
     */
    #layout = null;

    /**
     *
     * @param layout {FrameLayoutConfig}
     */
    constructor({layout} = {}) {
        super();

        if (!SuperContainer.textures || !SuperContainer.styles || !SuperContainer.layers) {
            throw new Error('SuperContainer: textures, styles and layers must be set before creating gameObjects');
        }

        this.screenSize = SuperContainer.screenSize;
        this.rendererSize = SuperContainer.rendererSize;
        this.#mather = new Mather(this, SuperContainer.textures, SuperContainer.styles, SuperContainer.layers, SuperContainer.screenSize);
        this.state = new DisplayObjectStateMachine(this);
        this.data = SuperContainer.data;

        if (layout) {
            this.#layout = new FrameLayout(layout);
        }

        this.animations = [];
    }

    timeline(...args) {
        const tl = gsap.timeline(...args);

        this.animations.push(tl);

        return tl;
    }

    to(...args) {
        const tl = gsap.to(...args);

        this.animations.push(tl);

        return tl;
    }

    addChild(...children) {
        const objects =  super.addChild(...children);

        this.updateLayout();

        return objects;
    }

    addObject(name, parameters = {}, props = {}) {
        const object = this.#mather.object(name, {parameters, ...props});

        this.updateLayout();

        return object;
    }

    updateLayout() {
        if (this.#layout ) {
            this.#layout.applyLayout(this.children);
        }
    }

    getObjectByName(name) {
        return this.#findObjectByType(name);
    }

    #findObjectByType(name, children = this.children) {
        const object = children.find((child) => child.name === name);

        if (object) {
            return object;
        }

        for (let i = 0; i < children.length; i++) {
            if (children[i].children) {
                const object = this.#findObjectByType(name, children[i].children);
                if (object) {
                    return object;
                }
            }
        }
    }
}
