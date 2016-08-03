// TypeScript
// JScript functions for BasicList.Html. 
// This calls TRC APIs and binds to specific HTML elements from the page.  

import * as trc from '../node_modules/trclib/trc2';

declare var $ :any; // external definition for JQuery 

export class MyPlugin {   
    private _sheet: trc.Sheet;

    // Entry point called from brower. 
    public static BrowserEntry(sheet: trc.ISheetReference): MyPlugin {
        var trcSheet = new trc.Sheet(sheet);
        return new MyPlugin(trcSheet);
    }

    public constructor(sheet: trc.Sheet) {
        this.resetUi();
        this._sheet = sheet; // Save for when we do Post               

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
}
