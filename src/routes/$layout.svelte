<slot></slot>

<style lang="scss">
  :global(#svelte) {
    display: none;
  }

  :global(.VTT #site) {
    display: none;
  }
  
  :global(.VTT #svelte) {
    display: block;
    height: 100%;
  }
</style>