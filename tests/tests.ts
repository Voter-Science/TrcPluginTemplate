// Example of some tests for a plugin.

// require() won't import any type information. So we need to explicitly declare types from require()
declare var require: any; // Needed so TS won't complain about require();
declare var describe: any;
declare var it: any;
var assert = require('chai').assert;

// normal TypeScript imports. This compiles down to require(), but also imports type information.
import * as trc from '../node_modules/trclib/trc2';
import * as mock from '../node_modules/trclib/trc2mocks';
import * as plugin from '../src/pluginmain';


// Override methods in the Plugin class to make it more testable. 
// a) disable UX calls, 
// b) inject some asserts for testing. 
class MyPluginX extends plugin.MyPlugin {
    protected resetUi(): void {
         // Nop - skip UI code. 
    }

    // virtual, this gets called from base class during a refresh.
    // We're testing this gets called, and demonstrating using mocks.  
    public updateInfo(info: trc.ISheetInfoResult): void {
        // Assert!
        assert.equal(mock.Sheet.DefaultName, info.Name);        
    }
}

// Run tests 
describe('sample test', function () {
    var obj: plugin.MyPlugin;

    it('creates plugin instance', function () {
        var sheet: trc.Sheet = new mock.Sheet();
        obj = new MyPluginX(sheet, null, null);
    });
    it('double value ', function () {
        assert.equal(10, obj.doubleit(5));
    });
});

