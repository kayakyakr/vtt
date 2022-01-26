# A VTT for D&D Beyond

## MVP Features

1. Display adventure in panel within campaign page
  - [x] Save adventure 
  - [x] last viewed location
  - [] maybe scroll location?
  - [] return to source selection
2. Create encounter from source
  -[x] Click Monster
  -[x] Create encounter via API
  -[x] Display encounter (collapse source)
  -[x] On End encounter (return to source)
  -[] Style encounter page to be compact
3. Display map from source
  - [x] Create map subscription
  - [] Show DM map to DM, player map to players
  - [] Close map
4. Explored area opacity
  - [] Draw grid
  - [] Cover unrevealed squares
  - [] DM reveals squares

### Stretch Features
- Exit VTT mode
- No-extension mode (off-site view of player map)
- In-page video
- Movable tokens
- PC quick-view for DM screen
- Player controlled tokens

## Architecture

### Content Scripts
- Main `/campaigns/[id]` no frames
- Adventure frame `/source/[id]/[chapter]`
- Encounter frame `/encounters/[id]`

### Messaging

frame -> worker -> main

### API Calls

- DDB:
  - Create Encounter
- GQL:
  - Campaign
  - Map & Revealed tiles
  - Adventure - Chapter & Scroll
  - *Tokens
  - *WebRTC

## Development
`> npm run dev`