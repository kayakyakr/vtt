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
  - Show DM map to DM, player map to players
4. Explored area opacity
  - DM selects by square
  - Player views only exposed square

### Stretch Features
- Exit VTT mode
- No-extension mode (off-site view of player map)
- Movable tokens
- PC details
- Player controlled tokens
- In-page video

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
  - Adventure - Chapter & Scroll
  - Map & Revealed tiles
  - *Tokens
  - *WebRTC

## Development
`> npm run dev`