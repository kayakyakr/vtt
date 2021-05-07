import { gql } from '@apollo/client/core';

export const CAMPAIGN_SUBSCRIPTION = gql`
subscription campaign($id: Int!) {
  campaign_by_pk(id: $id) {
    id
    name
    maps {
      id
      name
      url
      player_url
    }
  }
}
`

export const CREATE_CAMPAIGN = gql`
mutation create_campaign($name: String, $id: Int) {
  insert_campaign(objects: {id: $id, name: $name}) {
    returning {
      id
      name
    }
  }
}
`

export const CREATE_MAP = gql`
mutation create_map ($campaign_id: Int, $name: String, $player_url: String, $url: String) {
  insert_maps_one(object: {campaign_id: $campaign_id, name: $name, player_url: $player_url, url: $url}) {
    id
    name
    player_url
    url
    campaign_id
  }
}
`