import { derived } from "svelte/store"
import { campaign } from "$lib/stores/campaign"

export const encounterId = derived(campaign, $campaign => $campaign.data?.campaign_by_pk?.encounterId)