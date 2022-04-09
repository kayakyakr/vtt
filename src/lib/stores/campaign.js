import { derived, get, writable } from "svelte/store";

export const campaignHolder = writable(null)

export const campaign = derived(campaignHolder, ($campaignHolder, set) => {
  if ($campaignHolder) {
    $campaignHolder.subscribe(sub => set(sub))
  }  
})