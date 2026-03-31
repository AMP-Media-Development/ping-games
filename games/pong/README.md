# Pong

Classic Pong — multiplayer via Ping with WebRTC peer-to-peer real-time sync.

## Controls

- **W/S** or **Arrow Up/Down** — move paddle
- First to 5 wins

## Modes

- **Multiplayer** — challenge another player in the room
- **vs AI** — play against the computer

## Multiplayer Architecture

- **Real-time sync**: WebRTC data channel (P2P, ~5-30ms latency, 30Hz)
- **Fallback**: Matrix timeline events (10Hz) when WebRTC can't connect
- **Host authority**: Host player simulates ball physics, guest uses client-side prediction with smooth correction
- **Signaling**: SDP offer/answer exchanged via Matrix timeline events (one-time setup)

## Build

The WebGL build should be placed in `Build/` after building from the Unity project at `ping-unity-games/Ping-Games-PONG/`.

1. Open the Pong Unity project
2. Run **Ping Games > Build Pong Scene**
3. Run **Ping Games > Build WebGL**
4. Copy the `Build/` directory here
