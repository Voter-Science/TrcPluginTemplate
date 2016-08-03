# TrcPluginTemplate
A template  for creating an initial plugin for TRC, the Canvassing app at . 

## TRC Plugins
TRC plugins are JScript/HTML that run in the client's browser and make direct calls to the TRC server. 

## Usage

This plugin is a NPM package and uses NPM scripts for build, test, and debugging.  

1. Clone/Fork/Copy this repository 
2. Build the plugin. This will compile TypeScript to JScript, run browserify to produce a bundle, and deposit all runtime artifcats in the '/public' directory. 
```npm run build```
3. Run tests:  ```npm test```
4. Debug locally: ```npm start```
And then open a browser window with the URL printed out by that command. 

To get the latest version of TrcLib from NPM, 
```npm upgrade trclib```


## Benefits of the template
1. This pulls Typescript/JScript wrappers and utility functions from https://github.com/Voter-Science/TrcLibNpm
2. Provides TypeScript compilation 
3. Wires up Browserify so that you can write your plugin as a CommonJs module. 
4. Includes a pattern for testing the plugin using Mocha and Chai
5. PRovides a local debugging experience via Express. 



 

