# A VTT for D&D Beyond

## MVP Features

1. Display adventure in panel within campaign page
  - Save adventure, last viewed location, maybe scroll location?
2. Create encounter from source
  - Click Monster
  - Create encounter via API
  - Display encounter (collapse source)
  - On End encounter (return to source)
3. Display map from source
  - Show DM map to DM, player map to players
4. Explored area opacity
  - DM selects by square
  - Player views only exposed square

### Stretch Features
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