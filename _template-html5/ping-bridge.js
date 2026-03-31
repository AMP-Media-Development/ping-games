/**
 * PingBridge for HTML5 games — postMessage protocol.
 *
 * DO NOT MODIFY THIS FILE. It must match the canonical version in _template-html5/.
 * CI will reject PRs where this file differs from the template.
 *
 * This bridge handles communication between your HTML5 game and the Ping host
 * (PingGameBridge.tsx) via window.postMessage.
 *
 * Usage:
 *   PingBridge.onInit = function(userId, gameId, roomId, state) { ... };
 *   PingBridge.onStateSync = function(state) { ... };
 *   PingBridge.sendReady();
 *   PingBridge.sendStateUpdate(stateObject);
 *   PingBridge.sendAction("game_over", { winner: "Player 1" });
 */
(function () {
    "use strict";

    var PingBridge = {
        /** @type {function(string, string, string, object|null): void} */
        onInit: null,

        /** @type {function(object): void} */
        onStateSync: null,

        /**
         * Signal to the host that the game is loaded and ready for init data.
         * Call this once your game has finished loading.
         */
        sendReady: function () {
            window.parent.postMessage({ type: "PING_GAME_READY" }, "*");
        },

        /**
         * Send a state update to all players via Ping state sync.
         * @param {object} state - Complete game state snapshot (must be under 64KB)
         */
        sendStateUpdate: function (state) {
            window.parent.postMessage({
                type: "PING_GAME_STATE_UPDATE",
                payload: state
            }, "*");
        },

        /**
         * Post an action to the chat timeline (appears as a message card).
         * Use only for notable events: game_invite, game_started, game_over, restart.
         * @param {string} action - Action name
         * @param {object} payload - Action data
         */
        sendAction: function (action, payload) {
            window.parent.postMessage({
                type: "PING_GAME_ACTION",
                action: action,
                payload: payload
            }, "*");
        }
    };

    // Listen for messages from the Ping host
    window.addEventListener("message", function (event) {
        var data = event.data;
        if (!data || typeof data !== "object") return;

        if (data.type === "PING_GAME_INIT" && PingBridge.onInit) {
            var p = data.payload || {};
            PingBridge.onInit(p.userId || "", p.gameId || "", p.roomId || "", p.state || null);
        }

        if (data.type === "PING_GAME_STATE_SYNC" && PingBridge.onStateSync) {
            PingBridge.onStateSync(data.payload || {});
        }
    });

    // Expose globally
    window.PingBridge = PingBridge;

    // Auto-simulate init in standalone mode (not in iframe)
    if (window === window.parent) {
        console.log("[PingBridge] Standalone mode — simulating init in 200ms");
        setTimeout(function () {
            if (PingBridge.onInit) {
                PingBridge.onInit("standalone-user", "standalone-test", "!standalone:localhost", null);
            }
        }, 200);
    }
})();
