<script>
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

  // TODO: Store source in campaign
</script>

{#if sourceUrl }
  <iframe bind:this={frame} src="{sourceUrl}" title="Select your source" />
{/if}

<style lang="scss">
</style>