import * as PIXI from "pixi.js";
import {services} from "../ServiceLocator";
import { Signal } from "signals";


export default class Screen
{
    // #region Attributes //

    _id = null;
    _root = null;
    
    // Signals.
    _onNavigateTo = new Signal();

    // #endregion //


    // #region Properties //

    get id() { return this._id; }
    get root() { return this._root; }

    // Signals.
    get onNavigateTo() { return this._onNavigateTo; }

    // #endregion //


    // #region Methods //

    constructor( id )
    {
        this._id = id;
    }

    // virtual.
    onEnter()
    {
        this._root = new PIXI.Container();
        services.app.root.addChild( this._root );
    }

    // virtual.
    onLeave()
    {        
        services.app.root.removeChild( this._root );
        this._root.destroy( { children: true } );
        this._root = null;

        this._onNavigateTo.removeAll();
    }

    // virtual.
    onUpdate( dt ) {}

    // #endregion //
}
