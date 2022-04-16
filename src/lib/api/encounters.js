import { fetchOne as fetchAuth } from "./auth"

export const fetchOne = async ({ id }) => {
  const { token } = await fetchAuth()
  
  const resp = await fetch(`https://encounter-service.dndbeyond.com/v1/encounters/${id}`, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    }
  })

  const { data } = await resp.json()
  return data
}

const encodeMonster = (m) => {
  if (m.uuid) {
    return { groupId: m.uuid, id: m.id, order: 1, quantity: m.count, initiative: 0 }
  }
  return m
}

export const create = async ({ monsters, campaign, players }) => {
  const { token } = await fetchAuth()

  const resp = await fetch("https://encounter-service.dndbeyond.com/v1/encounters", {
    method: "POST",
    body: JSON.stringify({
      campaign,
      groups: monsters.map((m, i) => ({ id: m.uuid, name: "", order: i + 1 })),
      monsters: monsters.map((m) => (encodeMonster(m))),
      players,
    }),
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    }
  })

  const { data } = await resp.json()
  return data
}

export const update = async ({ id, monsters, inProgress = false, roundNum = 0, turnNum = 1 }) => {
  const { token } = await fetchAuth()
  
  const resp = await fetch(`https://encounter-service.dndbeyond.com/v1/encounters/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      inProgress,
      groups: monsters.map((m, i) => ({ id: m.groupId ?? m.uuid, name: "", order: i + 1 })),
      monsters: monsters.map((m) => (encodeMonster(m))),
      roundNum,
      turnNum
    }),
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    }
  })

  const { data } = await resp.json()
  return data
}

export const destroy = async ({ encounterId }) => {
  const { token } = await fetchAuth()
  await fetch(`https://encounter-service.dndbeyond.com/v1/encounters/${encounterId}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    }
  })
}