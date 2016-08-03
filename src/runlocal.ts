
// http://localhost:3000/

declare var require: any; // Needed so TS won't complain about require();
declare var __dirname: any; 

var express = require('express');
var app = express();

/*
app.get('/', function (req : any, res : any) {
  res.send('Hello World!');
});
*/

// See serving static files.
// This is relative to the dir we run in. 
// http://expressjs.com/en/starter/static-files.html
//app.use(express.static(__dirname  + '../public'));
app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Launch this URL in a browser to test your plugin:');
  console.log('  http://localhost:3000/index.html');
});

// $$$ Auto launch a browser?
