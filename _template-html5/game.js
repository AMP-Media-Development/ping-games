/**
 * Game Template — Your game logic goes here.
 *
 * PingBridge is loaded before this script.
 * See the Developer Guide for the full protocol.
 */

// TODO: Your game state class
var gameState = {
    phase: "idle",
    host: null,
    challenger: null,
    score: 0,
    timestamp: 0
};

var localPlayerId = null;
var gameId = null;

// ---- PingBridge callbacks ----

PingBridge.onInit = function (userId, gId, roomId, existingState) {
    localPlayerId = userId;
    gameId = gId;
    console.log("[Game] Init:", userId, gId);

    if (existingState && existingState.phase) {
        // Rejoin: restore state from existing game
        gameState = existingState;
        // TODO: Update your UI to reflect the restored state
        console.log("[Game] Rejoining existing game");
    } else {
        // New game: show lobby or waiting screen
        gameState.host = userId;
        gameState.phase = "waiting";
        gameState.timestamp = Date.now();
        // TODO: Show your waiting/lobby UI
        console.log("[Game] New game — I am the host");
    }
};

PingBridge.onStateSync = function (state) {
    console.log("[Game] StateSync:", state);
    gameState = state;
    // TODO: Update your UI to reflect the remote state
};

// ---- Game logic ----

// TODO: Implement your game!
//
// Key patterns:
//
// 1. Send state when something changes:
//    PingBridge.sendStateUpdate(gameState);
//
// 2. Send action for chat-visible events:
//    PingBridge.sendAction("game_over", { winner: localPlayerId, score: 42 });
//
// 3. Render on canvas:
//    var canvas = document.getElementById("game-canvas");
//    var ctx = canvas.getContext("2d");

// Signal ready
PingBridge.sendReady();
