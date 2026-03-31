/**
 * Flip A Coin — Multiplayer coin flip game for Ping.
 *
 * Canvas-rendered coin with 60fps animation.
 * Uses PingBridge (postMessage) for Ping state sync.
 */

// ---- Constants ----

var GOLD_LIGHT  = "#FFD700";
var GOLD_MID    = "#FFC107";
var GOLD_DARK   = "#B8860B";
var GOLD_DARKER = "#8B6914";
var GOLD_PALE   = "#FFE4B5";
var PARTICLE_COLORS = [GOLD_LIGHT, GOLD_MID, "#0DBD8B", "#7B61FF", "#FF6B6B", GOLD_PALE];
var FLIP_DURATION = 2500;
var FLIP_ROTATIONS = 10;
var IDLE_PULSE_PERIOD = 3000;
var RESULT_BOUNCE_DURATION = 600;

// ---- State ----

var localPlayerId = null;
var localGameId = null;
var gameState = null;
var myChoice = null;
var isFlippingLocally = false;

// ---- Canvas renderer ----

var canvas, ctx, dpr, canvasW, canvasH;
var animId = null;
var coinPhase = "idle";
var resultSide = "heads";
var flipStartTime = 0;
var resultStartTime = 0;
var startTime = 0;
var particles = [];
var bgColor = "#f8f9fa";

function initCanvas() {
    canvas = document.getElementById("coin-canvas");
    ctx = canvas.getContext("2d", { alpha: false });
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    startTime = performance.now();
    resizeCanvas();
}

function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    canvasW = rect.width * dpr;
    canvasH = rect.height * dpr;
    canvas.width = canvasW;
    canvas.height = canvasH;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function startRenderLoop() {
    if (animId !== null) return;
    function loop(time) {
        resizeCanvas();
        render(time);
        animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
}

// ---- Rendering ----

function render(time) {
    var w = canvasW / dpr;
    var h = canvasH / dpr;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    var cx = w / 2;
    var cy = h / 2;
    var baseRadius = Math.min(w, h) * 0.22;

    if (coinPhase === "idle") renderIdleCoin(cx, cy, baseRadius, time);
    else if (coinPhase === "flipping") renderFlippingCoin(cx, cy, baseRadius, time);
    else if (coinPhase === "result") renderResultCoin(cx, cy, baseRadius, time);

    renderParticles();
}

function renderIdleCoin(cx, cy, radius, time) {
    var t = ((time - startTime) % IDLE_PULSE_PERIOD) / IDLE_PULSE_PERIOD;
    var pulseAlpha = 0.15 + 0.12 * Math.sin(t * Math.PI * 2);
    ctx.save();
    ctx.shadowColor = "rgba(255,193,7," + pulseAlpha + ")";
    ctx.shadowBlur = 20;
    drawCoinFace(cx, cy, radius, "icon");
    ctx.restore();
}

function renderFlippingCoin(cx, cy, radius, time) {
    var elapsed = time - flipStartTime;
    var progress = Math.min(elapsed / FLIP_DURATION, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var angle = eased * FLIP_ROTATIONS * Math.PI * 2;
    var scaleX = Math.cos(angle);
    var absScale = Math.abs(scaleX);
    var bounceProgress = Math.min(progress / 0.4, 1);
    var bounce = Math.sin(bounceProgress * Math.PI) * radius * 0.4 * (1 - progress * 0.7);
    var showHeads = scaleX >= 0;

    ctx.save();
    ctx.translate(cx, cy - bounce);
    ctx.scale(absScale < 0.05 ? 0.05 : absScale, 1);
    var sizeScale = 1 + 0.15 * Math.sin(progress * Math.PI);
    drawCoinFace(0, 0, radius * sizeScale, showHeads ? "heads" : "tails");
    ctx.restore();

    if (progress >= 1 && coinPhase === "flipping") {
        onFlipAnimationComplete();
    }
}

function renderResultCoin(cx, cy, radius, time) {
    var elapsed = time - resultStartTime;
    var progress = Math.min(elapsed / RESULT_BOUNCE_DURATION, 1);
    var scale;
    if (progress < 0.5) scale = 0.3 + 1.4 * progress;
    else if (progress < 0.7) { var p = (progress - 0.5) / 0.2; scale = 1.0 + 0.15 * (1 - p); }
    else { var p2 = (progress - 0.7) / 0.3; scale = 1.0 - 0.05 * Math.sin(p2 * Math.PI); }

    var opacity = Math.min(progress * 4, 1);
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.shadowColor = "rgba(255,193,7,0.3)";
    ctx.shadowBlur = 16;
    drawCoinFace(0, 0, radius, resultSide);
    ctx.restore();
}

// ---- Coin drawing ----

function drawCoinFace(cx, cy, radius, face) {
    var grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
    grad.addColorStop(0, GOLD_LIGHT); grad.addColorStop(0.5, GOLD_MID); grad.addColorStop(1, GOLD_DARK);
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, radius * 0.91, 0, Math.PI * 2); ctx.strokeStyle = GOLD_DARK; ctx.lineWidth = 1.5; ctx.stroke();

    var savedAlpha = ctx.globalAlpha;
    ctx.beginPath(); ctx.arc(cx, cy, radius * 0.83, 0, Math.PI * 2); ctx.strokeStyle = GOLD_PALE; ctx.lineWidth = 0.8; ctx.globalAlpha = savedAlpha * 0.6; ctx.stroke();
    ctx.globalAlpha = savedAlpha;

    var shineGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
    shineGrad.addColorStop(0, "rgba(255,255,255,0.35)"); shineGrad.addColorStop(0.5, "rgba(255,255,255,0.05)"); shineGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fillStyle = shineGrad; ctx.fill();

    if (face === "heads") { drawCrown(cx, cy, radius); drawLabel(cx, cy + radius * 0.7, "HEADS", radius); }
    else if (face === "tails") { drawEagle(cx, cy, radius); drawLabel(cx, cy + radius * 0.7, "TAILS", radius); }
    else { ctx.font = "bold " + (radius * 0.55) + "px -apple-system, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = GOLD_DARKER; ctx.fillText("?", cx, cy + radius * 0.02); }
}

function drawCrown(cx, cy, radius) {
    var s = radius / 46;
    ctx.save(); ctx.translate(cx, cy - radius * 0.04);
    ctx.beginPath(); ctx.moveTo(-20*s,5*s); ctx.lineTo(-15*s,-15*s); ctx.lineTo(-8*s,-5*s); ctx.lineTo(0,-20*s); ctx.lineTo(8*s,-5*s); ctx.lineTo(15*s,-15*s); ctx.lineTo(20*s,5*s); ctx.closePath();
    ctx.fillStyle = GOLD_DARK; ctx.strokeStyle = GOLD_DARKER; ctx.lineWidth = 0.8*s; ctx.fill(); ctx.stroke();
    var jewels = [[-15,-15],[0,-20],[15,-15]];
    for (var i = 0; i < jewels.length; i++) { ctx.beginPath(); ctx.arc(jewels[i][0]*s, jewels[i][1]*s, 3*s, 0, Math.PI*2); ctx.fillStyle = GOLD_PALE; ctx.fill(); }
    ctx.fillStyle = GOLD_DARK; ctx.strokeStyle = GOLD_DARKER; ctx.fillRect(-20*s,5*s,40*s,8*s); ctx.strokeRect(-20*s,5*s,40*s,8*s);
    ctx.restore();
}

function drawEagle(cx, cy, radius) {
    var s = radius / 46;
    ctx.save(); ctx.translate(cx, cy - radius * 0.1);
    ctx.beginPath(); ctx.moveTo(0,-15*s);
    ctx.bezierCurveTo(-5*s,-18*s,-15*s,-15*s,-20*s,-5*s); ctx.bezierCurveTo(-18*s,-8*s,-10*s,-10*s,-5*s,-8*s);
    ctx.lineTo(-8*s,0); ctx.bezierCurveTo(-12*s,5*s,-15*s,10*s,-10*s,15*s);
    ctx.lineTo(0,8*s); ctx.lineTo(10*s,15*s);
    ctx.bezierCurveTo(15*s,10*s,12*s,5*s,8*s,0); ctx.lineTo(5*s,-8*s);
    ctx.bezierCurveTo(10*s,-10*s,18*s,-8*s,20*s,-5*s); ctx.bezierCurveTo(15*s,-15*s,5*s,-18*s,0,-15*s);
    ctx.closePath(); ctx.fillStyle = GOLD_DARK; ctx.strokeStyle = GOLD_DARKER; ctx.lineWidth = 0.8*s; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0,-10*s,2*s,0,Math.PI*2); ctx.fillStyle = GOLD_DARKER; ctx.fill();
    ctx.restore();
}

function drawLabel(cx, cy, text, radius) {
    ctx.font = "bold " + (radius * 0.2) + "px -apple-system, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = GOLD_DARKER; ctx.fillText(text, cx, cy);
}

// ---- Particles ----

function createParticles(cx, cy, count) {
    particles = [];
    for (var i = 0; i < count; i++) {
        var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        var speed = 2 + Math.random() * 4;
        particles.push({ x: cx, y: cy - 20, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed - 3, size: 3 + Math.random()*5, color: PARTICLE_COLORS[Math.floor(Math.random()*PARTICLE_COLORS.length)], life: 0, maxLife: 1500 + Math.random()*1000, rotation: Math.random()*Math.PI*2, rotationSpeed: (Math.random()-0.5)*0.2 });
    }
}

function renderParticles() {
    if (particles.length === 0) return;
    var alive = [];
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.life += 16; if (p.life >= p.maxLife) continue;
        p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.rotation += p.rotationSpeed;
        var alpha = 1 - p.life / p.maxLife;
        ctx.save(); ctx.globalAlpha = alpha; ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
        alive.push(p);
    }
    particles = alive;
}

// ---- Coin animation triggers ----

function flipCoin() {
    coinPhase = "flipping";
    flipStartTime = performance.now();
}

function showCoinResult(side, didWin) {
    coinPhase = "result";
    resultSide = side;
    resultStartTime = performance.now();
    if (didWin) {
        var w = canvasW / dpr;
        var h = canvasH / dpr;
        createParticles(w / 2, h / 2, 35);
    }
}

function resetCoin() {
    coinPhase = "idle";
    particles = [];
}

// ---- DOM helpers ----

function $(id) { return document.getElementById(id); }
function showEl(id) { $(id).classList.remove("hidden"); }
function hideEl(id) { $(id).classList.add("hidden"); }
function setStatus(html) { $("status-text").innerHTML = html; }

function updateUI() {
    var phase = gameState ? gameState.phase : "idle";
    var isChallenger = gameState && gameState.challenger === localPlayerId;
    var isParticipant = gameState && (gameState.challenger === localPlayerId || gameState.challenged === localPlayerId);
    var isWinner = gameState && gameState.winner === localPlayerId;

    hideEl("choices"); hideEl("waiting-container"); hideEl("result-container");

    if (phase === "idle") {
        setStatus("Choose heads or tails to start!");
        showEl("choices");
        resetCoin();
    } else if (phase === "waiting") {
        if (isChallenger) {
            setStatus("You chose <strong>" + gameState.challenger_choice + "</strong>. Waiting for opponent...");
            showEl("waiting-container");
        } else {
            setStatus("Someone started a coin flip! Choose your side:");
            showEl("choices");
        }
    } else if (phase === "flipping" || isFlippingLocally) {
        setStatus('<span class="flipping-text">Flipping the coin...</span>');
    } else if (phase === "finished" && !isFlippingLocally && gameState.result) {
        setStatus("The coin landed on <strong>" + gameState.result + "</strong>!");
        showEl("result-container");

        var banner = $("result-banner");
        var summary = $("choices-summary");
        var btn = $("play-again-btn");

        if (isParticipant) {
            banner.textContent = isWinner ? "\uD83C\uDF89 You Won!" : "You Lost";
            banner.className = isWinner ? "banner-won" : "banner-lost";
            var myC = isChallenger ? gameState.challenger_choice : gameState.challenged_choice;
            var oppC = isChallenger ? gameState.challenged_choice : gameState.challenger_choice;
            summary.innerHTML = "Your choice: <strong>" + myC + "</strong><br>Opponent: <strong>" + oppC + "</strong>";
            btn.textContent = "Play Again";
        } else {
            banner.textContent = "Game Complete";
            banner.className = "banner-lost";
            summary.textContent = "";
            btn.textContent = "Start New Game";
        }
    }
}

// ---- Game actions ----

function chooseHeadsOrTails(choice) {
    myChoice = choice;

    if (!gameState || !gameState.challenger) {
        gameState = {
            game_id: localGameId,
            phase: "waiting",
            challenger: localPlayerId,
            challenger_choice: choice,
            timestamp: Date.now()
        };
        PingBridge.sendStateUpdate(gameState);
        PingBridge.sendAction("game_invite", {
            player: localPlayerId,
            gameId: localGameId,
            challenger_choice: choice
        });
        updateUI();
    } else if (gameState.phase === "waiting" && gameState.challenger !== localPlayerId) {
        flipCoin();
        isFlippingLocally = true;
        updateUI();

        setTimeout(function () {
            var flipResult = Math.random() > 0.5 ? "heads" : "tails";
            var winner = gameState.challenger_choice === flipResult ? gameState.challenger : localPlayerId;

            gameState = {
                game_id: gameState.game_id || localGameId,
                phase: "finished",
                challenger: gameState.challenger,
                challenger_choice: gameState.challenger_choice,
                challenged: localPlayerId,
                challenged_choice: choice,
                result: flipResult,
                winner: winner,
                timestamp: gameState.timestamp
            };

            isFlippingLocally = false;
            showCoinResult(flipResult, winner === localPlayerId);
            PingBridge.sendStateUpdate(gameState);
            PingBridge.sendAction("game_over", {
                result: flipResult,
                winner: winner,
                challenger: gameState.challenger,
                challenged: localPlayerId
            });
            updateUI();
        }, FLIP_DURATION);
    }
}

function playAgain() {
    myChoice = null;
    gameState = null;
    isFlippingLocally = false;
    resetCoin();
    updateUI();
}

function onFlipAnimationComplete() {
    // Animation done — result shown by setTimeout in chooseHeadsOrTails
}

// ---- PingBridge callbacks ----

PingBridge.onInit = function (userId, gId, roomId, existingState) {
    localPlayerId = userId;
    localGameId = gId;
    console.log("[CoinFlip] Init:", userId, gId);

    if (existingState && existingState.phase) {
        gameState = existingState;
        if (gameState.phase === "finished" && gameState.result) {
            var isWinner = gameState.winner === localPlayerId;
            showCoinResult(gameState.result, isWinner);
        }
    }
    updateUI();
};

PingBridge.onStateSync = function (state) {
    console.log("[CoinFlip] StateSync:", state);
    var oldPhase = gameState ? gameState.phase : "idle";
    gameState = state;

    if (state.phase === "finished" && state.result && oldPhase !== "finished" && coinPhase !== "flipping") {
        flipCoin();
        isFlippingLocally = true;
        updateUI();
        setTimeout(function () {
            isFlippingLocally = false;
            var isWinner = state.winner === localPlayerId;
            showCoinResult(state.result, isWinner);
            updateUI();
        }, FLIP_DURATION);
    } else {
        updateUI();
    }
};

// ---- Init ----

initCanvas();
startRenderLoop();
PingBridge.sendReady();
