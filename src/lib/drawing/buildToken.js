import * as PIXI from "pixi.js"

const DEFAULT_AVATAR = "https://www.dndbeyond.com/content/1-0-1860-0/skins/waterdeep/images/characters/default-avatar.png"

export const buildToken = ({ image_url, name, id, x, y }) => {
  const token = new PIXI.Container()
  token.id = id
  token.position.set(x, y)

  const sprite = new PIXI.Sprite.from(image_url || DEFAULT_AVATAR)
  sprite.height = 60
  sprite.width = 60
  sprite.x = 0
  sprite.y = 0

  token.addChild(sprite)

  const textBackground = PIXI.Sprite.from(PIXI.Texture.WHITE)
  textBackground.width = 60
  textBackground.height = 20
  textBackground.y = 60
  textBackground.tint = 0x000000
  token.addChild(textBackground)

  const label = new PIXI.Text(name, { fill: 0xFFFFFF })
  label.width = 56;
  label.height = 16;
  label.y = 62;
  label.x = 2;
  
  token.addChild(label)

  return token
}