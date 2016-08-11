// TypeScript
// JScript functions for BasicList.Html. 
// This calls TRC APIs and binds to specific HTML elements from the page.  

import * as trc from '../node_modules/trclib/trc2';
import * as html from '../node_modules/trclib/trchtml';
import * as gps from '../node_modules/trclib/gps';
import * as trcFx from '../node_modules/trclib/trcfx'; 

declare var $: any; // external definition for JQuery 

export class MyPlugin {
    private _sheet: trc.Sheet;
    private _gps : gps.IGpsTracker;
    private _options : trc.PluginOptionsHelper;

    // Entry point called from brower. 
    // This creates real browser objects and passes in. 
    public static BrowserEntry(
        sheet: trc.ISheetReference, 
        opts : trc.IPluginOptions, 
        next : (plugin : MyPlugin) => void 
    ) : void {
        var trcSheet = new trc.Sheet(sheet);                
        var opts2 = trc.PluginOptionsHelper.New(opts, trcSheet);

        // Track GPS location of device
        var gpsTracker = new gps.GpsTracker(); // Only works in browser
        gpsTracker.start(null); // ignore callback

        // Do any IO here...
        
        var plugin = new MyPlugin(trcSheet, opts2, gpsTracker);
        next(plugin);
    }

    // Expose constructor directly for tests. They can pass in mock versions. 
    public constructor(
        sheet: trc.Sheet,
        opts2 : trc.PluginOptionsHelper, 
        gpsTracker : gps.IGpsTracker
    ) {
        this.resetUi();

        this._sheet = sheet; // Save for when we do Post
        this._options = opts2;               
        this._gps = gpsTracker;

        this.refresh();
    }

    private refresh() {
        this._sheet.getInfo(
            (info) => {
                this.updateInfo(info);
            });
    }

    protected resetUi(): void {
        // clear previous results
        $('#main').empty();
    }

    // Display sheet info on HTML page
    public updateInfo(info: trc.ISheetInfoResult): void {
        $("#SheetName").text(info.Name);
        $("#ParentSheetName").text(info.ParentName);
        $("#SheetVer").text(info.LatestVersion);
        $("#RowCount").text(info.CountRecords);

        $("#LastRefreshed").text(new Date().toLocaleString());
    }

    // Example of a helper function.
    public doubleit(val: number): number {
        return val * 2;
    }

    // Demonstrate receiving UI handlers 
    public onClickRefresh(): void {
        this.refresh();
    }

    // SheetControl will render HTML controls that need to callback to the sheet control.
    // The js expression in html is "_plugin._control", which must be passed to the renderer.
    public _control : html.SheetControl; // Expose so HTML handlers can invoke. 

    // downloading all contents and rendering them to HTML can take some time. 
    public onGetSheetContents(): void {
        html.Loading("contents");
        //$("#contents").empty();
        //$("#contents").text("Loading...");

        trcFx.SheetEx.InitAsync(this._sheet, this._gps, (sheetEx)=>
        {
            this._sheet.getSheetContents((contents) => {
                var render = new html.SheetControl("contents", sheetEx);
                // could set other options on render() here
                render.render();
                this._control = render;
            });
        });        
    }
}
