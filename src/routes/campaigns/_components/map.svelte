<script>
  import { getContext, onMount } from "svelte"
  import { mutation } from "svelte-apollo"
  import * as PIXI from "pixi.js"
  import { install } from '@pixi/unsafe-eval';

  // Apply the patch to PIXI
  install(PIXI);

  import { ACTIVATE_MAP, CREATE_MAP, DELETE_MAP, UPDATE_TOKEN } from "$lib/queries"
  import { players } from "$lib/stores/players";
  import { campaign } from "$lib/stores/campaign";
  import { tokens } from "$lib/stores/tokens";
  import { maps, activeMap } from "$lib/stores/maps";
  import { makeDraggable } from "$lib/drawing/makeDraggable";
  import { buildToken } from "$lib/drawing/buildToken"

  const DEFAULT_AVATAR = "https://www.dndbeyond.com/content/1-0-1860-0/skins/waterdeep/images/characters/default-avatar.png"

  const createMap = mutation(CREATE_MAP)
  const deleteMap = mutation(DELETE_MAP)
  const activateMap = mutation(ACTIVATE_MAP)
  const updateToken = mutation(UPDATE_TOKEN)
  const isPlayer = getContext('isPlayer')

  let visibleMapElement

  $: mapUrl = isPlayer && $activeMap?.player_url || $activeMap?.url

  // TODO: clean up and style the map tabs
  chrome.runtime.onMessage.addListener(({ message, url, playerUrl, name }) => {
    if (message === "map-selected") {
      // determine if map is already open
      const map = $maps?.find(m => m.url === url)
      if (!map) {
        // add map to campaign
        createMap({
          variables: {
            campaign_id: $campaign.data.campaign_by_pk.id,
            url,
            player_url: playerUrl,
            name,
            tokens: $players.map(player => ({ name: player.name, image_url: player.avatarUrl || DEFAULT_AVATAR, x: 0, y: 0 }))
          }
        })
      }      
    }
  })

  function closeActiveMap() {
    deleteMap({
      variables: {
        id: $activeMap.id
      }
    })
  }

  function setActiveMap(id) {
    activateMap({
      variables: {
        campaign_id: $campaign.data.campaign_by_pk.id,
        id
      }
    })
  }

  let pixi
  function initializePixi() {
    if (pixi) return
    if (!visibleMapElement) return
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
  let baseScale
  let mapHolder
  let lastMap
  $: scale = baseScale * zoom

  async function drawMap() {
    initializePixi()

    // draw map, grid, and tokens
    const texture = await PIXI.Texture.fromURL(mapUrl)
    baseScale = Math.min(pixi.screen.width / texture.width, pixi.screen.height / texture.height)
    const mapSprite = new PIXI.Sprite(texture)
    mapHolder = new PIXI.Container()
    mapHolder.addChild(mapSprite)

    pixi.stage.addChild(mapHolder)
    pixi.stage.scale.set(baseScale * zoom)

    makeDraggable(mapHolder, () => {})
  }

  $: {
    if (!visibleMapElement) break $

    if(!mapUrl && mapHolder) {
      mapHolder.destroy()
      mapHolder = null
    } else if (mapUrl && mapUrl !== lastMap) {
      if(mapHolder) {
        mapHolder.destroy()
        mapHolder = null
      }
      drawMap()
    }

    lastMap = mapUrl
  }

  const boardTokens = {}
  $: {
    if(!mapHolder) break $;

    const tokenIds = []
    $tokens.forEach((token) => {
      let tokenElement = boardTokens[token.id]
      tokenIds.push(token.id)
      if (tokenElement) {
        tokenElement.position?.set(token.x, token.y)
      } else {
        boardTokens[token.id] = tokenElement = buildToken(token)
        makeDraggable(tokenElement, () => {
          updateToken({
            variables: {
              id: token.id,
              x: tokenElement.position.x,
              y: tokenElement.position.y
            }
          })
        })
        mapHolder.addChild(tokenElement)
      }
    })

    // remove tokens that are no longer on the map
    const missingTokenIds = Object.keys(boardTokens).filter(bt => !tokenIds.includes(Number(bt)))
    missingTokenIds.forEach(token => {
      boardTokens[token].destroy()
      delete boardTokens[token]
    })
  }

  $: if (pixi) pixi.stage.scale.set(scale)
</script>

  <div class="mapView">
    <div class="mapControls">
      <div class="mapTabs">
        {#each $maps as map}
          <div class="tab" class:active={map.active} on:click={setActiveMap(map.id)}>
            {map.name}
          </div>
        {/each}
      </div>
      {#if $activeMap}
        <div class="globalControls">
          <button on:click={closeActiveMap}>Close</button>
          <button on:click={() => zoom *= 1.1}>+</button>
          <button on:click={() => zoom *= 0.9}>-</button>
        </div>
      {/if}
    </div>
    <div class="mapDisplay" bind:this={visibleMapElement}></div>
    {#if !$activeMap}
      <div>When you launch a map, your players will see it here</div>
    {/if}
  </div>

<style lang="scss">
  .mapView {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    flex: 1;
    height: 100%;
  }
  .mapDisplay {
    flex: 1;
    position: relative;

    :global(canvas) {
      position: absolute;
    }
  }

  .mapControls {
    display: flex;
    border-bottom: 1px solid rgb(105, 102, 102);

    .mapTabs {
      display: flex;
      flex: 1;
      padding-top: 2px;
      margin-left: 2px;

      .tab {
        color: white;
        padding: 2px 8px;
        border: 1px solid rgb(105, 102, 102);
        border-bottom: 0px;
        border-radius: 3px 3px 0 0;
        cursor: pointer;

        &.active {
          background: #646469;
        }
      }
    }

    .globalControls {
      display: flex;
      margin-right: 25px;
    }
  }
</style>