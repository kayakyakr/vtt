<script>
  import { onMount, setContext } from "svelte"
  import { setClient, subscribe, mutation } from "svelte-apollo"
  import { client } from '$lib/apolloClient';
  
  import { CAMPAIGN_SUBSCRIPTION, CREATE_CAMPAIGN } from "$lib/queries"
  import { readCampaignID } from "$lib/api/campaigns";
  import { campaign, campaignHolder } from "$lib/stores/campaign"
  import { isPlayer, fetchAll as fetchPlayers } from "$lib/api/players";
  import { players } from "$lib/stores/players";
  
  import Source from "./_components/source.svelte"
  import Map from "./_components/map.svelte"
  import Encounter from "./_components/encounter.svelte"
  import Character from "./_components/character.svelte";

  setClient(client)

  const campaignId = Number(readCampaignID())
  campaignHolder.set(subscribe(CAMPAIGN_SUBSCRIPTION, { variables: { id: campaignId }}))
  const iAmPlayer = isPlayer({ campaignId })
  setContext("isPlayer", iAmPlayer)

  onMount(async () => $players = await fetchPlayers())

  $: {
    if (!$campaign.loading && !$campaign.data?.campaign_by_pk) {
      const createCampaign = mutation(CREATE_CAMPAIGN)
      createCampaign({ variables: { id: campaignId, name: document.querySelector('.page-title')?.textContent.trim() }}).then(
        () => campaignHolder.set(subscribe(CAMPAIGN_SUBSCRIPTION, { variables: { id: campaignId }}))
      )
    }
  }
</script>

<main class="tabletop">
  <section class="left-area">
    {#if iAmPlayer}
      <Character />
    {:else}
      <Source />
    {/if}
  </section>
  <section class="main-area">
    {#if !$campaign.loading}<Map />{/if}
    <Encounter />
  </section>
  <section class="right-area"></section>
</main>

<style lang="scss">
  .tabletop {
    height: 100%;
    display: flex;

    .left-area {
      width: 500px;
      display: flex;
      flex-direction: column;
      justify-content: stretch;
      align-items: stretch;

      & > :global(*) {
        flex: 1;
      }
    }

    .main-area {
      display: flex;
      flex-direction: column;
      background: black;
      flex: 1;
    }

    .right-area {
      display: none;
    }
  }
</style>