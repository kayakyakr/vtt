export const fetchAll = async () => {
  // get campaign list 
  const campaignResp = await fetch("https://www.dndbeyond.com/api/campaign/active-campaigns", { credentials: "include" })
  const { data } = await campaignResp.json()
  return data
}

export const fetchOne = async ({ campaignId } = {}) => {
  // (and filter to current campaign)
  if (!campaignId) campaignId = readCampaignID()
  const campaigns = await fetchAll()
  return campaigns.find(c => c.id === Number(campaignId))
}

export const readCampaignID = () => {
  return location.pathname.match(/(\d+)/)[1]
}
