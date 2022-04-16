const monsterUrl = (monsterIds) => {
  const reqUrl = new URL("https://monster-service.dndbeyond.com/v1/Monster")
  reqUrl.search = monsterIds.map(id => `ids=${id}`).join('&')
  return reqUrl
}

export const getMonsterDetails = async (monsterIds) => {
  const monsterResp = await fetch(monsterUrl(monsterIds), { credentials: "include" })
  const { data: monsters } = await monsterResp.json()
  const monsterDetails = {}
  monsters.forEach(m => monsterDetails[m.id] = m)
  return monsterDetails
}