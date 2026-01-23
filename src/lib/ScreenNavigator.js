import TeamSelectionScreen from "../screen/TeamSelectionScreen";
import GameScreen from "../screen/GameScreen";


export default class ScreenNavigator
{
    _curScreen = null;


    init() {}

    end()
    {
        this._curScreen.onLeave();
        this._curScreen = null;
    }

    update( dt )
    {
        if ( this._curScreen )
        {
            this._curScreen.onUpdate( dt );
        }
    }

    navigateTo( screenId, params = null )
    {
        if ( this._curScreen )
        {
            this._curScreen.onLeave();
        }
        this._curScreen = this._createScreen( screenId );
        this._curScreen.onEnter( params );

        this._curScreen.onNavigateTo.addOnce( this._onNavigateTo_Requested, this );
    }

            _createScreen( id )
            {
                let result = null;

                switch ( id )
                {
                    case screen_id.TEAM_SELECTION: { result = new TeamSelectionScreen(); break; }
                    case screen_id.GAME: { result = new GameScreen(); break; }

                    // TODO: More?
                }

                return result;
            }

            _onNavigateTo_Requested( screenId, params = null )
            {
                this.navigateTo( screenId, params );
            }
}

export const screen_id = 
{
    TEAM_SELECTION: 0,
    GAME: 1

    // TODO: More?
}