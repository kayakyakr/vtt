<script>
  import { setContext } from "svelte"
  import { setClient, subscribe, mutation } from "svelte-apollo"
  import { client } from '$lib/apolloClient';
  
  import { CAMPAIGN_SUBSCRIPTION, CREATE_CAMPAIGN } from "$lib/queries"
  import { readCampaignID } from "$lib/api/campaigns";
  
  import Source from "./_components/source.svelte"
  import Map from "./_components/map.svelte"
  import Encounter from "./_components/encounter.svelte"

  setClient(client)

  const campaignId = Number(readCampaignID())
  const campaign = subscribe(CAMPAIGN_SUBSCRIPTION, { variables: { id: campaignId }})
  setContext("campaign", campaign)

  $: {
    if (!$campaign.loading && !$campaign.data?.campaign_by_pk) {
      const createCampaign = mutation(CREATE_CAMPAIGN)
      createCampaign({ variables: { id: campaignId, name: document.querySelector('.page-title')?.textContent.trim() }})
    }
  }
</script>

<main class="tabletop">
  <section class="left-area">
    <Source />
    <Encounter />
  </section>
  <section class="main-area"><Map /></section>
  <section class="right-area"></section>
</main>

<style lang="scss">
  .tabletop {
    height: 100%;
    display: flex;

    .left-area {
      width: 430px;
      display: flex;
      flex-direction: column;
      justify-content: stretch;
      align-items: stretch;

      & > :global(*) {
        flex: 1;
      }
    }

    .main-area {
      background: black;
      flex: 1;
    }

    .right-area {
      display: none;
    }
  }
</style>