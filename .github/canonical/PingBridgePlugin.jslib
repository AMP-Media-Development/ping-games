/*
 * PingBridgePlugin.jslib — JavaScript interop for Unity WebGL ↔ react-unity-webgl.
 *
 * DO NOT MODIFY THIS FILE. It must match the canonical version in _template/.
 * CI will reject PRs where this file differs from the template.
 *
 * react-unity-webgl listens for these events via addEventListener().
 * The host calls SendMessage("PingBridge", "OnInit"/"OnStateSync", json)
 * to push data into Unity.
 */
mergeInto(LibraryManager.library, {
    SendGameReady: function () {
        try {
            if (typeof window.dispatchReactUnityEvent === "function") {
                window.dispatchReactUnityEvent("GameReady");
            }
        } catch (e) {
            console.warn("[PingBridgePlugin] SendGameReady error:", e);
        }
    },

    SendGameStateUpdate: function (jsonPtr) {
        try {
            var json = UTF8ToString(jsonPtr);
            if (typeof window.dispatchReactUnityEvent === "function") {
                window.dispatchReactUnityEvent("GameStateUpdate", json);
            }
        } catch (e) {
            console.warn("[PingBridgePlugin] SendGameStateUpdate error:", e);
        }
    },

    SendGameAction: function (jsonPtr) {
        try {
            var json = UTF8ToString(jsonPtr);
            if (typeof window.dispatchReactUnityEvent === "function") {
                window.dispatchReactUnityEvent("GameAction", json);
            }
        } catch (e) {
            console.warn("[PingBridgePlugin] SendGameAction error:", e);
        }
    }
});
