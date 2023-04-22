<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';

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
    $: _Datastore.Set("Properties", _Properties); // Save to datastore on change

    type KeybindReturn = {
        Keybind: string,
        Properties: Property
    }
    function AddKeybindSettingsOnMount(): KeybindReturn[] {
        let keybinds: KeybindReturn[] = [];
        for (let key in _Properties) {
            let property = _Properties[key];

            if (property.KeybindEnabled) {
                let keybind = _Settings.RegisterSetting(`${property.Name}-Keybind`, `Generated Keybind for the ${property.Name} property`, '', SettingTypes.Type.Keybind);
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

    function AddNewProperty(): Property {
        const newPropertyName = "New Property";
        let newProperty = {
            KeybindEnabled: false,
            Name: newPropertyName,
            Append: false,
            Tracks: [1],
            ItemProperties: undefined
        };
        _Properties[newPropertyName] = newProperty;

        return newProperty;
    }

    function AddItemProperties(properties: Property): Property {
        let currentTimeline = ResolveFunctions.GetCurrentTimeline();

        let currentVideoItem = currentTimeline.GetCurrentVideoItem();

        let currentProperties: TimelineItemProperties = currentVideoItem.GetProperty() as TimelineItemProperties;
        console.log(currentProperties);

        _Properties[properties.Name] = {
            KeybindEnabled: properties.KeybindEnabled,
            Name: properties.Name,
            Append: properties.Append,
            Tracks: properties.Tracks,
            ItemProperties: currentProperties
        }

        return _Properties[properties.Name];
    }

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
                if (!item) {
                    continue;
                }
                let itemStart = item.GetStart();
                let itemEnd = item.GetEnd();

                if (playheadPosition >= itemStart && playheadPosition <= itemEnd) {
                    
                    Object.entries(itemProps).forEach(([key, value]) => {
                        if (value === undefined) return;

                        if (properties.Append) {
                            let currentValue = item.GetProperty(key);

                            if (currentValue === undefined) return;
                            if (currentValue.toString() == "true" || currentValue.toString() == "false") return; //probably a better way to 
                            
                            value = currentValue + value;
                            item.SetProperty(key, value);

                            return;
                        }

                        item.SetProperty(key, value);
                    });

                    break;
                }
            }
        }
    }


</script>


<main id={componentID}>
    <button on:click={AddNewProperty}>add new</button>
    <button on:click={() => { AddItemProperties(_Properties["New Property"]) }}>add properties</button>
    <button on:click={() => { ApplyProperties(_Properties["New Property"]) }}>test apply</button>
</main>


<style lang="scss">

</style>