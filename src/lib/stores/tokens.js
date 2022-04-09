import { activeMap } from "$lib/stores/maps"
import { derived } from "svelte/store"

export const tokens = derived(activeMap, $activeMap => $activeMap?.tokens ?? [])