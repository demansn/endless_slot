
export default class DummyDb
{
    // #region Attributes //

    // private:
    _data = null;

	_saveName = null;

    // Constants.
    _kVersion = 9;

    // #endregion //


    // #region Properties //

    get data() { return this._data; }

    // #endregion //


    // #region Methods //

    // public:

    load( sessionId )
    {
        return this.createDefaultData();

        this._saveName = "cc-db-" + sessionId;

        const kDataBase64 = window.localStorage.getItem( this._saveName );
        if ( kDataBase64 )
        {
            const kDataStr = window.atob( kDataBase64 );
            this._data = JSON.parse( kDataStr );

            if ( this._data.version == undefined || this._data.version != this._kVersion )
            {
                // Outdated.
                this.createDefaultData();
            }
        }
        else
        {
            this.createDefaultData();
        }
    }

        createDefaultData()
        {
            this._data = {};

            this.save();
        }

    save()
    {
        const kDataStr = JSON.stringify( this._data );
        const kDataBase64 = window.btoa( kDataStr );
        window.localStorage.setItem( this._saveName, kDataBase64 );
    }
}
