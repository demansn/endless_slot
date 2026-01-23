import signals from "signals";


export default class DeviceOrientation
{
    _orientation = null;
    _portraitMediaQueryList = null;

    _onChanged = null;


    get orientation() { return this._orientation; }

    get onChanged() { return this._onChanged; }


    constructor()
    {
        this._onChanged = new signals.Signal();

        this._portraitMediaQueryList = window.matchMedia( "(orientation: portrait)" );
        this._portraitMediaQueryList.addEventListener( "change", this._onPortraitMediaQueryList_Changed.bind( this ) );
   
        this._orientation = this._findOrientation();
    }

        _findOrientation()
        {
            let result = null;

            if ( this._portraitMediaQueryList.matches ) 
            {
                result = device_orientation_type.PORTRAIT;
            } 
            else 
            {
                result = device_orientation_type.LANDSCAPE;
            }

            return result;
        }

        _onPortraitMediaQueryList_Changed( mediaQueryList )
        {
            this._orientation = this._findOrientation();

            this._onChanged.dispatch( this._orientation );
        }
}

export const device_orientation_type = {
    PORTRAIT: 0,
    LANDSCAPE: 1 };
Object.freeze( device_orientation_type );