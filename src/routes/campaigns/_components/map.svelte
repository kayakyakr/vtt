<script>
  import { getContext } from "svelte"
  import { mutation } from "svelte-apollo"

  import { CREATE_MAP } from "$lib/queries"

  const campaign = getContext('campaign')
  const createMap = mutation(CREATE_MAP)

  chrome.runtime.onMessage.addListener(({ message, url, playerUrl, name }) => {
    if (message === "map-selected") {
      // determine if map is already open
      const map = $campaign.data.campaign_by_pk?.maps?.find(m => m.url === url)
      if (!map) {
        // add map to campaign
        createMap({
          variables: {
            campaign_id: $campaign.data.campaign_by_pk.id,
            url,
            player_url: playerUrl,
            name,
          }
        })
      }      
    }
  })
</script>