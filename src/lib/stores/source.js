import { derived } from "svelte/store"
import { campaign } from "$lib/stores/campaign"

export const sourceUrl = derived(campaign, $campaign => $campaign.data?.campaign_by_pk?.sourceUrl)