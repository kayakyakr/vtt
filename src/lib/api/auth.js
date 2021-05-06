// Retrived an API token for the encounter-builder microservice
export const fetchOne = async () => {
  const authResp = await fetch("https://auth-service.dndbeyond.com/v1/cobalt-token", {
    method: "POST",
    credentials: "include"
  })
  return  authResp.json()
}