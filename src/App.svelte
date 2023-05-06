<script lang="ts">
    import ModuleView from "./ModuleView.svelte";
    import Nav from "./Nav.svelte";
</script>

<main>
    <Nav/>
    <ModuleView/>
</main>

<style lang="scss">
    main {
        width: 100vw;
        height: 100vh;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;

        overflow: hidden;
    }
</style>