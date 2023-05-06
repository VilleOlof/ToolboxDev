# Davinki Toolbox Dev

This is a version of the toolbox that makes developing modules easier and quicker!  
In the main version, you have to rebuild everything, build module indexes, etc.  
In this all you have to do is make your module and enable build watch mode!

Module Development Tutorial: `Not yet made, Soon!`

# Setup

Clone the repo and run `npm install` to install all the dependencies.  

Create 3 files for Data and Settings:
- ./Data.json
- ./Settings.json
- ./AppSettings.json

All of them should have the contents of `{}`.

Then run `npm run vite` to build the project with watch mode.  

Module development is done in the ./modules/DevModule.svelte file.  
This version doesnt dynamically load modules.  
So make your module like you would in the DevModule and once youre done,  
You can just copy the contents and rename the file to the componentID and add it to the main version!  

## Custom Modules

*Taken from the main README*  
**Only install third-party modules from people you trust.**

To create your own custom made modules.  
You can copy the template module in ./modules and rename the file to the name of your module.  
This template module has most of the common in-house imports and code required for a module.  

Every module consists of a componentID which the plugin uses to identify the module.  
The component HTML should be wrapped in a main tag with the componentID as the id.  
**Note: componentID must be the same as the filename (excluding extension), and can't contain spaces**

```HTML
<main id={componentID}>
    <!-- Here goes your HTML-->
</main>
```

And the module should register itself with the module size (Large or Small) and the componentID.  
This should happen in the `onMount` function.  

```js
import { ModuleHandler } from '../src/Lib/ModuleHandler';
onMount(() => {
    ModuleHandler.RegisterModule(
        componentID, 
        ModuleHandler.ComponentSize.Large, 
        "Module Description"
    );
});
```

These two parts are the only required parts of a module.  
But as mentioned above, you can just copy the template module and rename it.  

If any new dependencies are added alongside a new module, they will need to be added to the ./package.json file.  
And then run `npm install` to install the new dependencies.  
After that, run `npm run build` to build the project with the new dependencies.  

Modules also have full access to the [Davinci Resolve API](./src/Lib/ResolveAPI.d.ts), The file system and other Node.js modules.  

Note: Going to the settings page acts like a soft-refresh.  
Any temporary data that is stored in the module will be lost.  
It will destroy the component and re-create it.  
So you only need to load the settings data once at the start of the module life cycle.  

### Module Settings

With the built in settings page, you can easily create settings for your module.  
The settings page is automatically generated depending on the settings you create.  

To create a setting-  
First call `GlobalSettings.GetInstance(componentID)` to get a setting instance for your module.  
And then `Settings.RegisterSetting()` with the correct parameters.  

Example:

```typescript
// Import the settings classes
import { GlobalSettings, Settings, SettingTypes } from '../src/Lib/Settings';

// Get the settings instance for your module
const settings: Settings = GlobalSettings.GetInstance(componentID); 

// Register a setting and store the value in a variable
const settingValue = settings.RegisterSetting(
    "GreatSettingName",         // Setting Name
    "Useful for being great",   // Setting Description
    55,                         // Default Value
    SettingTypes.Type.Numeric,  // Setting Type
    <SettingTypes.Numeric>{     // Extra Data (Optional)
        Min: 4,
        Max: 84,
        Step: 0.25
    }
);
```

### Module Data

Modules can store data in the plugin.  
This data is stored in the plugin settings file (./Data.json).

To store data, you can use the `Stores/DataStore` namespace.

To store any data, you first need to create a data store.  
By calling `new DataStore(componentID)`.  
And then storing a value by calling `Datastore.Set('DataName', 'Default Value')`.  

Example:

```typescript
// Import the data store namespace
import { DataStore } from '../src/Lib/Stores/DataStore';

// Create a data store
const dataStore: DataStore = new DataStore(componentID);

// Set the data
dataStore.Set('GreatData', 'Great Value');

// Get the data
const greatData: string = dataStore.Get<string>('GreatData');
```

### Common

To make modules even easier to create and more consistent.  
There are some common functions that can be used for various things.  

Like handling IO operations, interacting with Electron, registering keybinds and more.  

Example:

```typescript
// Import the common namespace
import { Common } from '../src/Lib/Common';

const fileContent: string = Common.IO.ReadFile('C:/GreatFile.txt');

Common.Electron.OpenExternalLink('https://www.google.com');

Common.Electron.RegisterShortcut('Shift+Alt+G', () => {
    console.log('Great Shortcut');
});
```

## Docs  

There is no read-made docs, they have to be generated from source.  

Run the following command in the root directory of the project:  

```bash
npm run docs
```

This will generate the docs in the ./docs folder.  
And then you can spin up a local server to view the docs.  
With the following command:

```bash
npm run docs:serve
```