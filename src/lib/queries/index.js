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
      active
      tokens {
        id
        name
        image_url
        x
        y
      }
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
mutation create_map ($campaign_id: Int, $name: String, $player_url: String, $url: String, $tokens: [tokens_insert_input!]!) {
  update_maps( where: { campaign_id: { _eq: $campaign_id } }, _set: { active: false }) {
    returning { id }
  }
  insert_maps_one(object: {
    campaign_id: $campaign_id, 
    name: $name, 
    player_url: $player_url, 
    url: $url,
    tokens: { data: $tokens }
  }) {
    id
    name
    player_url
    url
    campaign_id
    tokens {
      id
      name
      image_url
      x
      y
    }
  }
}
`

export const ACTIVATE_MAP = gql`
  mutation activate_map ($campaign_id: Int!, $id: Int!) {
    update_maps(where: {campaign_id: {_eq: $campaign_id}}, _set: { active: false }) {
      returning { id }
    }
    update_maps_by_pk(pk_columns: { id: $id }, _set: { active: true }) {
      id
    }
  }
`

export const DELETE_MAP = gql`
  mutation delete_map ($id: Int!) {
    delete_maps_by_pk(id: $id) {
      id
    }
  }
`

export const UPDATE_TOKEN = gql`
  mutation update_token ($id: Int!, $x: float8, $y: float8) {
    update_tokens_by_pk(pk_columns: { id: $id }, _set: { x: $x, y: $y }) {
      id
      x
      y
    }
  }
`