<script lang="ts">
    import { onMount } from "svelte";
    import { Common } from "./Lib/Common";
    import { AppSettings } from "./Lib/AppSettings";

    let mainVersion: string = " Loading...";
    let devVersion: string = " Loading...";
    onMount(async () => {
        mainVersion = await GetMainVersion();
        devVersion = AppSettings.GetMetadata().Version;
    });

    async function GetMainVersion() {
        const githubVersion: string = (await (await fetch('https://raw.githubusercontent.com/VilleOlof/Toolbox/main/Metadata.json')).json()).Version;
        return githubVersion;
    }

    const OpenProjectFolder = () => Common.IO.OpenFolder(`${Common.IO.GetRootFolder()}/..`);
</script>


<nav>
    <div class="titleContainer">
        <h1>Davinki Toolbox Dev</h1>
        <svg 
            on:click={OpenProjectFolder} on:keydown={OpenProjectFolder}
            xmlns="http://www.w3.org/2000/svg" height="52" viewBox="0 96 960 960" width="52" fill="currentColor">
            <path d="M141 896q-24 0-42-18.5T81 836V316q0-23 18-41.5t42-18.5h280l60 60h340q23 0 41.5 18.5T881 376v460q0 23-18.5 41.5T821 896H141Zm0-580v520h680V376H456l-60-60H141Zm0 0v520-520Z"/>
        </svg>
    </div>

    <div class="versions">
        <p>Dev V{devVersion}</p>
        <p>Main V{mainVersion}</p>
    </div>
</nav>


<style lang="scss">
    @use './scss/Colors';

    nav {
        background-color: darken(Colors.$BackgroundColor, 3%);

        width: 100vw;
        height: 5vh;

        display: flex;
        justify-content: space-between;
        align-items: center;

        h1 {
            margin-left: 1rem;
        }
    }

    .versions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
    }

    p {
        margin-right: 1rem;
    }

    .titleContainer {
        @extend .versions;

        svg {
            margin-left: 1rem;

            width: 2.5rem;
            height: auto;

            color: Colors.$TextColor;

            &:hover {
                cursor: pointer;
                color: darken(Colors.$TextColor, 40%);
            }

            transition: color 0.1s ease-in-out;
        }
    }

</style>