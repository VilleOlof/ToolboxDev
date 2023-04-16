<script lang="ts">
    import { DataStore } from "../src/Stores/DataStore";
    import { Settings, GlobalSettings, SettingTypes } from '../src/Lib/Settings';
    import { ModuleHandler } from '../src/Lib/ModuleHandler';

    import { onMount } from 'svelte';

    const componentID: string = "Notes";

    onMount(() => {
        ModuleHandler.RegisterModule(componentID, ModuleHandler.ComponentSize.Large);
    });

    let _Settings = GlobalSettings.GetInstance(componentID);

    let _ResetOnStart = _Settings.AddSetting("Reset On Start", "Resets the notes content upon start", SettingTypes.Type.Checkbox, false);

</script>


<main id={componentID}>
    <p>Notes</p>
    <textarea name="Notes" id="Notes" cols="15" rows="10"></textarea>
</main>


<style lang="scss">
    @use "../src/scss/Colors";

    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    textarea {
        background-color: Colors.$BackgroundColor;
        color: Colors.$TextColor;

        font-family: "Roboto", sans-serif;

        outline: none;

        resize: vertical;

        max-width: 100%;

        margin: 0.5rem;
    }

    p {
        color: Colors.$TextColor;
        font-family: "Roboto", sans-serif;

        font-size: 1rem;
        opacity: 0.75;

        margin: 0.25rem 0.25rem 0rem 0.55rem;
    }
</style>