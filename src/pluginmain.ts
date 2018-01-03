// Sample 'Hello World' Plugin template.
// Demonstrates:
// - typescript
// - using trc npm modules and browserify
// - uses promises. 
// - basic scaffolding for error reporting. 
// This calls TRC APIs and binds to specific HTML elements from the page.  

import * as XC from 'trc-httpshim/xclient'
import * as common from 'trc-httpshim/common'

import * as core from 'trc-core/core'

import * as trcSheet from 'trc-sheet/sheet' 
import * as trcSheetEx from 'trc-sheet/sheetEx'

import * as gps from 'trc-web/gps'
import * as plugin from 'trc-web/plugin'
import * as trchtml from 'trc-web/html'


declare var $: any; // external definition for JQuery 

// Provide easy error handle for reporting errors from promises.  Usage:
//   p.catch(showError);
declare var showError : (error:any) => void; // error handler defined in index.html

export class MyPlugin {
    private _sheet: trcSheet.SheetClient;
    private _pluginClient : plugin.PluginClient;
    private _gps : common.IGeoPointProvider;

    public static BrowserEntryAsync(
        auth: plugin.IStart,
        opts : plugin.IPluginOptions
    ) : Promise<MyPlugin> {
        
        // You can set gpsTracker null if you don't need GPS. 
        var gpsTracker = new gps.GpsTracker(); // Only works in browser
        var pluginClient = new plugin.PluginClient(auth,opts, gpsTracker);

        // Do any IO here...
        
        var throwError =false; // $$$ remove this
        
        var plugin2 = new MyPlugin(pluginClient);
        plugin2._gps = gpsTracker;
        return plugin2.InitAsync().then( () => {
            if (throwError) {
                throw "some error";
            }
            
            gpsTracker.start((loc) => plugin2.OnGpsChanged(loc)); // ignore callback
            return plugin2;                        
        });
    }

    private OnGpsChanged(loc : gps.IGeoPoint) : void {
        // Notification that the GPS position has change. 
        // Use this if you have a map view showing the user's "current location"
        var msg = "(Lat: " + loc.Lat + ", Long:" + loc.Long + ")";
        $("#locInfo").text(msg);
    }

    // Expose constructor directly for tests. They can pass in mock versions. 
    public constructor(p : plugin.PluginClient) {
        this._sheet = new trcSheet.SheetClient(p.HttpClient, p.SheetId);
    }
    

    // Make initial network calls to setup the plugin. 
    // Need this as a separate call from the ctor since ctors aren't async. 
    private InitAsync() : Promise<void> {
        return this._sheet.getInfoAsync().then( info  => {
            this.updateInfo(info);
        });     
    }

    // Display sheet info on HTML page
    public updateInfo(info: trcSheet.ISheetInfoResult): void {
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

        trcSheetEx.SheetEx.InitAsync(this._sheet, this._gps).then((sheetEx)=>
        {
            return this._sheet.getSheetContentsAsync().then((contents) => {
                var render = new trchtml.SheetControl("contents", sheetEx);
                // could set other options on render() here
                render.render();
            }).catch(showError);
        });        
    }
}
