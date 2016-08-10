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

    // Entry point called from brower. 
    public static BrowserEntry(sheet: trc.ISheetReference): MyPlugin {
        var trcSheet = new trc.Sheet(sheet);        
        return new MyPlugin(trcSheet);
    }

    public constructor(sheet: trc.Sheet) {
        this.resetUi();
        this._sheet = sheet; // Save for when we do Post

        // Track GPS location of device                
        var x = new gps.GpsTracker();
        x.start(null);
        this._gps = x;

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
