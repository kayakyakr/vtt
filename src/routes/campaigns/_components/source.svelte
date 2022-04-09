<script>
  import { mutation } from "svelte-apollo";
  import { UPDATE_SOURCE_URL } from "$lib/queries";
  import { campaignId } from "$lib/stores/campaign";
  import { sourceUrl } from "$lib/stores/source";
  let frame
  let localSourceUrl

  const updateSource = mutation(UPDATE_SOURCE_URL)
  
  chrome.runtime.onMessage.addListener(async ({ message, sourceUrl: srcChange }) => {
    switch(message) {
      case "sync-source-url":
        if (!srcChange) { break; }
        if (srcChange !== $sourceUrl) {
          updateSource({ variables: { campaignId: $campaignId, sourceUrl: srcChange } })
        }
        break;
    }
  })

  $: {
    if (!localSourceUrl) {
      localSourceUrl = $sourceUrl
    }
  }
</script>

{#if localSourceUrl }
  <iframe bind:this={frame} src="{localSourceUrl}" title="Select your source" />
{/if}

<style lang="scss">
</style>