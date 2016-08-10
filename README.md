# TrcPluginTemplate
A template  for creating an initial plugin for TRC, the Canvassing app hosted by http://Voter-Science.com. 

## TRC Plugins
TRC plugins are JScript/HTML that run in the client's browser and make direct calls to the TRC server. 

1. See https://github.com/Voter-Science/TrcPluginTemplate/wiki for details on Plugins. 
2. See TrcLib wrappers and utility at: https://github.com/Voter-Science/TrcLibNpm
3. These wrappers are written for TypeScript, http://www.typescriptlang.org/ , a superset of JScript. This template pulls in the TypeScript compiler via NPM. 

## Usage
This plugin is a NPM package and uses NPM scripts for build, test, and debugging.  

### One time setup:
1. First install Node and NPM from: https://nodejs.org/en/download/ 
2. Clone/Fork/Copy this repository to a root directory.
3. In the root directory, run ```npm install``` to pull down packages. Packages include the TypeScript compiler, testing framework, core TRC wrappers, etc. This will download them to a 'node_modules' folder. 

### Ongoing development
4. Build the plugin. This will compile TypeScript to JScript, run browserify to produce a bundle, and deposit all runtime artifacts in the _'/public' directory_. That directory is the actual plugin that gets published. 
```npm run build```
5. Run tests:  ```npm test```
6. Debug locally: ```npm start```
And then open a browser window with the URL printed out by that command. 


To get the latest version of TrcLib from NPM, 
```npm upgrade trclib```


## Benefits of the template
1. This pulls Typescript/JScript wrappers and utility functions from https://github.com/Voter-Science/TrcLibNpm
2. Provides TypeScript compilation 
3. Wires up Browserify so that you can write your plugin as a CommonJs module. 
4. Includes a pattern for testing the plugin using Mocha and Chai
5. Provides a local debugging experience via Express and https://github.com/Voter-Science/trc.runplugin. 



 

