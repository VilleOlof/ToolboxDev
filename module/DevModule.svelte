<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';
    import { onDestroy } from "svelte";

    const componentID: string = "QuickProperties";

    /*
        QuickProperties

        - TimelineItemProperties

        # Add new Quick Property

        #List of added saved property objects: & > * (property name, minimize)
        # - Apply to current video item (button)
        # - Enable if it can be used with Keybinds (if so auto add in settings) (checkbox)
        # - Set Properties to current video item properties (button)
        # - Property Name (input:text)
        # - Append if possible (checkbox)
        # - What Tracks to apply to (mutiple choices, 1,2,3,4,5,6)
        # - Remove Current
    */

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large);

        RegisterKeybinds();

        UpdateTrackInputsOnMount();
    });

    onDestroy(() => {
    });

    type Property = {
        KeybindEnabled: boolean,
        Name: string,
        Append: boolean,
        Tracks: number[],
        ItemProperties: TimelineItemProperties | undefined
    }
    type PropertyObject = {[key: string]: Property};

    let _Settings = GlobalSettings.GetInstance(componentID);
    let _Datastore = new DataStore(componentID);

    let _Properties: PropertyObject = _Datastore.Get("Properties", {});
    $: {
        for (const [oldName, properties] of Object.entries(_Properties)) {
            if (oldName != properties.Name) {
                _Properties[properties.Name] = properties;
                delete _Properties[oldName];
            }
        }

        _Datastore.Set("Properties", _Properties); // Save to datastore on change
    }

    type KeybindReturn = {
        Keybind: string,
        Properties: Property
    }
    function AddKeybindSettingsOnMount(): KeybindReturn[] {
        RemoveUnusedKeybinds(); //remove any keybinds that dont exist in _properties

        let keybinds: KeybindReturn[] = [];
        for (let key in _Properties) {
            let property = _Properties[key];

            if (property.KeybindEnabled) {
                let keybind = _Settings.RegisterSetting(`${property.Name}-Keybind`, `Generated Keybind for the ${property.Name} property`, 'F24', SettingTypes.Type.Keybind);
                keybinds.push({Keybind: keybind, Properties: property});
            }
        }

        return keybinds;
    }

    function RegisterKeybinds(): void {
        let keybindReturn = AddKeybindSettingsOnMount();
        for (let property of keybindReturn) {
            Common.Electron.RegisterShortcut(property.Keybind, () => {
                ApplyProperties(property.Properties);
            });
        }
    }

    function RemoveUnusedKeybinds(): void {
        //check existing setting keybind and compare them to _properties and if they dont exist in _properties then remove them
        let settings: Record<string, SettingTypes.Info> = _Settings.GetAllComponentSettings();

        for (let setting in settings) {
            if (setting.endsWith("-Keybind")) {
                let propertyName = setting.replace("-Keybind", "");
                if (_Properties[propertyName] === undefined || !_Properties[propertyName].KeybindEnabled) {
                    _Settings.DeleteSetting(setting);
                }
            }
        }
    }

    function AddNewProperty(): Property {
        const newPropertyName = "New Property";
        let newProperty = {
            KeybindEnabled: false,
            Name: newPropertyName,
            Append: false,
            Tracks: [1],
            ItemProperties: undefined
        };
        newProperty = AddItemProperties(newProperty);

        _Properties[newPropertyName] = newProperty;

        return newProperty;
    }

    function RemoveProperty(propertyName: string): void {
        delete _Properties[propertyName];
        _Properties = _Properties; //force update since $: triggers on assignment
    }

    function AddItemProperties(properties: Property): Property {
        let currentTimeline = ResolveFunctions.GetCurrentTimeline();

        let currentVideoItem = currentTimeline.GetCurrentVideoItem();
        if (!currentVideoItem) return properties;

        let currentProperties: TimelineItemProperties = currentVideoItem.GetProperty() as TimelineItemProperties;

        _Properties[properties.Name] = {
            KeybindEnabled: properties.KeybindEnabled,
            Name: properties.Name,
            Append: properties.Append,
            Tracks: properties.Tracks,
            ItemProperties: currentProperties
        }

        return _Properties[properties.Name];
    }

    //refactor to more functions instead of 6 level of indentation
    function ApplyProperties(properties: Property): void {
        let currentTimeline = ResolveFunctions.GetCurrentTimeline();
        let timelineTrackCount = currentTimeline.GetTrackCount(ResolveEnums.TrackType.Video);

        let itemProps = properties.ItemProperties;
        for (let propertyTrackCount = 1; propertyTrackCount <= properties.Tracks.length; propertyTrackCount++) {
            if (propertyTrackCount >= timelineTrackCount) {
                return;
            }

            let itemsInTrack = currentTimeline.GetItemListInTrack(ResolveEnums.TrackType.Video, propertyTrackCount);

            //find the item thats above the timeline cursor
            let playheadPosition = ResolveFunctions.ConvertTimecodeToFrames(currentTimeline.GetCurrentTimecode());
            for (let item of itemsInTrack) {
                if (item === undefined) continue;

                let itemStart = item.GetStart();
                let itemEnd = item.GetEnd();

                if (playheadPosition >= itemStart && playheadPosition <= itemEnd) {
                    
                    const ZoomGang = item.GetProperty("ZoomGang");
                    Object.entries(itemProps).forEach(([key, value]) => {
                        if (value === undefined || value == 0) return;

                        if (properties.Append) {
                            let currentValue = item.GetProperty(key);

                            if (currentValue === undefined || currentValue == 0) return;
                            if (currentValue.toString() == "true" || currentValue.toString() == "false") return; //probably a better way to 
                            if (ZoomGang && key == "ZoomY") return;

                            if (key == "ZoomX") {
                                value -= 1; //removes the 1 that is default zoom level.
                            }
                            
                            value = currentValue + value;
                            item.SetProperty(key, value);

                            return;
                        }

                        console.log(key, value);
                        item.SetProperty(key, value);
                    });

                    break;
                }
            }
        }
    }

    function TrackInputChange(event: any, _propertiesName: string): void {
        let trackInputText: string = event.target.value;

        let tracks: number[] = [];

        let trackInputTextSplit = trackInputText.split(",");
        for (let track of trackInputTextSplit) {
            let trackNumber = parseInt(track);
            if (trackNumber > 0) {
                tracks.push(trackNumber);
            }
        }

        _Properties[_propertiesName].Tracks = tracks;
    }

    function UpdateTrackInputsOnMount() {
        for (const [propertyName, properties] of Object.entries(_Properties)) {
            let trackInput = document.querySelector(`#${propertyName.replace(' ', '.')}-track`) as HTMLInputElement;
            if (trackInput === null) continue;

            trackInput.value = properties.Tracks.join(",");
        }
    }

    function MinimizeProperty(propertyName: string): void {
        let propertyContainer = document.querySelector(`.${propertyName.replace(' ', '.')}-propertyDetail`);
        if (propertyContainer === null) return;

        propertyContainer.classList.toggle("minimized");
    }

</script>


<main id={componentID}>
    <button on:click={AddNewProperty}>add new</button>
    <div id="autoGenList">
        {#each Object.entries(_Properties) as [_, properties]}

            <div class={`${properties.Name}-propertyContainer`}>
                <div class={`${properties.Name}-propertyHeader`}>
                    <h1>{properties.Name}</h1>
                    <button on:click={() => { MinimizeProperty(properties.Name) }}>Minimize</button>
                    <button on:click={() => { ApplyProperties(properties) }}>Apply</button>
                </div>

                <div class={`${properties.Name}-propertyDetail`}>
                    <label for={`${properties.Name}-keybindEnabled`}>Enable Keybind</label>
                    <input type="checkbox" id={`${properties.Name}-keybindEnabled`} bind:checked={properties.KeybindEnabled}>

                    <label for={`${properties.Name}-name`}>Name</label>
                    <input type="text" id={`${properties.Name}-name`} class=propertyNameInput bind:value={properties.Name} pattern="^[a-zA-Z0-9]+$">

                    <label for={`${properties.Name}-append`}>Append</label>
                    <input type="checkbox" id={`${properties.Name}-append`} bind:checked={properties.Append}>

                    <label for={`${properties.Name}-track`}>Tracks</label>
                    <input type="text" id={`${properties.Name}-track`} on:change={(e) => { TrackInputChange(e, properties.Name)}}>
                    <img src="../src/assets/Info.svg" alt="Info" id={`${properties.Name}-trackInfo`}>

                    <button on:click={() => { AddItemProperties(properties) }}>Set Properties</button>

                    <button on:click={() => { RemoveProperty(properties.Name) }}>Remove</button>
                </div>
            </div>

        {/each}
    </div>
</main>


<style lang="scss">




    .propertyNameInput:invalid {
        background-color: #ff8b8b;
    }

    .minimized {
        display: none;
    }

</style>