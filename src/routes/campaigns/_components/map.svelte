<script>
  import { getContext, onMount } from "svelte"
  import { mutation } from "svelte-apollo"
  import * as PIXI from "pixi.js"
  import { install } from '@pixi/unsafe-eval';

  // Apply the patch to PIXI
  install(PIXI);

  import { CREATE_MAP, DELETE_MAP } from "$lib/queries"

  const campaign = getContext('campaign')
  const createMap = mutation(CREATE_MAP)
  const deleteMap = mutation(DELETE_MAP)
  const isPlayer = getContext('isPlayer')

  let visibleMapElement
  let invisibleMapElement

  let maps
  let activeMap
  $: maps = $campaign.data?.campaign_by_pk?.maps ?? []
  $: activeMap = maps.find(m => m.active) ?? maps[0]
  $: mapUrl = isPlayer && activeMap.player_url || activeMap.url

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

  function closeActiveMap() {
    deleteMap({
      variables: {
        id: activeMap.id
      }
    })
  }

  let pixi
  function initializePixi() {
    if (pixi) return
    pixi = new PIXI.Application({
      width: visibleMapElement.width,
      height: visibleMapElement.height,
      resizeTo: visibleMapElement
    })
    visibleMapElement.appendChild(pixi.view)
  }

  onMount(() => {
    initializePixi()
  })

  function drawMap() {
    initializePixi()
    // calculate the scale
    const baseScale = Math.min(pixi.screen.width / invisibleMapElement.width, pixi.screen.height / invisibleMapElement.height)
    const zoom = 1

    // draw map, grid, and tokens
    const texture = PIXI.Texture.from(invisibleMapElement)
    const mapSprite = new PIXI.Sprite(texture)
    pixi.stage.addChild(mapSprite)
    pixi.stage.scale.set(baseScale * zoom)
  }
</script>

{#if activeMap}
  <div class="mapView">
    <div class="mapControls">
      {#each maps as map}<span>{map.name}</span>{/each}
      <button on:click={closeActiveMap}>Close</button>
    </div>
    <div class="mapDisplay" bind:this={visibleMapElement}></div>
    <div class="mapImageHolder">
      <img crossorigin="anonymous" src="{mapUrl}" alt="Invisible Map" on:load={drawMap} bind:this={invisibleMapElement} />
    </div>
  </div>
{:else}
  <div>When you launch a map, your players will see it here</div>
{/if}

<style>
  .mapImageHolder {
    display: none;
  }

  .mapView {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    height: 100%;
  }
  .mapDisplay {
    flex: 1;
  }
</style>