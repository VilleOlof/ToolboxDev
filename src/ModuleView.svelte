<script lang="ts">
    import { onMount } from "svelte";
    import DevModule from "../module/DevModule.svelte";

    onMount(() => {
        const DevModule = document.querySelectorAll(".column > *")[0] as HTMLElement;
        DevModule.classList.add("module")
    });

</script>

<main>
    <div id="columnContainer">
        <div class="column">
            <DevModule/>
        </div>
    </div>
</main>

<style lang="scss">

    @mixin Container($justify, $align, $direction) {
        display: flex;
        justify-content: $justify;
        align-items: $align;
        flex-direction: $direction;
    }

    main {
        transform: translateY(3rem);
    }

    :global(.module) {
        min-width: 100%;

        margin: 0.5rem 0 0.5rem 0;

        position: relative;

        background-color: #28282E;
        filter: drop-shadow(0 0 0.25em #000);

        transition: transform 0.2s, background-color 1s;

        z-index: 1;

        border-radius: 0.25rem;
    }


    #columnContainer {
        @include Container(flex-start, flex-start, row);
        display: inline-flex;

        gap: 0.5rem;
        margin: 0.5rem;
        margin-top: 1rem;
        margin-right: 0.45rem;
    }

    .column {
        @include Container(flex-start, flex-start, column);

        position: relative;

        padding: 0.5rem;
        gap: 0.5rem;
        margin: 0 0.5rem 0 0.5rem;

        border-radius: 0.5rem;
	    filter: drop-shadow(0 0 0.25em #000);

        height: 100%;

        $bgColor: #212126;
        background-color: $bgColor;

        &:empty {
            background-color: rgba($bgColor, 0.75);
        } 
    }

    :global(.is-large) {
        max-width: 20rem;
        min-width: 20rem;
    }

    :global(.is-small) {
        max-width: 5rem;
        min-width: 5rem;
    }
    
</style>