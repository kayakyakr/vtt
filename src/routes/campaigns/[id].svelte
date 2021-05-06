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
      width: 430px;
      display: flex;
      flex-direction: column;
      justify-content: stretch;
      align-items: stretch;

      & > :global(*) {
        flex: 1;
      }
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