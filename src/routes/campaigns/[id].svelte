<script>
  import Source from "./_components/source.svelte"
  import Map from "./_components/map.svelte"
  import Encounter from "./_components/encounter.svelte"
</script>

<main class="tabletop">
  <section class="left-area">
    <Source />
    <Encounter />
  </section>
  <section class="main-area"><Map /></section>
  <section class="right-area"></section>
</main>

<style lang="scss">
  .tabletop {
    height: 100%;
    display: flex;

    .left-area {
      flex: 430px;
    }

    .main-area {
      background: black;
      flex: 1;
    }

    .right-area {
      display: none;
    }
  }
</style>