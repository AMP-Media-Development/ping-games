using UnityEngine;

/// <summary>
/// PingBridge — Communicates with the Ping web host (react-unity-webgl).
///
/// DO NOT MODIFY THIS FILE. It must match the canonical version in _template/.
/// CI will reject PRs where this file differs from the template.
///
/// Host → Unity:
///   SendMessage("PingBridge", "OnInit", jsonString)
///   SendMessage("PingBridge", "OnStateSync", jsonString)
///
/// Unity → Host:
///   GameReady event (on Start)
///   GameStateUpdate event (state changes)
///   GameAction event (game milestones: game_over, score, etc.)
///
/// This GameObject MUST be named "PingBridge" in the scene hierarchy.
/// </summary>
public class PingBridge : MonoBehaviour
{
    public static PingBridge Instance { get; private set; }

    void Awake()
    {
        if (Instance != null && Instance != this) { Destroy(gameObject); return; }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    void Start()
    {
        SendReady();
    }

    // ---- Incoming from Host ----

    private bool _initialized;

    /// <summary>
    /// Called by react-unity-webgl: SendMessage("PingBridge", "OnInit", json)
    /// Payload: { "userId": "...", "gameId": "...", "roomId": "...", "state": "..." }
    /// </summary>
    public void OnInit(string json)
    {
        if (_initialized)
        {
            Debug.Log("[PingBridge] OnInit ignored — already initialized");
            return;
        }
        _initialized = true;

        Debug.Log($"[PingBridge] OnInit: {json}");
        var init = JsonUtility.FromJson<BridgeInit>(json);
        if (init != null)
        {
            GameManager.Instance?.OnBridgeInit(
                init.userId ?? "",
                init.gameId ?? "",
                init.roomId ?? "",
                init.state ?? ""
            );
        }
    }

    /// <summary>
    /// Called by react-unity-webgl: SendMessage("PingBridge", "OnStateSync", json)
    /// </summary>
    public void OnStateSync(string json)
    {
        GameManager.Instance?.OnStateSync(json);
    }

    // ---- Outgoing to Host ----

    public void SendReady()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        PingBridgePlugin.SendGameReady();
#else
        Debug.Log("[PingBridge] GameReady (editor mode — no host)");
        Invoke(nameof(SimulateInit), 0.2f);
#endif
    }

    /// <summary>
    /// Send a state update to all players via Ping state sync.
    /// Pass any serializable object — it will be JSON-serialized.
    /// </summary>
    public void SendStateUpdate<T>(T state)
    {
        string json = JsonUtility.ToJson(state);
#if UNITY_WEBGL && !UNITY_EDITOR
        PingBridgePlugin.SendGameStateUpdate(json);
#else
        Debug.Log($"[PingBridge] StateUpdate: {json}");
#endif
    }

    /// <summary>
    /// Post an action to the chat timeline (appears as a message card).
    /// Use only for notable events: game_invite, game_started, game_over, restart.
    /// </summary>
    public void SendAction(string action, string payloadJson)
    {
        string json = $"{{\"action\":\"{action}\",\"payload\":{payloadJson}}}";
#if UNITY_WEBGL && !UNITY_EDITOR
        PingBridgePlugin.SendGameAction(json);
#else
        Debug.Log($"[PingBridge] Action: {json}");
#endif
    }

    // ---- Editor simulation ----

    void SimulateInit()
    {
        OnInit("{\"userId\":\"editor-user\",\"gameId\":\"editor-test\",\"roomId\":\"!editor:localhost\",\"state\":\"\"}");
    }
}

[System.Serializable]
public class BridgeInit
{
    public string userId;
    public string gameId;
    public string roomId;
    public string state;
}
