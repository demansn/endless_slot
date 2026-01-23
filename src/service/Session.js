import {services} from "../ServiceLocator";
import Utils from "../Utils";
import {Service} from "./Service";

export class Session extends Service
{
    _id = null;
    _balance = null;
    _freespins = null;
    _bet = null;
    _lastSpin = null;
    _demo = null;
    _paytable = null;
    _currency = null;

    set id( value ) { this._id = value; }
    set balance( value ) { this._balance = value; }
    set freespins( value ) { this._freespins = value; }
    set bet( value ) { this._bet = value; }
    set lastSpin( value ) { this._lastSpin = value; }
    set paytable( value ) { this._paytable = value; }
    get id() { return this._id; }
    get balance() { return this._balance; }
    get freespins() { return this._freespins; }
    get bet() { return this._bet; }
    get lastSpin() { return this._lastSpin; }
    get demo() { return this._demo; }
    get paytable() { return this._paytable; }
    get currency() { return this._currency; }

    init() {
        const kUrlParams = new URLSearchParams( window.location.search );
        this._id = kUrlParams.has( "session" ) ? kUrlParams.get( "session" ) : null;

        this._demo = kUrlParams.has( "demo" ) ? kUrlParams.get( "demo" ) : 0;

        if ( kUrlParams.has( "balance" ) )
        {
            this._balance = Utils.tryParse( kUrlParams.get( "balance" ) );
        }
        else if ( services.config.isOfflineMode )
        {
            this._balance = 0;
        }
    }
}
