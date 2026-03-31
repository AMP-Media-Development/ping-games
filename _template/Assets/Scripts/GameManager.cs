using UnityEngine;

/// <summary>
/// GameManager — Template for your game logic.
///
/// TODO: Rename this class if you want, but keep the same method signatures
/// that PingBridge calls: OnBridgeInit() and OnStateSync().
///
/// See the Developer Guide for the full PingBridge protocol.
/// </summary>
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    // TODO: Add your UI manager reference
    // public UIManager ui;

    // TODO: Define your game state class
    // [System.Serializable]
    // public class MyGameState
    // {
    //     public string host;
    //     public string challenger;
    //     public string phase; // "waiting", "playing", "game_over"
    //     public int score;
    //     public long timestamp;
    // }

    private string _localPlayerId;
    private string _gameId;
    private bool _isHost;

    void Awake()
    {
        if (Instance != null) { Destroy(gameObject); return; }
        Instance = this;
    }

    // ---- PingBridge callbacks ----

    /// <summary>
    /// Called when the host sends init data.
    /// If stateJson is non-empty, another player is already in the room (rejoin).
    /// </summary>
    public void OnBridgeInit(string userId, string gameId, string roomId, string stateJson)
    {
        _localPlayerId = userId;
        _gameId = gameId;

        Debug.Log($"[GameManager] Init: userId={userId}, gameId={gameId}");

        if (!string.IsNullOrEmpty(stateJson) && stateJson != "{}")
        {
            // TODO: Rejoin — restore state from existing game
            // var state = JsonUtility.FromJson<MyGameState>(stateJson);
            // RestoreGame(state);
            Debug.Log("[GameManager] Rejoin with existing state");
        }
        else
        {
            // New game — show lobby or waiting screen
            _isHost = true;
            Debug.Log("[GameManager] New game — I am the host");

            // TODO: Show your waiting/lobby UI
            // ui.ShowWaiting();

            // TODO: Send invite to chat timeline
            // PingBridge.Instance?.SendAction("game_invite",
            //     $"{{\"player\":\"{_localPlayerId}\",\"gameId\":\"{_gameId}\"}}");
        }
    }

    /// <summary>
    /// Called when another player updates the game state.
    /// </summary>
    public void OnStateSync(string stateJson)
    {
        Debug.Log($"[GameManager] StateSync: {stateJson}");

        // TODO: Parse and apply the remote state
        // var state = JsonUtility.FromJson<MyGameState>(stateJson);
        // ApplyRemoteState(state);
    }

    // ---- Your game logic ----

    // TODO: Implement your game!
    //
    // Key patterns:
    //
    // 1. Send state when something changes:
    //    PingBridge.Instance?.SendStateUpdate(BuildCurrentState());
    //
    // 2. Send action for chat-visible events:
    //    PingBridge.Instance?.SendAction("game_over",
    //        $"{{\"winner\":\"{winnerId}\",\"score\":{score}}}");
    //
    // 3. Handle AI mode (single player):
    //    public void StartSinglePlayer() { /* start vs AI */ }
    //
    // 4. Handle restart:
    //    public void RestartGame() { /* reset and optionally re-sync */ }
}
