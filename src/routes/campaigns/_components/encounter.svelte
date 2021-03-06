<script>
  import { v5 } from "uuid"
  import { create as createEncounter, destroy as destroyEncounter, update as updateEncounter, fetchOne as getEncounterDetails } from "$lib/api/encounters"
  import { fetchOne as fetchCampaign } from "$lib/api/campaigns"
  import { fetchAll as fetchPlayers } from "$lib/api/players"
  import { getMonsterDetails } from "$lib/api/monsters"
  import { encounterId } from "$lib/stores/encounter"
  import { mutation } from "svelte-apollo";
  import { CREATE_TOKENS, DELETE_MONSTER_TOKENS, UPDATE_ENCOUNTER_ID } from "$lib/queries";
  import { activeMap } from "$lib/stores/maps";
  import { campaignId } from "$lib/stores/campaign";

  let monsters = []
  let loadingApi = false
  let encounterFrame
  
  const createTokens = mutation(CREATE_TOKENS)
  const deleteMonsterTokens = mutation(DELETE_MONSTER_TOKENS)
  const updateEncounterId = mutation(UPDATE_ENCOUNTER_ID)

  chrome.runtime.onMessage.addListener(async ({ message, tooltip, name }) => {
    switch(message) {
      case "monster-selected":
        monsters = [...monsters, {
          uuid: v5(location.host, v5.URL),
          name,
          id: tooltip.match(/(\d+)-tooltip/)[1],
          count: 1,
        }]
        break;
    }
  })

  // TODO: if encounter is already running, add to running encounter
  async function startEncounter() {
    loadingApi = true
    const monsterFiltered = monsters.filter((m) => m.count > 0)
    
    if (monsterFiltered.length === 0) return monsters = []
    
    const monsterDetails = await getMonsterDetails(monsterFiltered.map(m => m.id))

    if ($encounterId) {
      // add to encounter
      const encounter = await getEncounterDetails({ id: $encounterId })
      await updateEncounter({ 
        id: $encounterId, 
        monsters: [...encounter.monsters, ...monsterFiltered], 
        inProgress: encounter.inProgress,
        roundNum: encounter.roundNum,
        turnNum: encounter.turnNum
      })
      encounterFrame.contentWindow.location.reload()
    } else {
      // start encounter
      const [campaign, players] = await Promise.all([fetchCampaign(), fetchPlayers()])
      const encounter = await createEncounter({ monsters: monsterFiltered, campaign, players })
      await updateEncounterId({ variables: { campaignId: campaign.id, encounterId: encounter.id } })
    }

    await createTokens({
      variables: {
        tokens: monsterFiltered.flatMap(m => {
          return Array(m.count).fill({
            name: m.name,
            image_url: monsterDetails[m.id].avatarUrl,
            tokenType: "monster",
            map_id: $activeMap.id
          })
        })
      }
    })
    
    loadingApi = false
    monsters = []
  }

  async function endEncounter() {
    loadingApi = true
    await destroyEncounter({ encounterId: $encounterId })
    await updateEncounterId({ variables: { campaignId: $campaignId, encounterId: null } })
    await deleteMonsterTokens({ variables: { map_id: $activeMap.id } }) // TODO: delete by encounter_id

    loadingApi = false
  }
</script>

{#if $encounterId }
  <div class="run-encounter" class:loadingApi>
    <iframe src="/combat-tracker/{$encounterId}" title="encounter" bind:this={encounterFrame}/>
    <button on:click={endEncounter}>End Encounter</button>
  </div>
{/if}

{#if monsters.length}
  <table class="monster-holder" class:loadingApi>
    {#each monsters as monster}
      <tr class="monster-row">
        <td class="count">{monster.count}</td>
        <td class="name">{monster.name}</td>
        <td class="idb">
          <button class="inc" on:click={() => monster.count += 1}>+</button>
          <button class="dec" on:click={() => monster.count = Math.max(monster.count - 1, 0)}>-</button>
        </td>
      </tr>
    {/each}
    <tr class="encounter-actions">
      <td colspan="2"><button class="run" on:click={startEncounter}>{$encounterId ? "Add To" : "Run"} Encounter</button></td>
      <td><button class="cancel" on:click={() => monsters = []}>Cancel</button></td>
    </tr>
  </table>
{/if}

<style lang="scss">
  .run-encounter, .monster-holder {
    &.loadingApi:after {
      content: "Please Wait";
      color: white;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgb(126, 75, 75);
      opacity: 0.8;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .run-encounter {
    display: flex;
    position: relative;
    flex-direction: column;
    flex: 1;

    & > iframe {
      flex: 1;
    }

  }

  .monster-holder {
    position: fixed;
    bottom: 0px;
    left: 430px;
    font-size: 20px;
    color: white;
    width: auto;
    border: none;

    .encounter-actions button {
      padding: 5px;
      color: white;
      width: 100%;
      border-style: none;
      border: 1px solid #333;

      &.run {
        background:rgb(41, 99, 34)
      }

      &.cancel {
        background: rgb(143, 36, 36);
      }
    }

    .monster-row {
      .count {
        font-weight: bold;
        padding: 5px 10px;
        background: rgb(7, 58, 58);
        text-align: center;
      }

      .name {
        padding: 5px 20px;
        background: rgb(1, 7, 27);
      }

      .idb {
        display: flex;
      }

      button {
        flex: 1;
        color: white;
        padding: 5px 10px;
        border: 1px solid #333;
        border-style: none;

        &.inc {
          background: rgb(2, 53, 32)
        }

        &.dec {
          background: rgb(128, 81, 19)
        }
      }
    }
  }
</style>