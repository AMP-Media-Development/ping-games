using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem.UI;
using TMPro;

/// <summary>
/// SceneBuilder — One-click scene setup for your game.
///
/// Menu: Ping Games > Build Scene
///
/// Creates all required GameObjects:
/// - Main Camera
/// - PingBridge
/// - GameManager
/// - EventSystem (required for UI buttons)
/// - Canvas with panels
///
/// TODO: Customize for your game's scene requirements.
/// </summary>
public class SceneBuilder
{
    [MenuItem("Ping Games/Build Scene")]
    public static void BuildScene()
    {
        // Clear existing scene
        foreach (var go in Object.FindObjectsByType<GameObject>(FindObjectsSortMode.None))
        {
            Object.DestroyImmediate(go);
        }

        // Camera
        var cameraGo = new GameObject("Main Camera");
        var cam = cameraGo.AddComponent<Camera>();
        cam.orthographic = true;
        cam.orthographicSize = 5;
        cam.backgroundColor = new Color(0.04f, 0.04f, 0.06f); // #0a0a0f
        cam.clearFlags = CameraClearFlags.SolidColor;
        cameraGo.AddComponent<AudioListener>();
        cameraGo.tag = "MainCamera";

        // PingBridge (MUST be named "PingBridge")
        var bridgeGo = new GameObject("PingBridge");
        bridgeGo.AddComponent<PingBridge>();

        // GameManager
        var gmGo = new GameObject("GameManager");
        var gm = gmGo.AddComponent<GameManager>();

        // EventSystem (REQUIRED for UI buttons to work)
        var eventSystemGo = new GameObject("EventSystem");
        eventSystemGo.AddComponent<EventSystem>();
        eventSystemGo.AddComponent<InputSystemUIInputModule>();

        // Canvas
        var canvasGo = new GameObject("Canvas");
        var canvas = canvasGo.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvasGo.AddComponent<CanvasScaler>();
        canvasGo.AddComponent<GraphicRaycaster>();

        // TODO: Add your UI panels here
        // Example:
        // var waitingPanel = CreatePanel(canvasGo.transform, "WaitingPanel");
        // var gameOverPanel = CreatePanel(canvasGo.transform, "GameOverPanel");
        // gameOverPanel.SetActive(false);

        // UIManager
        var uiGo = new GameObject("UIManager");
        var ui = uiGo.AddComponent<UIManager>();
        // TODO: Wire up UI references
        // ui.waitingPanel = waitingPanel;
        // ui.gameOverPanel = gameOverPanel;
        // gm.ui = ui;

        Debug.Log("[SceneBuilder] Scene built! Save it to Assets/Scenes/GameScene.unity");
    }

    static GameObject CreatePanel(Transform parent, string name)
    {
        var panel = new GameObject(name);
        panel.transform.SetParent(parent, false);
        var rect = panel.AddComponent<RectTransform>();
        rect.anchorMin = Vector2.zero;
        rect.anchorMax = Vector2.one;
        rect.sizeDelta = Vector2.zero;
        return panel;
    }
}
