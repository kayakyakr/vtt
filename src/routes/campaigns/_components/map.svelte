<script>
  import { getContext, onMount } from "svelte"
  import { mutation } from "svelte-apollo"
  import * as PIXI from "pixi.js"
  import { install } from '@pixi/unsafe-eval';

  // Apply the patch to PIXI
  install(PIXI);

  import { CREATE_MAP, DELETE_MAP } from "$lib/queries"
  import { players } from "$lib/stores/players";
  import { makeDraggable } from "$lib/drawing/makeDraggable";
  import { buildToken } from "$lib/drawing/buildToken"

  const DEFAULT_AVATAR = "https://www.dndbeyond.com/content/1-0-1860-0/skins/waterdeep/images/characters/default-avatar.png"

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

  let zoom = 1
  let x = 0
  let y = 0
  let baseScale
  let mapHolder
  let playerTokens = []
  $: scale = baseScale * zoom

  function drawMap() {
    initializePixi()
    baseScale = Math.min(pixi.screen.width / invisibleMapElement.width, pixi.screen.height / invisibleMapElement.height)

    // draw map, grid, and tokens
    const texture = PIXI.Texture.from(invisibleMapElement)
    const mapSprite = new PIXI.Sprite(texture)
    mapHolder = new PIXI.Container()
    mapHolder.addChild(mapSprite)

    pixi.stage.addChild(mapHolder)
    pixi.stage.scale.set(baseScale * zoom)

    makeDraggable(mapHolder)
  }

  $: {
    if(!mapHolder || isPlayer) break $;

    playerTokens = $players.map((player) => {
      const token = buildToken({ imageUrl: player.avatarUrl || DEFAULT_AVATAR, name: player.name })
      makeDraggable(token)
      mapHolder.addChild(token)
    })
  }

  $: if (pixi) pixi.stage.scale.set(scale)
</script>

{#if activeMap}
  <div class="mapView">
    <div class="mapControls">
      {#each maps as map}<span class="tab">{map.name}</span>{/each}
      <button on:click={closeActiveMap}>Close</button>
      <button on:click={() => zoom += 0.2}>+</button>
      <button on:click={() => zoom -= 0.1}>-</button>
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

  .tab {
    color: white;
  }
</style>