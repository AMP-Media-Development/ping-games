# Flip A Coin

A multiplayer coin flip game. Settle decisions with a coin toss!

## How to Play

1. Choose **Heads** or **Tails**
2. Your opponent sees the challenge in chat and picks their side
3. The coin flips and the winner is revealed

## Controls

- Click **Heads** or **Tails** button
- Click **Play Again** to start a new round

## Tech

- **Type:** HTML5 Canvas (no Unity required)
- **Rendering:** 60fps Canvas 2D with requestAnimationFrame
- **Bridge:** PingBridge postMessage protocol (`ping-bridge.js`)
- **Assets:** Fully procedural (no external images or audio)

## Files

```
coinflip/
  index.html      <- Entry point
  ping-bridge.js  <- PingBridge (DO NOT MODIFY)
  game.js         <- Game logic + canvas renderer
  game.css        <- Styles
```

## State

```json
{
  "game_id": "uuid",
  "phase": "idle | waiting | finished",
  "challenger": "@alice:matrix.ping.live",
  "challenger_choice": "heads",
  "challenged": "@bob:matrix.ping.live",
  "challenged_choice": "tails",
  "result": "heads",
  "winner": "@alice:matrix.ping.live",
  "timestamp": 1711900000000
}
```

## Timeline Actions

| Action | When |
|--------|------|
| `game_invite` | Challenger picks a side |
| `game_over` | Coin lands, winner determined |
