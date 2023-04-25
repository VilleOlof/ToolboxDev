<script lang="ts">
    import { Resolve, ResolveFunctions } from "../src/Lib/DavinciResolve";
    import { ResolveEnums } from "../src/Lib/ResolveEnums";

    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';
    import { Common } from '../src/Lib/Common';

    import { onMount } from 'svelte';
    import { slide } from "svelte/transition";

    const componentID: string = "QuickActions";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large);
    });

    let defaultProfile = {
        name: "New Profile",
        actions: [],
    }

    let _Settings = GlobalSettings.GetInstance(componentID);
    let _Datastore = new DataStore(componentID);

    let _profiles = _Datastore.Get<ProfileObject>("Profiles", { "New Profile": defaultProfile});
    if (Object.keys(_profiles).length == 0) _profiles["New Profile"] = defaultProfile; //ensures that there is always at least one profile.

    $: _Datastore.Set("Profiles", _profiles); //ensures that the datastore is updated when the profiles are updated

    let CurrentProfile: string = _Datastore.Get<string>("CurrentProfile", "Default");
    $: _Datastore.Set("CurrentProfile", CurrentProfile);

    if (!Object.keys(_profiles).includes(CurrentProfile)) CurrentProfile = Object.keys(_profiles)[0];

    type Profile = {
        name: string,
        actions: Array<Action>,
    }
    type ProfileObject = {
        [key: string]: Profile,
    }

    type Action = {
        name: string,
        function: string,
        values: Array<ActionInput>,
        Minimized: boolean,
        UUID: string,
    }

    type ActionInput = {
        name: string,
        type: "string" | "number" | "boolean" | "dropdown",
        value: string | number | boolean,
        dropdownOptions?: Array<string>,
    }

    const Actions: Action[] = [
        {
            name: "Add Track",
            function: "Add Track",
            values: [
                {
                    name: "Name",
                    type: "string",
                    value: "New Track",
                },
                {
                    name: "Type",
                    type: "dropdown",
                    value: "Video",
                    dropdownOptions: Object.keys(ResolveEnums.TrackType),
                }
            ],
            Minimized: false,
            UUID: "",
        },
        {
            name: "Delete Track",
            function: "Delete Track",
            values: [
                {
                    name: "Name",
                    type: "string",
                    value: "New Track",
                },
                {
                    name: "Type",
                    type: "dropdown",
                    value: "Video",
                    dropdownOptions: Object.keys(ResolveEnums.TrackType),
                }
            ],
            Minimized: false,
            UUID: "",
        },
        {
            name: "Create Timeline",
            function: "Create Timeline",
            values: [
                {
                    name: "Name",
                    type: "string",
                    value: "New Timeline",
                },
            ],
            Minimized: false,
            UUID: "",
        },
        {
            name: "Import Media",
            function: "Import Media",
            values: [
                {
                    name: "Timeline Or Mediapool",
                    type: "dropdown",
                    value: "Mediapool",
                    dropdownOptions: ["Timeline", "Mediapool"],
                },
                {
                    name: "Default Path",
                    type: "string",
                    value: "",
                },
                {
                    name: "Start Frame",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Clip Color",
                    type: "dropdown",
                    value: "Blue",
                    dropdownOptions: Object.keys(ResolveEnums.ClipColor),
                },
                {
                    name: "Timeline Name |?",
                    type: "string",
                    value: "New Timeline",
                    
                },
                {
                    name: "Track (If Timeline)",
                    type: "number",
                    value: 1,
                },
                {
                    name: "Media Bin Name |?",
                    type: "string",
                    value: "Content",
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Apply LUT",
            function: "Apply LUT",
            values: [
                {
                    name: "File Path",
                    type: "string",
                    value: "",
                },
                {
                    name: "Tracks (Comma Separated)",
                    type: "string",
                    value: "1",
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Add Bin",
            function: "Add Bin",
            values: [
                {
                    name: "Name",
                    type: "string",
                    value: "New Bin",
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Add Marker",
            function: "Add Marker",
            values: [
                {
                    name: "Name",
                    type: "string",
                    value: "New Marker",
                },
                {
                    name: "Color",
                    type: "dropdown",
                    value: "Blue",
                    dropdownOptions: Object.keys(ResolveEnums.ClipColor),
                },
                {
                    name: "Duration (Frames)",
                    type: "number",
                    value: 1,
                },
                {
                    name: "Position (Frames) |?",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Use Playhead",
                    type: "boolean",
                    value: true,
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "New Compound",
            function: "New Compound",
            values: [
                {
                    name: "Tracks: (Comma Separated)",
                    type: "string",
                    value: "1",
                },
                {
                    name: "Name",
                    type: "string",
                    value: "New Compound Clip",
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Insert Generator",
            function: "Insert Generator",
            values: [
                {
                    name: "Generator",
                    type: "dropdown",
                    value: "Solid Color",
                    dropdownOptions: Object.values(ResolveEnums.TimelineGenerator),
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Insert Title",
            function: "Insert Title",
            values: [
                {
                    name: "Title",
                    type: "dropdown",
                    value: "Text",
                    dropdownOptions: Object.values(ResolveEnums.TitleNames),
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Lock Track",
            function: "Lock Track",
            values: [
                {
                    name: "Tracks (Comma Separated)",
                    type: "string",
                    value: "1",
                },
                {
                    name: "Type",
                    type: "dropdown",
                    value: "Video",
                    dropdownOptions: Object.keys(ResolveEnums.TrackType),
                },
                {
                    name: "Lock",
                    type: "boolean",
                    value: true,
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Delay",
            function: "Delay",
            values: [
                {
                    name: "Seconds",
                    type: "number",
                    value: 1,
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Clip Position",
            function: "Clip Position",
            values: [
                {
                    name: "Pan",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Tilt",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Anchor X",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Anchor Y",
                    type: "number",
                    value: 0,
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Clip Zoom",
            function: "Clip Zoom",
            values: [
                {
                    name: "Zoom X",
                    type: "number",
                    value: 1,
                },
                {
                    name: "Zoom Y",
                    type: "number",
                    value: 1,
                },
                {
                    name: "Pitch",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Yaw",
                    type: "number",
                    value: 0,
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Clip Rotation",
            function: "Clip Rotation",
            values: [
                {
                    name: "Rotation",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Flip X",
                    type: "boolean",
                    value: false,
                },
                {
                    name: "Flip Y",
                    type: "boolean",
                    value: false,
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Clip Crop",
            function: "Clip Crop",
            values: [
                {
                    name: "Crop Left",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Crop Right",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Crop Top",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Crop Bottom",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Crop Softness",
                    type: "number",
                    value: 0,
                },
                {
                    name: "Crop Retain",
                    type: "boolean",
                    value: false,
                }
            ],
            Minimized: false,
            UUID: ""
        },
        {
            name: "Clip Opacity",
            function: "Clip Opacity",
            values: [
                {
                    name: "Opacity",
                    type: "number",
                    value: 100,
                }
            ],
            Minimized: false,
            UUID: ""
        }
    ]

    let ActionFunctions = {
        "Add Track": (trackName: string, trackType: ResolveEnums.TrackType) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            currentTimeline.AddTrack(trackType);
            const trackCount = currentTimeline.GetTrackCount(trackType);
            currentTimeline.SetTrackName(trackType, trackCount, trackName);
        },
        "Delete Track": (trackName: string, trackType: ResolveEnums.TrackType) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            const trackCount = currentTimeline.GetTrackCount(trackType);
            for (let i = 1; i <= trackCount; i++) {
                const CurrenttrackName = currentTimeline.GetTrackName(trackType, i);
                if (CurrenttrackName == trackName) {
                    currentTimeline.DeleteTrack(trackType, i);
                    break;
                }
            }
        },
        "Create Timeline": (timelineName: string) => {
            const currentMediapool = ResolveFunctions.GetCurrentProject().GetMediaPool();
            currentMediapool.CreateEmptyTimeline(timelineName);
        },
        "Import Media": (importType: "Timeline" | "Mediapool", defaultPath: string, startFrame:number = 0, clipColor: ResolveEnums.ClipColor = ResolveEnums.ClipColor.Blue, timelineName?: string, trackIndex?: number, mediapoolBinName?: string) => {

        },
        "Apply LUT": (filePath: string, tracks: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();

            const trackArray = tracks.split(",").map(Number);
            const timelineItems = ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackArray, currentTimeline) as TimelineItem[];

            currentTimeline.ApplyGradeFromDRX(filePath, 0, timelineItems);
        },
        "Add Bin": (binName: string) => {
            const projectManager = Resolve.GetProjectManager();
            projectManager.GotoRootFolder();

            const mediapool = ResolveFunctions.GetCurrentProject().GetMediaPool();
            const ParentFolder = mediapool.GetRootFolder();

            mediapool.AddSubFolder(ParentFolder, binName);
        },
        "Add Marker": (markerName: string, markerColor: ResolveEnums.MarkerColor, markerDuration: number, usePlayhead: boolean, markerPosition?: number) => {
            const currenTimeline = ResolveFunctions.GetCurrentTimeline();

            //god forgive me for nesting ternary operators
            markerPosition = markerPosition ? markerPosition : usePlayhead ? ResolveFunctions.ConvertTimecodeToFrames(currenTimeline.GetCurrentTimecode()) : 0;
            currenTimeline.AddMarker(markerPosition, markerColor, markerName, "Generated Marker From Quick Actions", markerDuration);
        },
        "New Compound": (tracks: string, compoundClipName: string) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();

            const trackNumbers = tracks.split(",").map(Number);
            const timelineItems = ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackNumbers, currentTimeline) as TimelineItem[];

            currentTimeline.CreateCompoundClip(timelineItems, compoundClipName);
        },
        "Insert Generator": (generator: ResolveEnums.TimelineGenerator) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            currentTimeline.InsertGeneratorIntoTimeline(generator);
        },
        "Insert Title": (title: ResolveEnums.TitleNames) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();
            currentTimeline.InsertTitleIntoTimeline(title);
        },
        "Lock Track": (tracks: string, trackType: ResolveEnums.TrackType, Lock: boolean) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();

            const trackNumbers = tracks.split(",").map(Number);
            const trackCount = currentTimeline.GetTrackCount(trackType);

            for (let i = 1; i <= trackCount; i++) {
                if (trackNumbers.includes(i)) {
                    currentTimeline.SetTrackLock(trackType, i, Lock);
                }
            }
        },
        "Delay": (seconds: number) => {
            const start = Date.now();
            let now = start;
            while (now - start < (seconds*1000)) {
                now = Date.now();
            }
        },
        "Clip Position": (Pan: number, Tilt: number, AnchorX: number, AnchorY: number) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();

            const trackCount = currentTimeline.GetTrackCount(ResolveEnums.TrackType.Video);

            ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackCount, currentTimeline, (item) => {
                item.SetProperty("Pan", Pan);
                item.SetProperty("Tilt", Tilt);
                item.SetProperty("AnchorX", AnchorX);
                item.SetProperty("AnchorY", AnchorY);
            });
        },
        "Clip Zoom": (ZoomX: number, ZoomY: number, Pitch: number, Yaw: number) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();

            const trackCount = currentTimeline.GetTrackCount(ResolveEnums.TrackType.Video);

            ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackCount, currentTimeline, (item) => {
                item.SetProperty("ZoomX", ZoomX);
                item.SetProperty("ZoomY", ZoomY);
                item.SetProperty("Pitch", Pitch);
                item.SetProperty("Yaw", Yaw);
            });
        },
        "Clip Rotation": (Rotation: number, FlipX: boolean, FlipY: boolean) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();

            const trackCount = currentTimeline.GetTrackCount(ResolveEnums.TrackType.Video);

            ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackCount, currentTimeline, (item) => {
                item.SetProperty("Rotation", Rotation);
                item.SetProperty("FlipX", FlipX);
                item.SetProperty("FlipY", FlipY);
            });
        },
        "Clip Crop": (CropLeft: number, CropRight: number, CropTop: number, CropBottom: number, CropSoftness: number, CropRetain: boolean) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();

            const trackCount = currentTimeline.GetTrackCount(ResolveEnums.TrackType.Video);

            ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackCount, currentTimeline, (item) => {
                item.SetProperty("CropLeft", CropLeft);
                item.SetProperty("CropRight", CropRight);
                item.SetProperty("CropTop", CropTop);
                item.SetProperty("CropBottom", CropBottom);
                item.SetProperty("CropSoftness", CropSoftness);
                item.SetProperty("CropRetain", CropRetain);
            });
        },
        "Clip Opacity": (opacity: number) => {
            const currentTimeline = ResolveFunctions.GetCurrentTimeline();

            const trackCount = currentTimeline.GetTrackCount(ResolveEnums.TrackType.Video);

            ResolveFunctions.GetTimelineItem(ResolveEnums.TrackType.Video, trackCount, currentTimeline, (item) => {
                item.SetProperty("Opacity", opacity);
            });
        }
    }

    function UpdateDatastore(): void {
        _profiles = _profiles;
    }

    let NewActionDropdown: string;
    function AddNewAction(): void {
        const newAction = Actions.find(action => action.name == NewActionDropdown);
        const clonedAction = JSON.parse(JSON.stringify(newAction));
        clonedAction.UUID = Common.GetRandomHash(8);
        _profiles[CurrentProfile].actions.push(clonedAction);
        UpdateDatastore();
    }

    function DeleteAction(actionUUID: string): void {
        _profiles[CurrentProfile].actions = _profiles[CurrentProfile].actions.filter(action => action.UUID != actionUUID);
        UpdateDatastore();
    }

    function AddNewProfile(): void {
        if (Object.keys(_profiles).includes("New Profile")) return;

        _profiles["New Profile"] = {
            name: "New Profile",
            actions: []
        }
        UpdateDatastore();
    }

    function RemoveProfile(): void {
        delete _profiles[CurrentProfile];

        if (Object.keys(_profiles).length == 0 || CurrentProfile == undefined) {
            AddNewProfile();
        }

        CurrentProfile = Object.keys(_profiles)[0];
        UpdateDatastore();
    }

    function RunActions(): void {
        _profiles[CurrentProfile].actions.forEach(action => {
            const actionFunction = ActionFunctions[action.function];
            const actionValues = action.values.map(value => value.value);
            actionFunction(...actionValues);
        });
    }

    function UpdateProfileKeyName(): void {
        _profiles[_profiles[CurrentProfile].name] = _profiles[CurrentProfile];
        const oldProfileName = CurrentProfile;
        CurrentProfile = _profiles[CurrentProfile].name;
        delete _profiles[oldProfileName];
        UpdateDatastore();
    }

</script>


<main id={componentID}>
    <div id="top">
        <div id=topTitle>
            <h1>Quick Actions</h1>
            <select id="actionProfiles" bind:value={CurrentProfile}>
                {#each Object.keys(_profiles) as profile}
                    <option value={profile}>{profile}</option>
                {/each}
            </select>
        </div>

        <div id=profileNameContainer>
            <p>Profile Name:</p>
            <input type="text" bind:value={_profiles[CurrentProfile].name} on:change={UpdateProfileKeyName} />
        </div>

        <div id=topButtons>
            <div>
                <button class=buttonStyle on:click={AddNewProfile}>Add New</button>
                <button class=buttonStyle on:click={RemoveProfile}>Remove</button>
            </div>
        
            <div>
                <button class=buttonStyle on:click={RunActions}>Run Actions</button>
            </div>
        </div>
    </div>

    <div id="actionList">

        <div id="autoGen">
            {#each _profiles[CurrentProfile].actions as action}
                <div class="action" transition:slide|local>
                    <div class=actionHeader>
                        <h2>{action.name}</h2>
                        <div>
                            <button class="buttonStyle" on:click={() => { action.Minimized = !action.Minimized}}>{action.Minimized ? "Expand" : "Minimize"}</button>
                            <button class=buttonStyle id=DeleteAction on:click={() => { DeleteAction(action.UUID)}}><b>-</b></button>
                        </div>
                    </div>

                    {#if !action.Minimized}
                        <div class="actionInputs" transition:slide|local>
                            {#each action.values as value}
                                <div class="actionInput">
                                    <label for={value.name}>{value.name}</label>
                                    {#if value.type == "string"}
                                        <input type="text" bind:value={value.value} />
                                    {:else if value.type == "number"}
                                        <input type="number" bind:value={value.value} />
                                    {:else if value.type == "boolean"}
                                        <!-- uhh ignore this error, the code still compiles AND works like it should-->
                                        <input type="checkbox" bind:checked={value.value} />
                                    {:else if value.type == "dropdown"}
                                        <select bind:value={value.value}>
                                            {#each value.dropdownOptions as option}
                                                <option value={option}>{option}</option>
                                            {/each}
                                        </select>
                                    {/if}
                                </div>

                            {/each}
                        </div>
                        
                    {/if}
                </div>

            {/each}
        </div>

        <div class="lineBreak"></div>

        <div id="addAction">
            <select id="actionDropdown" bind:value={NewActionDropdown}>
                {#each Actions as action}
                    <option value={action.name}>{action.name}</option>
                {/each}
            </select>
            <button class=buttonStyle on:click={AddNewAction}>Add New Action</button>
        </div>

    </div>

</main>


<style lang="scss">
    @use "../src/scss/Colors";

    main {
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #actionList {
        background-color: Colors.$BackgroundColor;
        color: Colors.$TextColor;

        width: 98%;
        min-height: 1rem;

        margin: 0.25rem;

        border-radius: 0.3rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #autoGen {
        width: 98%;
    }

    .action {
        background-color: darken(Colors.$BackgroundColor, 2%);

        border-radius: 0.25rem;
        padding: 0.25rem;
    }

    .actionHeader {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        h2 {
            margin: 0;
            font-size: 1rem;
            margin-left: 0.75rem;

            white-space: nowrap;
        }

        button {
            font-size: 0.75rem;
        }
    }

    .actionInputs {
        margin-top: 0.5rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .actionInput {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        width: 98%;
        padding: 0.2rem;

        select {
            @extend #actionProfiles;
        }

        input {
            min-width: 2rem;
            max-width: 5.5rem;
        }

        //margin-left: 0.5rem;
        white-space: nowrap;
    }

    #top {
        width: 100%;

        & > div {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            padding: 0.5rem;
        }

        h1 {
            margin: 0;
            font-size: 1.5rem;
            opacity: 0.5;
        }
    }

    #actionProfiles {
        min-width: 5rem;
        max-width: 7rem;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        padding: 0.2rem 0.25rem;

        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        &:focus, &:hover {
            background-color: Colors.$BackgroundColor;
        }

        transition: background-color 0.1s ease-in-out;
    }

    #profileNameContainer {
        margin: 0;

        & > p {
            margin: 0;
            font-size: 1rem;
            opacity: 0.5;
        }
    }

    input {
        margin-left: 0.5rem;

        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        padding: 0.2rem 0.5rem;

        min-width: 3rem;

        transition: background-color 0.1s ease-in-out;

        &:focus, &:hover {
            background-color: Colors.$BackgroundColor;
        }
    }

    #addAction {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        padding: 0.5rem;

        & > button {
            margin-left: 1rem;
        }
    }

    #actionDropdown {
        @extend #actionProfiles;

        min-width: 10rem;

        &:focus, &:hover {
            background-color: darken(Colors.$BackgroundColor, 3%);
        }
    }


    .buttonStyle {
        background-color: Colors.$ColumnColor;
        color: Colors.$TextColor;

        border-radius: 0.25rem;
        border-color: Colors.$BackgroundColor;

        outline: none;

        font-size: 0.8rem;

        padding: 0.2rem 0.5rem;

        min-width: 3rem;

        cursor: pointer;

        transition: background-color 0.1s ease-in-out;

        &:hover {
            background-color: Colors.$BackgroundColor;
        }
    }

    .lineBreak {
        width: 90%;
        height: 0.2rem;

        background-color: Colors.$ColumnColor;
        opacity: 0.75;

        margin-bottom: 0.25rem;
        margin-top: 0.25rem;

        transition: background-color 0.1s ease-in-out;
    }

    #DeleteAction {
        padding: 0.2rem 0;
        min-width: 2rem;
    }

</style>