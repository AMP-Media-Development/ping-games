# Game Template

This is the starter template for building a Ping game. Copy this directory to `games/your-game-name/` and start building.

## What's Included

```
_template/
  Assets/
    Scripts/
      PingBridge.cs            <- DO NOT MODIFY (bridge to Ping host)
      GameManager.cs           <- YOUR game logic (edit this!)
      UIManager.cs             <- YOUR UI logic (edit this!)
    Plugins/WebGL/
      PingBridgePlugin.jslib   <- DO NOT MODIFY (JS interop)
    Editor/
      SceneBuilder.cs          <- One-click scene setup (customize!)
      WebGLBuilder.cs          <- Build automation
    WebGLTemplates/PingMinimal/
      index.html               <- Branded loading screen
    Scenes/                    <- Save your scene here
    Sprites/                   <- Your game art
  ProjectSettings/
    ProjectSettings.asset      <- Pre-configured for WebGL
```

## Getting Started

1. Copy this folder: `cp -r _template games/my-game`
2. Open `games/my-game` as a Unity project
3. Run **Ping Games > Build Scene** to set up the scene
4. Edit `GameManager.cs` — follow the TODOs
5. Edit `UIManager.cs` for your UI
6. Test in Editor (PingBridge auto-simulates init)
7. Build WebGL: **Ping Games > Build WebGL**

## Key Rules

- **DO NOT** modify `PingBridge.cs` or `PingBridgePlugin.jslib`
- **DO** call `SendStateUpdate()` for all state changes
- **DO** call `SendAction()` only for notable events
- **DO** handle `OnBridgeInit()` with existing state (rejoin)
- **DO** include an EventSystem in your scene

See the [Developer Guide](../DEVELOPER_GUIDE.md) for full details.
