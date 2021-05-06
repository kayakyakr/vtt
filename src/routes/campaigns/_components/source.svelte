<script>
  import { encounter } from "$lib/stores/encounter"
  let sourceUrl
  let frame

  chrome.storage.sync.get(["sourceUrl"], ({ sourceUrl: srcUrl = "/sources" }) => { 
    sourceUrl = srcUrl 
  })

  chrome.storage.sync.onChanged.addListener(({ sourceUrl: srcChange }) => {
    if (srcChange && frame.contentWindow.location.pathname !== srcChange.newValue) {
      sourceUrl = srcChange.newValue
    }
  })
</script>

{#if sourceUrl }
  <iframe bind:this={frame} src="{sourceUrl}" title="Select your source" class:encounter={$encounter} />
{/if}

<style lang="scss">
  .encounter {
    display: none;
  }
</style>