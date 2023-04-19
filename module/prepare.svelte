<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';

    const componentID: string = "PrepareManager";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large);
    });

    let _Datastore = new DataStore(componentID);

    type Prepare = {
        name: string,
        actions: Action[]
    }

    type Action = RenameTrack | AddTrack;

    let _Prepares: Prepare = _Datastore.Get("Prepares", { name: "Default", actions: [] });

    //_Prepares.actions.push({ trackIndex: 0, trackType: ResolveEnums.TrackType.Video, newName: "Test" });

    type RenameTrack = {
        name: 'Rename Track',
        trackIndex: number,
        trackType: ResolveEnums.TrackType,
        newName: string
    };

    type AddTrack = {
        name: 'Add Track',
        tracktype: number,
        newName: string
    };
</script>

<!--
    Add Track:
-trackIndex
-trackType
-name (optional)

Rename Track:
-trackIndex
-trackType
-newName

Import Media:
-file/folder location (optional, depends on the below)
-prompt file/folder location when run
-file format(s)
-Mediapool Folder (create if not exist)

Create Mediapool Folder:
-Where (default: root)
-folder name

Insert Generator:
- timeline

Add Marker:
-color
-customdata
-duration
-frameID
-markername
-note

Set Timecode:
timecode: string? number?

Rename Project:
newName: stirng
-->

<main id={componentID}>
    <div id="topBar">
        <div>
            <select id="prepareDropdown">
                <option value="0">None</option>
            </select>
    
            <button>Run</button>
        </div>

        <div>
            <button id="addPrepare">Add</button>
            <button id="removePrepare">Remove</button>
        </div>
    </div>

    <div id="ruleListWrapper">
        <div id="ruleList">
            {#each _Prepares.actions as action}
                <div>
                    <h2>{typeof action}</h2>
                </div>
            {/each}
        </div>
    </div>
</main>


<style lang="scss">
    @use "../src/scss/Colors";

    main {
        
    }

    #topBar {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;

        padding: 0.5rem;
    }

    #ruleListWrapper {
        display: flex;
        justify-content: center;
        align-items: center;

        margin: 0.5rem;
    }

    #ruleList {
        background-color: Colors.$BackgroundColor;


        width: 95%;
        min-height: 10rem;
    }

</style>