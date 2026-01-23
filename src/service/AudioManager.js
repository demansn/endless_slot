import { Howl } from "howler";

export default class AudioManager
{
    // #region Attributes //

    // private:

    _arrVolume = null;
    _arrRelativeVolume = null;
    _arrMute = null;

    _arrSoundCollection = null;
    _arrPausedHowl = null;

    _curMusicName = null; // only one music track is played at a time.

    _isGlobalMute = null;

    // #endregion //


    // #region Properties //

    get isMuteSfx() { return this._arrMute[ track_id.SFX ]; }
    get isMuteMusic() { return this._arrMute[ track_id.MUSIC ]; }
    get isMuteAmbient() { return this._arrMute[ track_id.AMBIENT ]; }
    get isGlobalMute() { return this._isGlobalMute; }

    // #endregion //


    // #region Methods //

    // public:

    constructor()
    {
        this._arrVolume = [ 1, 1, 0.4 ];
        this._arrMute = [ false, false, false ];

        this._arrSoundCollection = [ new Map(), new Map(), new Map() ];
        this._arrSoundCollection = [ new Map(), new Map(), new Map() ];
        this._arrPausedHowl = [ [], [], [] ];

        this._curMusicName = null; // only one music track is played at a time.

        this._isGlobalMute = false;
    }

    load( arrSoundLoadGroup )
    {
        for ( let addSoundGroup of arrSoundLoadGroup )
        {
            for ( let soundName of addSoundGroup.arrName )
            {
                // Skip repeated sounds.
                let mapSound = this._arrSoundCollection[ addSoundGroup.trackId ];
                if ( !mapSound.has( soundName ) )
                {
                    // Create array with full paths including the extensions.
                    const kUrl = addSoundGroup.basePath + soundName;
                    let arrUrlWithExtension = [];
                    for ( let extension of addSoundGroup.arrExtension )
                    {
                        arrUrlWithExtension.push( kUrl + "." + extension );
                    }
                    let howl;
                    if (soundName === "14_Money_Counting") {
                        howl = new Howl( {
                            src : arrUrlWithExtension,
                            autoplay : false,
                            sprite: {
                                "__default": [100, 900]
                            },
                            onloaderror : function( soundId, error ) {
                                if ( this._kIsDebugMode )
                                {
                                    console.warn( "[AudioManager] Error loading sound:" + soundId + ", with error: " + error );
                                }
                            }
                        } );
                    } else {
                        howl = new Howl( {
                            src : arrUrlWithExtension,
                            autoplay : false,
                            onloaderror : function( soundId, error ) {
                                if ( this._kIsDebugMode )
                                {
                                    console.warn( "[AudioManager] Error loading sound:" + soundId + ", with error: " + error );
                                }
                            }
                        } );
                    }



                    mapSound.set( soundName, howl );
                }
            }
        }
    }

    removeSounds( arrSoundName, trackId )
    {
        let mapSound = this._arrSoundCollection[ trackId ];
        for ( let soundName of arrSoundName )
        {
            let howl = mapSound.get( soundName );
            if ( howl != null )
            {
                // Cleanup the howl.
                if ( howl.playing() )
                {
                    howl.stop();
                }
                howl.unload();
                howl = null;

                // Remove the entry from the map.
                mapSound.delete( soundName );
            }
        }
    }

    hasSound( soundName, trackId )
    {
        return this._arrSoundCollection[ trackId ].has( soundName );
    }

    isPlayingSound( soundName, trackId )
    {
        return this.findPlayingSound( soundName, trackId ) != null;
    }

    playSfx( name, params = null )
    {
        let result = null;

        if ( !this.hasSound( name, track_id.SFX ) )
        {
            console.warn( "AudioManager.ts :: playSfx() :: cannot find Howl for name: " + name );
        }
        else
        {
            // Check for existing sound.
            result = this.findPlayingSound( name, track_id.SFX );
            if ( result && params && params.restrictRepetition )
            {
                if ( result.duration() * result.seek() > 1 )
                {
                    result.play(); // simple way for allowing playing multiple instances of the same sound.
                }
            }
            else
            {
                // Play the howl.
                if ( result )
                {
                    result.stop();
                }
                result = this.play( name, params, track_id.SFX );
            }
        }

        return result;
    }

    playMusic( name, params = null )
    {
        let result = null;

        this.stopMusic();
        result = this.play( name, params, track_id.MUSIC );

        this._curMusicName = name;

        return result;
    }

    playSelectedMusic( name, params = null )
    {
        let result = null;

        result = this.play( name, params, track_id.MUSIC );

        return result;
    }

    /**
     * Plays an ambient sound.
     * @param {string}      name - the name of a sound.
     * @param {IPlayParams} params - The params for the sound.
     * @returns {Howl}
     */
     playAmbient( name, params )
     {
         let result = null;

         // Check for existing sound.
         result = this.findPlayingSound( name, track_id.AMBIENT );
         if ( !result )
         {
             // Play the howl.
             result = this.play( name, params, track_id.AMBIENT );
         }

         return result;
     }

    changeVolume( volume, trackId )
    {
        this._arrVolume[ trackId ] = volume;

        let entriesIt = this._arrSoundCollection[ trackId ].entries();
        for ( let entriesItResult = entriesIt.next(); !entriesItResult.done; entriesItResult = entriesIt.next() )
        {
            let howl = entriesItResult.value[ 1 ];
            if ( howl.playing() )
            {
                howl.volume( volume * howl._localVolume );
            }
        }
    }

    mute( isMute, trackId )
    {
        this._arrMute[ trackId ] = isMute;

        this.updateSoundMuteStatus( isMute || this._isGlobalMute, trackId );
    }

    muteGlobal( isMute )
    {
        this._isGlobalMute = isMute;

        for ( let trackId = track_id.SFX; trackId <= track_id.AMBIENT; ++trackId )
        {
            this.updateSoundMuteStatus( this._arrMute[ trackId ] || isMute, trackId );
        }
    }

    stopSfx( name = null )
    {
        if ( name )
        {
            let howl = this.findPlayingSound( name, track_id.SFX );
            if ( howl != null )
            {
                howl.stop();
            }
        }
        else
        {
            this._arrSoundCollection[ track_id.SFX ].forEach( ( value, key ) => {
                value.stop();
            } );
        }
    }

    stopAmbient( name = null )
    {
        if ( name )
        {
            let howl = this.findPlayingSound( name, track_id.AMBIENT );
            if ( howl != null )
            {
                howl.stop();
            }
        }
        else
        {
            this._arrSoundCollection[ track_id.AMBIENT ].forEach( ( value, key ) => {
                value.stop();
            } );
        }
    }

    stopMusic()
    {
        if ( this._curMusicName != null )
        {
            // Utils.log( "AudioManager.ts :: fading-out " + this._curMusicName );

            let howl = this._arrSoundCollection[ track_id.MUSIC ].get( this._curMusicName );
            howl.stop();

            this._curMusicName = null;
        }
    }

    stopSelectedMusic(selectedMusicName)
    {
        if ( selectedMusicName != null )
        {
            // Utils.log( "AudioManager.ts :: fading-out " + this._curMusicName );

            let howl = this._arrSoundCollection[ track_id.MUSIC ].get( selectedMusicName );
            howl.stop();
        }
    }

    pauseMusic()
    {
        if ( this._curMusicName != null )
        {
            // Utils.log( "AudioManager.ts :: fading-out " + this._curMusicName );

            let howl = this._arrSoundCollection[ track_id.MUSIC ].get( this._curMusicName );
            howl.pause();
        }
    }

    resumeMusic()
    {
        if ( this._curMusicName != null )
        {
            // Utils.log( "AudioManager.ts :: fading-out " + this._curMusicName );

            let howl = this._arrSoundCollection[ track_id.MUSIC ].get( this._curMusicName );
            howl.play();
        }
    }

    pauseSfx()
    {
        this._arrPausedHowl[ track_id.SFX ].splice( 0 )

        this._arrSoundCollection[ track_id.SFX ].forEach( ( value, key ) => {
            if ( value.playing() )
            {
                value.pause();
                this._arrPausedHowl[ track_id.SFX ].push( value );
            }
        } );
    }

    resumeSfx()
    {
        for ( let howl of this._arrPausedHowl[ track_id.SFX ] )
        {
            howl.play();
        }
        this._arrPausedHowl[ track_id.SFX ].splice( 0 );
    }

    stopPausedSfx()
    {
        for ( let howl of this._arrPausedHowl[ track_id.SFX ] )
        {
            howl.stop();
        }
        this._arrPausedHowl[ track_id.SFX ].splice( 0 );
    }

    // private:

    play( name, params, trackId )
    {
        //console.trace(name);
        let result = null;

        // parse the params.
        params = params || {};
        params.randomStart = params.randomStart != undefined ? params.randomStart : false;
        params.loop = params.loop != undefined ? params.loop : false;
        params.volumeRatio = params.volumeRatio != undefined ? params.volumeRatio : 1;
        params.onComplete = params.onComplete || null;
        params.onCompleteScope = params.onCompleteScope || window;

        // Find the howl;
        let mapSound = this._arrSoundCollection[ trackId ];
        result = mapSound.get( name );
        if ( result )
        {
            // Setup the howl.
            // Volume.
            result._localVolume = params.volumeRatio;
            result.volume( this._arrVolume[ trackId ] * params.volumeRatio );
            result.mute( this._arrMute[ trackId ] || this._isGlobalMute );
            // Random start.
            if ( params.randomStart )
            {
                result.seek( result.duration() * Math.random() );
            }
            // Loop.
            result.loop( params.loop );
            // Mute.
            // Callbacks.
            result.off( "end" );
            if ( params.onComplete )
            {
                result.once( "end", function() {
                    if ( params.onComplete )
                    {
                        params.onComplete.call( params.onCompleteScope );
                    }
                }.bind( this ) );
            }

            // Play the howl.
            result.play();
        }

        return result;
    }

    updateSoundMuteStatus( isMute, trackId )
    {
        let mapSound = this._arrSoundCollection[ trackId ];
        let entriesIt = mapSound.entries();
        for ( let entriesItResult = entriesIt.next(); !entriesItResult.done; entriesItResult = entriesIt.next() )
        {
            let howl = entriesItResult.value[ 1 ];
            howl.mute( isMute );
        }
    }

    changeSFXVolume( volume ){
        this.changeVolume(volume, track_id.SFX);
    }

    changeMusicVolume( volume ){
        this.changeVolume(volume, track_id.MUSIC);
    }

    findPlayingSound( name, trackId )
    {
        let result = null;

        let mapSound = this._arrSoundCollection[ trackId ];
        if ( mapSound.has( name ) )
        {
            const kFoundHowl = mapSound.get( name );
            if ( kFoundHowl.playing() )
            {
                result = kFoundHowl;
            }
        }

        return result;
    }

    // #endregion //
}

export const track_id = {
    SFX: 0,
    MUSIC: 1,
    AMBIENT: 2 };
Object.freeze( track_id );

/*export interface IPlayParams
{
    randomStart?;
    loop?;
    restrictRepetition?;
    volumeRatio?: number;
    onComplete?: () => void;
    onCompleteScope?: any;
}

export interface ISoundLoadGroup
{
    basePath;
    arrName: Array<string>;
    trackId;
    arrExtension: Array<string>;
}*/
