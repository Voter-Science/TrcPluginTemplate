// Sample 'Hello World' Plugin template.
// Demonstrates:
// - typescript
// - using trc npm modules and browserify
// - uses promises. 
// - basic scaffolding for error reporting. 
// This calls TRC APIs and binds to specific HTML elements from the page.  

import * as trc from 'trclib/trc2';
import * as trcplugin from 'trclib/plugin';
import * as trchtml from 'trclib/trchtml';
import * as gps from 'trclib/gps';
import * as trcFx from 'trclib/trcfx'; 

import * as Promise from 'bluebird';

declare var $: any; // external definition for JQuery 

// Provide easy error handle for reporting errors from promises.  Usage:
//   p.catch(showError);
declare var showError : (error:any) => void; // error handler defined in index.html

export class MyPlugin {
    private _sheet: trc.Sheet;
    private _gps : gps.IGpsTracker;
    private _options : trcplugin.PluginOptionsHelper;

    // Entry point called from browser. 
    // This creates real browser objects and passes into the ctor. 
    // Whereas a unit test would skip this and call the ctor directly. 
    public static BrowserEntryAsync(
        sheet: trc.ISheetReference, 
        opts : trcplugin.IPluginOptions
    ) : Promise<MyPlugin> {
        var trcSheet = new trc.Sheet(sheet);                
        var opts2 = trcplugin.PluginOptionsHelper.New(opts, trcSheet);

        // Track GPS location of device
        var gpsTracker = new gps.GpsTracker(); // Only works in browser
        gpsTracker.start(null); // ignore callback

        // Do any IO here...
        
        var throwError =false;

        var plugin = new MyPlugin(trcSheet, opts2, gpsTracker);
        return plugin.InitAsync().then( () => {
            if (throwError) {
                throw "some error";
            }
            return plugin;                        
        });
    }

    // Expose constructor directly for tests. They can pass in mock versions. 
    public constructor(
        sheet: trc.Sheet,
        opts2 : trcplugin.PluginOptionsHelper, 
        gpsTracker : gps.IGpsTracker
    ) {
        this._sheet = sheet; // Save for when we do Post
        this._options = opts2;               
        this._gps = gpsTracker;    
    }
    

    // Make initial network calls to setup the plugin. 
    // Need this as a separate call from the ctor since ctors aren't async. 
    private InitAsync() : Promise<void> {
        return this._sheet.getInfoAsync().then( info => {
            this.updateInfo(info);
        });     
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
        this.InitAsync().        
            catch(showError);
    }

    // downloading all contents and rendering them to HTML can take some time. 
    public onGetSheetContents(): void {
        trchtml.Loading("contents");
        //$("#contents").empty();
        //$("#contents").text("Loading...");

        trcFx.SheetEx.InitAsync(this._sheet, this._gps, (sheetEx)=>
        {
            this._sheet.getSheetContentsAsync().then((contents) => {
                var render = new trchtml.SheetControl("contents", sheetEx);
                // could set other options on render() here
                render.render();
            }).catch(showError);
        });        
    }
}
