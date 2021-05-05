<script>
  let sourceUrl

  chrome.storage.sync.get(["sourceUrl"], ({ sourceUrl: srcUrl = "/sources" }) => { 
    sourceUrl = srcUrl 
  })

  chrome.storage.sync.onChanged.addListener(({ sourceUrl: srcChange }) => {
    if (srcChange) sourceUrl = srcChange.newValue
  })
</script>

{#if sourceUrl }
  <iframe src="{sourceUrl}" title="Select your source" />
{/if}


<style lang="scss">
  iframe {
    height: 100%;
    width: 100%;
  }
</style>