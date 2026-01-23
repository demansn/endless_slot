import {services} from "../ServiceLocator";
import Utils from "../Utils";
import DummyDb from "./DummyDb";


export default class DummyServer
{
    _isWin = null;

    _db = null;


    constructor()
    {
        this._db = new DummyDb();
        this._db.load( services.session.id );

        this._isWin = false;
    }

    post( url, params )
    {
        let response = null;

        switch ( url )
        {
            case "/spin": { response = this._spin( params ); break; }
            case "/freespin": { response = this._freespin( params ); break; }
            case "/player": { response = this.player( params ); break; }
            case "/orange-supergame": { response = this.orangeSupergame( params ); break; }
            case "/blue-supergame": { response = this.blueSupergame( params ); break; }
        }

        return response;
    }

        _spin( params )
        {
            /*
            params.bet
            params.balance
            */
            let result = {
                data: {

                }
            };

            let generatedSpin = null;

            if ( services.config.isSupergameOne )
            {
                let winSlotId = ["rune-orange-1", "rune-orange-2"];
                generatedSpin = this._generateWinnerSpin(winSlotId[Utils.randomInteger(0, winSlotId.length - 1)]);
            }
            else if ( services.config.isSupergameTwo )
            {
                let winSlotId = ["rune-blue-1", "rune-blue-2"];
                generatedSpin = this._generateWinnerSpin(winSlotId[Utils.randomInteger(0, winSlotId.length - 1)]);
            }
            else if ( services.config.isOnlyBlueHigh )
            {
                generatedSpin = this._generateWinnerSpin("big-blue");
            }
            else if ( services.config.isOnlyOrangeHigh )
            {
                generatedSpin = this._generateWinnerSpin("big-orange");
            }
            else generatedSpin = this._isWin ? this._generateWinnerSpin() : this._generateLoserSpin();


            let {spins, orangeCombinations, blueCombinations, payouts} = this._processSpin(generatedSpin);

            this._db.data.lastSpin = result.data;
            this._db.data.orange_supergame_left += orangeCombinations;
            this._db.data.blue_supergame_left += blueCombinations;
            this._db.data.orange_supergame_left = Math.min(this._db.data.orange_supergame_left, this._db.data.orange_supergame_total);
            this._db.data.blue_supergame_left = Math.min(this._db.data.blue_supergame_left, this._db.data.blue_supergame_total);
            //this._db.save();

            result.data.spins = spins;
            result.data.payouts = payouts.map(multi => ({ multi, win: result.data.bet * multi}));
            result.data.after_balance += result.data.payouts.reduce((prev, cur) => prev + cur.win, 0);

            result.data.orange_supergame_left = this._db.data.orange_supergame_left;
            result.data.blue_supergame_left = this._db.data.blue_supergame_left;
            //console.log(result.data);

            this._isWin = !this._isWin;

            if ( result.data.orange_supergame_left >= result.data.orange_supergame_total )
            {
                result.data.orange_supergame = 1;
                result.data.orange_supergame_hash = "kinda_hash";
                this._db.data.orange_supergame_hash = "kinda_hash";

                //generate 10 spins inside orange game
                let multiplier = [2, 4, 10][Utils.randomInteger(0, 2)];
                result.data.orange_supergame_multi = multiplier;
                this._db.data.orange_supergame_multi = multiplier;

                this._db.data.orange_supergame_generated_spins = new Array(10);

                for(let i = 0; i < 10; i++)
                {
                    let spinObjRaw = Utils.randomBoolean() ? this._generateLoserSpin() : this._generateWinnerSpin();

                    let {spins, orangeCombinations, blueCombinations, payouts} = this._processSpin(spinObjRaw);

                    payouts = payouts.map(multi => ({ multi, win: params.bet * multi}));

                    this._db.data.orange_supergame_generated_spins[i] =
                    {
                        "status": "success",
                        "bet": params.bet,
                        "before_balance": null,
                        "after_balance": null,
                        "spins": spins,
                        "payouts": payouts
                    };
                }
            }

            if ( result.data.blue_supergame_left >= result.data.blue_supergame_total )
            {
                result.data.blue_supergame = 1;
                result.data.blue_supergame_hash = "kinda_hash";
                this._db.data.blue_supergame_hash = "kinda_hash";

                let generatedResponse = {
                    data: {
                        "status": "success",
                        "blue_supergame_multi": undefined,
                        "blue_supergame_win": undefined,
                        "before_balance": undefined,
                        "after_balance": undefined
                    }
                };

                const blueBult = [1, 3, 5][Utils.randomInteger(0, 2)];
                generatedResponse.data.blue_supergame_multi = `X${blueBult}`;
                generatedResponse.data.blue_supergame_win = params.bet * blueBult;

                this._db.data.blue_supergame_generated_response = generatedResponse;
            }

            this._db.save();

            return result;
        }

        orangeSupergame(params)
        {
            if(this._db.data.orange_supergame_generated_spins.length === 0) return {"status":"error"};

            const generatedSpin = this._db.data.orange_supergame_generated_spins.shift();
            generatedSpin.before_balance = params.balance;
            generatedSpin.after_balance = params.balance - generatedSpin.bet + generatedSpin.payouts.reduce((prev, cur) => prev + cur.win, 0);

            this._db.data.orange_supergame_left -= 1;

            if(this._db.data.orange_supergame_generated_spins.length === 0)
            {
                this._db.data.orange_supergame_left = services.config.isOfflineMode && services.config.isSupergameOne ? 9 : 0;;
                this._db.data.orange_supergame_hash = null;
                this._db.data.orange_supergame_multi = null;
            }

            this._db.save();

            return {data: generatedSpin};
        }

        blueSupergame(params)
        {
            if(!this._db.data.blue_supergame_generated_response) return {"status":"error"};

            const result = this._db.data.blue_supergame_generated_response;
            this._db.data.blue_supergame_generated_response = null;


            result.data.before_balance = params.balance;
            result.data.after_balance = result.data.before_balance + result.data.blue_supergame_win;


            this._db.data.blue_supergame_left = services.config.isOfflineMode && services.config.isSupergameTwo ? 11 : 0;
            this._db.data.blue_supergame_hash = null;

            this._db.save();

            return result;
        }

        player(params)
        {
            return {
                data: {
                    "name": "test",
                    "session_uuid": params.session_uuid,
                    "blue_supergame": {
                        "blue_supergame_left": this._db.data.blue_supergame_left,
                        "blue_supergame_total": this._db.data.blue_supergame_total,
                        "blue_supergame_hash": this._db.data.blue_supergame_hash,
                    },
                    "orange_supergame": {
                        "orange_supergame_left": this._db.data.orange_supergame_left,
                        "orange_supergame_total": this._db.data.orange_supergame_total,
                        "orange_supergame_hash": this._db.data.orange_supergame_hash,
                        "orange_supergame_multi": this._db.data.orange_supergame_multi,
                    }
                }
            };
        }

            _processSpin(spinObjRaw)
            {
                //Dummy object result
                let result = {
                    data:
                    {
                        spins: [ {spin_elements: spinObjRaw} ],
                    }
                };

                let blueCombinations = 0;
                let orangeCombinations = 0;
                let payouts = [];

                let spinTestResult = services.spinTest.test(spinObjRaw);

                do
                {
                    let explodeIndexes = [ [], [], [], [], [], [] ];
                    let arrSlotId = spinTestResult.arrReel.map(i => [...i]);

                    let winMulti = 0;

                    let destroyAllOrange = false;
                    let destroyAllBlue = false;

                    spinTestResult.arrWinnerLine.forEach(line =>
                    {
                        let countWinElements = line.length;
                        let element = null;
                        line.forEach(coord =>
                        {
                            let find = spinTestResult.arrReel[coord.x][coord.y];
                            if(find === "wild") return;
                            element = find;
                        });

                        if(!element) element = "wild";

                        if(element.indexOf("big-orange") !== -1) destroyAllOrange = true;
                        if(element.indexOf("big-blue") !== -1) destroyAllBlue = true;

                        line.forEach(coord =>
                        {
                            const explodedSlotId = arrSlotId[coord.x][coord.y];
                            if(Utils.isSlotIdHigh(explodedSlotId))
                            {
                                let partialIndex = Utils.getPartialIndexesFromSlotIdArrayCorrectedFromTop(arrSlotId[coord.x])[coord.y];
                                let start = Math.max(0, coord.y - partialIndex);
                                let end = Math.min(arrSlotId[coord.x].length-1, coord.y - partialIndex + 2);

                                for(let cur = start; cur <= end; cur++)
                                {
                                    arrSlotId[coord.x][cur] = null;
                                    if(!explodeIndexes[coord.x].includes(cur)) explodeIndexes[coord.x].push(cur);
                                }
                            }
                            else
                            {
                                arrSlotId[coord.x][coord.y] = null;
                                if(!explodeIndexes[coord.x].includes(coord.y)) explodeIndexes[coord.x].push(coord.y);
                            }
                        });

                        if(element.indexOf("blue") !== -1) blueCombinations++;
                        else if(element.indexOf("orange") !== -1) orangeCombinations++;

                        winMulti += services.session.paytable[element][countWinElements-3];
                    });

                    if(destroyAllOrange || destroyAllBlue)
                    {
                        for(let column = arrSlotId.length - 1; column !== -1; column--)
                        {
                            for (let i = arrSlotId[column].length - 1; i !== -1; i--)
                            {
                                if(!arrSlotId[column][i]) continue;

                                if(destroyAllOrange && Utils.isSlotIdOrange(arrSlotId[column][i]))
                                {
                                    arrSlotId[column][i] = null;
                                    if(!explodeIndexes[column].includes(i)) explodeIndexes[column].push(i);
                                }
                                if(destroyAllBlue && Utils.isSlotIdBlue(arrSlotId[column][i]))
                                {
                                    arrSlotId[column][i] = null;
                                    if(!explodeIndexes[column].includes(i)) explodeIndexes[column].push(i);
                                }
                            }
                        }
                    }

                    //fill empty spaces (making elements to fall)
                    for(let column = arrSlotId.length - 1; column !== -1; column--)
                    {
                        for(let i = arrSlotId[column].length - 1; i !== -1; i--)
                        {
                            let notAllNull = true;
                            while(!arrSlotId[column][i] && notAllNull)
                            {
                                notAllNull = false;

                                for(let j = i-1; j !== -1; j--)
                                {
                                    arrSlotId[column][j+1] = arrSlotId[column][j];
                                    if(arrSlotId[column][j+1]) notAllNull = true;
                                }

                                arrSlotId[column][0] = null;
                            }
                        }
                    }

                    //generate new elements on empty spaces
                    for(let column = arrSlotId.length - 1; column !== -1; column--)
                    {
                        let partialIndexes = Utils.getPartialIndexesFromSlotIdArrayFromBottom(arrSlotId[column]);
                        for(let i = arrSlotId[column].length - 1; i !== -1; i--)
                        {
                            if(!arrSlotId[column][i])
                            {
                                if(i + 1 < arrSlotId[column].length && partialIndexes[i + 1] > 0)
                                {
                                    arrSlotId[column][i] = arrSlotId[column][i+1];
                                    partialIndexes = Utils.getPartialIndexesFromSlotIdArrayFromBottom(arrSlotId[column]); // recalculating
                                }
                                else
                                {
                                    if(i === 0) arrSlotId[column][i] = Utils.randomSlotId();
                                    else arrSlotId[column][i] = Utils.randomNotHighSlotId();
                                }
                            }
                        }
                    }

                    let prevWin = spinTestResult.arrWinnerLine.length > 0;

                    spinObjRaw = Utils.flipArray2D(arrSlotId);
                    spinTestResult = services.spinTest.test(spinObjRaw);

                    if(prevWin)
                    {
                        let obj = {spin_elements: spinObjRaw};
                        result.data.spins.push(obj);
                    }

                    payouts.push(winMulti);
                }
                while(spinTestResult.arrWinnerLine.length > 0);

                //result.data.spins = result.data.spins.slice(0, -1);
                //payouts = payouts.slice(0, -1);

                return {
                    spins: result.data.spins,
                    blueCombinations,
                    orangeCombinations,
                    payouts//: payouts.length === 0 ? [0.0] : payouts
                };
            }

            _generateLoserSpin()
            {
                let result = [ [], [], [], [], [] ];

                let kArrSlotId = [ "rune-1", "rune-2", "rune-3", "rune-4", "rune-5", "rune-blue-1", "rune-blue-2", "rune-orange-1", "rune-orange-2", "big-orange", "big-blue", "wild" ];

                //fill result array
                for ( let i = 0; i < result.length; ++i ) result[ i ].fill(null, 0, 6+1);

                //fill empties some random values
                for ( let i = 0; i < result.length; ++i )
                {
                    for ( let j = 0; j < 6; ++j )
                    {
                        if(result[i][j]) continue;

                        let randomSlotId = kArrSlotId[ Utils.randomInteger( 0, kArrSlotId.length - 1 ) ];

                        if(Utils.isSlotIdHigh(randomSlotId))
                        {
                            let partialIndex = Utils.randomInteger(0, 2);

                            let start = Math.max(0, i - partialIndex);
                            let end = Math.min(result.length-1, i - partialIndex + 2);

                            let isOccupied = false;
                            for(let cur = start; cur <= end; cur++)
                            {
                                if(result[ cur ][ j ] && Utils.isSlotIdHigh(result[ cur ][ j ]))
                                {
                                    isOccupied = true;
                                    break;
                                }
                            }

                            if(0) result[ i ][ j ] = kArrSlotId[ Utils.randomInteger( 0, kArrSlotId.length - 3 - 1 ) ]; // Generate small element
                            else
                            {
                                //Successfully inserting big element
                                for(let cur = start; cur <= end; cur++)
                                {
                                    result[ cur ][ j ] = randomSlotId;
                                }
                            }
                        }
                        else result[ i ][ j ] = randomSlotId;
                    }
                }

                //fill first two columns with not win combinations
                let regularElements = kArrSlotId.slice(0, 9);
                for ( let i = 0; i < result.length; ++i )
                {
                    result[ i ][ 0 ] = regularElements[ Utils.randomInteger( 0, regularElements.length-1) ];
                }
                for ( let i = 0; i < result.length; ++i )
                {
                    let exclusive = [];
                    if(result[ i-1 ]) exclusive.push(result[ i-1 ][ 1 ]);
                    exclusive.push(result[ i ][ 1 ]);
                    if(result[ i+1 ]) exclusive.push(result[ i+1 ][ 1 ]);

                    let notWinElements = regularElements.filter(i => !exclusive.includes(i));

                    result[ i ][ 1 ] = notWinElements[ Utils.randomInteger( 0, notWinElements.length-1) ];
                }

                return result;
            }

            _generateWinnerSpin(forceWinSlotId = undefined)
            {
                let result = [ [], [], [], [], [] ];

                let kArrSlotId = [ "rune-1", "rune-2", "rune-3", "rune-4", "rune-5", "rune-blue-1", "rune-blue-2", "rune-orange-1", "rune-orange-2", "big-orange", "big-blue", "wild" ];

                //fill result array
                for ( let i = 0; i < result.length; ++i ) result[ i ].fill(null, 0, 6+1);

                //Insert win line first
                let kWinSlotId = kArrSlotId[ Utils.randomInteger( 0, kArrSlotId.length - 3 - 1 ) ] ;
                if(forceWinSlotId) kWinSlotId = forceWinSlotId;
                const kConfigWin = services.spinTest.kConfigWin[ Math.floor( Math.random() * services.spinTest.kConfigWin.length ) ];
                let colIndex = 0;
                for ( let col of kConfigWin )
                {
                    let rowIndex = 0;
                    for ( let row of col )
                    {
                        if ( row )
                        {
                            if(Utils.isSlotIdHigh(kWinSlotId) && rowIndex - 1 >= 0) result[ rowIndex - 1][ colIndex ] = kWinSlotId;
                            result[ rowIndex ][ colIndex ] = kWinSlotId;
                            if(Utils.isSlotIdHigh(kWinSlotId) && rowIndex + 1 < result.length) result[ rowIndex + 1][ colIndex ] = kWinSlotId;
                        }

                        rowIndex += 1;
                    }

                    colIndex += 1;
                    if ( colIndex > 5 && Math.random() > 0.5 )
                    {
                        break;
                    }
                }

                //fill empties some random values
                for ( let i = 0; i < result.length; ++i )
                {
                    for ( let j = 0; j < 6; ++j )
                    {
                        if(result[i][j]) continue;

                        let randomSlotId = kArrSlotId[ Utils.randomInteger( 0, kArrSlotId.length - 1 ) ];

                        if(Utils.isSlotIdHigh(randomSlotId))
                        {
                            let partialIndex = Utils.randomInteger(0, 2);

                            let start = Math.max(0, i - partialIndex);
                            let end = Math.min(result.length-1, i - partialIndex + 2);

                            let isOccupied = false;
                            for(let cur = start; cur <= end; cur++)
                            {
                                if(result[ cur ][ j ] /*&& Utils.isSlotIdHigh(result[ cur ][ j ])*/) // We don't want to overlap winning lap (which is created on prev step)
                                {
                                    isOccupied = true;
                                    break;
                                }
                            }

                            if(isOccupied) result[ i ][ j ] = kArrSlotId[ Utils.randomInteger( 0, kArrSlotId.length - 3 - 1 ) ]; // Generate small element
                            else
                            {
                                //Successfully inserting big element
                                for(let cur = start; cur <= end; cur++)
                                {
                                    result[ cur ][ j ] = randomSlotId;
                                }
                            }
                        }
                        else result[ i ][ j ] = randomSlotId;
                    }
                }

                return result;
            }

    _freespin( params )
    {
        /*
        params.bet
        params.balance
        */
        /*let result = {
            data: {
                status: "success",
                spin: this._isWin ? this._generateWinnerSpin() : this._generateLoserSpin(),
                bet: params.bet,
                multi: 0,
                win: "0.00",
                user: {
                    id: 4,
                    token: "4",
                    session: "5636ced8-0d5e-41f6-b1a1-3f298062afc8",
                    is_active: 1,
                    created_at: "2022-10-26T16:35:04.000000Z",
                    updated_at: "2023-01-09T15:58:27.000000Z",
                    last_ip: "178.176.231.116"
                },
                action_id: 355,
                session_id: "5636ced8-0d5e-41f6-b1a1-3f298062afc8",
                after_balance: params.balance,
                action: "betwin",
                before_balance: params.balance
            }
        };

        this._db.data.lastSpin = result.data;
        this._db.save();

        if ( this._isWin )
        {
            const kWin = Math.random() * 10;
            result.data.win = kWin.toString();
            result.data.after_balance += kWin;
        }

        this._isWin = !this._isWin;

        return result;*/

        return this._spin({...params, bet: 0});
    }
}
