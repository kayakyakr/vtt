const monsterUrl = (imageIds) => {
  const reqUrl = new URL("https://monster-service.dndbeyond.com/v1/Monster")
  const params = { ids: imageIds }
  reqUrl.search = new URLSearchParams(params).toString()
  return reqUrl
}

export const getMonsterImages = async (imageIds) => {
  const monsterResp = await fetch(monsterUrl(imageIds), { credentials: "include" })
  const { data: monsters } = await monsterResp.json()
  const monsterImages = {}
  monsters.forEach(m => monsterImages[m.id] = m.avatarUrl)
  return monsterImages
}