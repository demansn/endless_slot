import * as PIXI from "pixi.js";
import gsap from "gsap";
import {services} from "../ServiceLocator";
import Utils from "../Utils";


export default class Card extends PIXI.Container
{
    _index = null;

    _base = null;
    _anim = null;

    _cm = null;


    get index() { return this._index; }


    constructor( index )
    {
        super();

        this._index = index;

        this._anim = new PIXI.AnimatedSprite( Utils.createTexArray( "supergame_card_back_", 31+1 ) );
        this._anim.anchor.set( 0.5 );
        this._anim.loop = false;
        this._anim.autoUpdate = false;
        this._anim.animationSpeed = 30;//60;
        this.addChild( this._anim );

        this._cm = new PIXI.filters.ColorMatrixFilter()
        this._cm.brightness( 0.9, false );
    }

    update( dt )
    {
        this._anim.update( dt );
    }

    reveal( frontIndex, cb, cbContext )
    {
        gsap.delayedCall( 0.3, () => { services.audio.playSfx( "17.0_ver_2" ); } );
        if(frontIndex === 2) gsap.delayedCall( 0.9, () => { services.audio.playSfx( "18.0_ver_1" ); } );

        let textureCount = 15+1;
        if(frontIndex >= 2) textureCount = 50+1;

        this._anim.textures = this._anim.textures.concat( Utils.createTexArray( "supergame_card_" + frontIndex.toString() + "_", textureCount ) );
        this._anim.play();
        this._anim.onComplete = () =>
        {
            cb.call( cbContext );

            if(frontIndex !== 2) return;

            const newTextures = Utils.createTexArray( "supergame_card_" + frontIndex.toString() + "_", textureCount );
            this._anim.textures = [...newTextures.slice(17, newTextures.length-7).reverse(), ...newTextures.slice(17, newTextures.length-6)];
            this._anim.loop = true;
            this._anim.onComplete = () => {};
            this._anim.play();

            services.audio.playSfx("19.0_ver_1", {loop:true, restrictRepetition:true});
        };
    }

    onPointerOver()
    {
        this.filters = [ this._cm ];
    }

    onPointerTap()
    {
        this.filters = [];
    }

    onPointerOut()
    {
        this.filters = [];
    }
}
