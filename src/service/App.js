import * as PIXI from "pixi.js";
import signals from "signals";
import DeviceOrientation, { device_orientation_type } from "./DeviceOrientation";
import {services} from "../ServiceLocator";
import {Stage} from "@pixi/layers";
import {Service} from "./Service";
import {Stats} from "pixi-stats";

export default class App extends Service {
    _renderer = null;
    _stage = null;
    _deviceOrientation = null;
    _isDeviceOrientationCheck = null;
    _isFullscreenBg = null;
    _fullscreenBgWidth = null;
    _bfOnWindowResized = null;
    _onOrientationChanged = null;
    _onFullscreenBgStarted = null;
    _onFullscreenBgUpdated = null;
    _kWidth = 1920;
    _kHeight = 1080;

    /**
     * @type {PIXI.Renderer}
     */
    get renderer() { return this._renderer; }
    get stage() { return this._stage; }
    get width() { return this._kWidth; }
    get height() { return this._kHeight; }
    get orientation() { return this._deviceOrientation.orientation; }
    get orientationStr() { return this._deviceOrientation.orientation == device_orientation_type.LANDSCAPE ? "landscape" : "portrait"; }
    get isFullscreenBg() { return this._isFullscreenBg; }
    get fullscreenBgWidth() { return this._fullscreenBgWidth; }
    get onOrientationChanged() { return this._onOrientationChanged; }
    get onFullscreenBgStarted() { return this._onFullscreenBgStarted; }
    get onFullscreenBgUpdated() { return this._onFullscreenBgUpdated; }
    get gameSize() {
        return { width: this._kWidth, height: this._kHeight };
    }

    get isMobileDevice() {
        return PIXI.utils.isMobile.any;
    }

    init() {
        this._onOrientationChanged = new signals.Signal();
        this._onFullscreenBgStarted = new signals.Signal();
        this._onFullscreenBgUpdated = new signals.Signal();

        this._deviceOrientation = new DeviceOrientation();
        this._deviceOrientation.onChanged.add( this._onDeviceOrientation_Changed, this );

        this._isDeviceOrientationCheck = PIXI.utils.isMobile.any ;
        this._isFullscreenBg = PIXI.utils.isMobile.any && this._deviceOrientation.orientation == device_orientation_type.LANDSCAPE;

        // Setup body.
        document.body.style.margin = "0px";
        document.body.style.overflow = "hidden";
        document.body.style.background = "black";

        document.querySelector( "#deviceRotationLayer" ).style.display = "none";

        this._renderer = new PIXI.Renderer( {
            width: this._kWidth,
            height: this._kHeight,
            useContextAlpha: false,
            backgroundColor: 0x000000,
            resolution: 1, //PIXI.utils.isMobile.any ? 1 : window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: false,
            useBackBuffer: true,
            powerPreference: "high-performance" });
        document.querySelector( ".canvas-box" ).appendChild( this._renderer.view );

        this._stage = new Stage();
        this._stage.interactive = true;
        this._stage.sortableChildren = true;

        globalThis.__PIXI_STAGE__ = this._stage;
        globalThis.__PIXI_RENDERER__ = this._renderer;

        // window.__PIXI_DEVTOOLS__ = {
        //     stage: this._stage,
        //     renderer:  this._renderer
        // };

        // const stats = new Stats(this._renderer);

        this._onWindow_Resized();
        this._onDeviceOrientation_Changed( this._deviceOrientation.orientation );

        // Listen to events.
        this._bfOnWindowResized = this._onWindow_Resized.bind( this );
        window.addEventListener( "resize", this._bfOnWindowResized );
        window.addEventListener( "deviceOrientation", this._bfOnWindowResized );
    }

    get deltaX() {
        return (this._renderer.width - this._kWidth) / 2;
    }

    get deltaY() {
        return (this._renderer.height - this._kHeight) / 2;
    }


    _onWindow_Resized()
    {
        let canvasBox = document.querySelector( ".canvas-box" );
        if ( !this._isFullscreenBg )
        {
            let clientHeight = document.documentElement.clientHeight;
            if ( PIXI.utils.isMobile.any && this._deviceOrientation.orientation == device_orientation_type.LANDSCAPE )
            {
                clientHeight -= services.config.mobileHeightCorrection;
            }
            const kScaleFactor = Math.min( document.documentElement.clientWidth / this._kWidth, clientHeight / this._kHeight );
            canvasBox.style.transform = ( `scale(${kScaleFactor}) translateX(-50%) translateY(-50%)` );
        }
        else
        {
            const kWindowInnerHeight = Math.min( document.documentElement.clientHeight, document.documentElement.clientWidth );
            const kWindowInnerWidth = Math.max( document.documentElement.clientHeight, document.documentElement.clientWidth );

            this._fullscreenBgWidth = this._kHeight * kWindowInnerWidth / kWindowInnerHeight;
            this._renderer.resize( this._fullscreenBgWidth, this._kHeight );
            const kScaleFactor = kWindowInnerHeight / this._kHeight;
            canvasBox.style.width = this._fullscreenBgWidth.toString() + "px";
            canvasBox.style.transform = ( `scale(${kScaleFactor}) translateX(-50%) translateY(-50%)` );

            this._stage.x = ( this._fullscreenBgWidth - this._kWidth ) * 0.5;

            this._onFullscreenBgUpdated.dispatch( this._fullscreenBgWidth );
        }
    }

        _onDeviceOrientation_Changed( orientation )
        {
            if ( !this._isDeviceOrientationCheck ) { return; }

            //console.log( "orientation=" + orientation );
            if ( orientation == device_orientation_type.PORTRAIT )
            {
                document.querySelector( "#deviceRotationLayer" ).style.display = "";
                document.querySelector( "#appLayer" ).style.display = "none";
            }
            else if ( orientation == device_orientation_type.LANDSCAPE )
            {
                document.querySelector( "#deviceRotationLayer" ).style.display = "none";
                document.querySelector( "#appLayer" ).style.display = "";
            }

            let isFullscreenBg = PIXI.utils.isMobile.any && this._deviceOrientation.orientation == device_orientation_type.LANDSCAPE;
            if ( !this._isFullscreenBg && isFullscreenBg )
            {
                this._onFullscreenBgStarted.dispatch();
            }
            this._isFullscreenBg = isFullscreenBg;
            this._onWindow_Resized();

            this._onOrientationChanged.dispatch( orientation );
        }

    render() {
        this._renderer.render( this._stage );
    }

    setDeviceOrientationCheck( isCheck ) {
        this._isDeviceOrientationCheck = isCheck;
        this._onDeviceOrientation_Changed( this._deviceOrientation.orientation );
    }
}
