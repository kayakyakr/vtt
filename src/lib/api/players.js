import { readCampaignID } from "./campaigns"

export const fetchAll = async ({ campaignId } = {}) => {
  if (!campaignId) campaignId = readCampaignID()
  // get player list
  const playerResp = await fetch(`https://www.dndbeyond.com/api/campaign/active-characters/${campaignId}`, { credentials: "include" })
  const { data: players } = await playerResp.json()
  players.forEach(p => p.count = 1)
  return players
}

export const isPlayer = ({ campaignId }) => {
  return !document.querySelector(`a[href='/campaigns/${campaignId}/edit']`)
}