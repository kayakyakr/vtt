import { derived } from "svelte/store"
import { campaign } from "$lib/stores/campaign"

export const maps = derived(campaign, $campaign => $campaign.data?.campaign_by_pk?.maps ?? [])
export const activeMap = derived(maps, $maps => $maps.find(m => m.active) ?? $maps[0])