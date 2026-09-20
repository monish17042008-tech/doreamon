import React, { useState, useEffect, useRef, useCallback } from "react";
import { Gamepad2, Trophy, Heart, Clock, RotateCcw, Medal } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../services/audioService";
import { storageService } from "../services/storageService";

export default function Game() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("ready"); // "ready", "playing", "gameover"
  const [score, setScore] = useState(0);
  const [dorayakiCount, setDorayakiCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [shieldTime, setShieldTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState(() => storageService.getLeaderboard());
  const [playerName, setPlayerName] = useState("");
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // References for game loop
  const playerRef = useRef({ x: 300, y: 200, targetX: 300, targetY: 200, width: 48, height: 48, rotorAngle: 0 });
  const itemsRef = useRef([]);
  const particlesRef = useRef([]);
  const floatTextsRef = useRef([]);
  const keysRef = useRef({});
  const animationFrameRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const timerIntervalRef = useRef(null);

  const endGame = useCallback(() => {
    setGameState("gameover");
    sound.playGameOver();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  // Load leaderboard on mount
  useEffect(() => {
    const unsub = storageService.subscribeLeaderboard((updated) => {
      setLeaderboard(updated);
    });
    return () => unsub();
  }, []);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true;
    };
    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Game timer
  useEffect(() => {
    if (gameState === "playing") {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [gameState, endGame]);

  const startGame = () => {
    sound.playBellChime();
    setScore(0);
    setDorayakiCount(0);
    setLives(3);
    setTimeLeft(60);
    setShieldTime(0);
    setScoreSubmitted(false);
    itemsRef.current = [];
    particlesRef.current = [];
    floatTextsRef.current = [];
    playerRef.current = { x: 300, y: 250, targetX: 300, targetY: 250, width: 48, height: 48, rotorAngle: 0 };
    setGameState("playing");
  };

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim() || scoreSubmitted) return;
    sound.playBellChime();
    const updated = storageService.submitScore({
      playerName: playerName.trim(),
      score,
      dorayakis: dorayakiCount,
    });
    setLeaderboard(updated);
    setScoreSubmitted(true);
  };

  // Mouse / Touch movement tracking
  const handleMouseMove = (e) => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    playerRef.current.targetX = (e.clientX - rect.left) * scaleX;
    playerRef.current.targetY = (e.clientY - rect.top) * scaleY;
  };

  const handleTouchMove = (e) => {
    if (gameState !== "playing" || !e.touches[0]) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    playerRef.current.targetX = (e.touches[0].clientX - rect.left) * scaleX;
    playerRef.current.targetY = (e.touches[0].clientY - rect.top) * scaleY;
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Clear Canvas with sky backdrop
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky gradient background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, "#38bdf8");
      skyGrad.addColorStop(0.6, "#7dd3fc");
      skyGrad.addColorStop(1, "#bae6fd");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant clouds
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.arc(120, 80, 45, 0, Math.PI * 2);
      ctx.arc(160, 75, 55, 0, Math.PI * 2);
      ctx.arc(200, 80, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(580, 140, 50, 0, Math.PI * 2);
      ctx.arc(630, 130, 60, 0, Math.PI * 2);
      ctx.arc(680, 140, 45, 0, Math.PI * 2);
      ctx.fill();

      if (gameState === "playing") {
        // Player smooth movement (mouse + keyboard)
        const player = playerRef.current;
        const speed = 350;

        if (keysRef.current["ArrowUp"] || keysRef.current["w"] || keysRef.current["W"]) {
          player.targetY -= speed * dt;
        }
        if (keysRef.current["ArrowDown"] || keysRef.current["s"] || keysRef.current["S"]) {
          player.targetY += speed * dt;
        }
        if (keysRef.current["ArrowLeft"] || keysRef.current["a"] || keysRef.current["A"]) {
          player.targetX -= speed * dt;
        }
        if (keysRef.current["ArrowRight"] || keysRef.current["d"] || keysRef.current["D"]) {
          player.targetX += speed * dt;
        }

        // Clamp target within canvas
        player.targetX = Math.max(30, Math.min(canvas.width - 30, player.targetX));
        player.targetY = Math.max(30, Math.min(canvas.height - 30, player.targetY));

        // Smooth interpolation
        player.x += (player.targetX - player.x) * 0.18;
        player.y += (player.targetY - player.y) * 0.18;
        player.rotorAngle = (player.rotorAngle + dt * 25) % (Math.PI * 2);

        // Shield countdown
        setShieldTime((st) => Math.max(0, st - dt));

        // Spawn items
        if (currentTime - lastSpawnRef.current > 750) {
          lastSpawnRef.current = currentTime;
          const rand = Math.random();
          let itemType = "dorayaki";
          if (rand < 0.55) itemType = "dorayaki";
          else if (rand < 0.72) itemType = "bell";
          else if (rand < 0.85) itemType = "mouse";
          else if (rand < 0.94) itemType = "note";
          else itemType = "door";

          itemsRef.current.push({
            type: itemType,
            x: Math.random() * (canvas.width - 60) + 30,
            y: -30,
            speed: Math.random() * 80 + 120,
            size: itemType === "door" ? 36 : 28,
            rotation: 0,
            rotSpeed: (Math.random() - 0.5) * 4,
          });
        }

        // Update items & Check Collisions
        const remainingItems = [];
        for (const item of itemsRef.current) {
          item.y += item.speed * dt;
          item.rotation += item.rotSpeed * dt;

          // Collision detection
          const dx = item.x - player.x;
          const dy = item.y - player.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 38) {
            // Collision triggered!
            if (item.type === "dorayaki") {
              sound.playDorayakiCatch();
              setScore((s) => s + 10);
              setDorayakiCount((c) => c + 1);
              floatTextsRef.current.push({ text: "+10", x: item.x, y: item.y, opacity: 1 });
            } else if (item.type === "bell") {
              sound.playBellChime();
              setScore((s) => s + 50);
              floatTextsRef.current.push({ text: "+50 Bell!", x: item.x, y: item.y, opacity: 1, color: "#f59e0b" });
            } else if (item.type === "door") {
              sound.playDoorWarp();
              setScore((s) => s + 100);
              setShieldTime(5); // 5 seconds shield
              floatTextsRef.current.push({ text: "SHIELD +100", x: item.x, y: item.y, opacity: 1, color: "#ec4899" });
            } else if (item.type === "mouse") {
              if (shieldTime <= 0) {
                sound.playMouseScare();
                setLives((l) => {
                  const updated = l - 1;
                  if (updated <= 0) endGame();
                  return Math.max(0, updated);
                });
                floatTextsRef.current.push({ text: "EEEEK! -1 Heart", x: item.x, y: item.y, opacity: 1, color: "#ef4444" });
              } else {
                floatTextsRef.current.push({ text: "BLOCKED!", x: item.x, y: item.y, opacity: 1, color: "#38bdf8" });
              }
            } else if (item.type === "note") {
              if (shieldTime <= 0) {
                sound.playClick();
                setScore((s) => Math.max(0, s - 10));
                floatTextsRef.current.push({ text: "BAD NOTE! -10", x: item.x, y: item.y, opacity: 1, color: "#64748b" });
              }
            }
          } else if (item.y < canvas.height + 40) {
            remainingItems.push(item);
          }
        }
        itemsRef.current = remainingItems;
      }

      // Draw Items
      for (const item of itemsRef.current) {
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);

        if (item.type === "dorayaki") {
          // Dorayaki pancake
          ctx.fillStyle = "#92400e";
          ctx.beginPath();
          ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#451a03";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Bean paste seam
          ctx.fillStyle = "#451a03";
          ctx.beginPath();
          ctx.ellipse(0, 1, 14, 4, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === "bell") {
          // Golden bell
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(0, 0, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#78350f";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = "#1e293b";
          ctx.beginPath();
          ctx.arc(0, 3, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === "door") {
          // Anywhere Door (pink)
          ctx.fillStyle = "#ec4899";
          ctx.fillRect(-12, -18, 24, 36);
          ctx.strokeStyle = "#be185d";
          ctx.lineWidth = 2;
          ctx.strokeRect(-12, -18, 24, 36);
          ctx.fillStyle = "#fbbf24";
          ctx.beginPath();
          ctx.arc(6, 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === "mouse") {
          // Scary grey mouse
          ctx.fillStyle = "#64748b";
          ctx.beginPath();
          ctx.ellipse(0, 0, 14, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#f43f5e";
          ctx.beginPath();
          ctx.arc(-8, -8, 5, 0, Math.PI * 2);
          ctx.arc(8, -8, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.arc(-4, -2, 2, 0, Math.PI * 2);
          ctx.arc(4, -2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === "note") {
          // Gian's noisy music note
          ctx.fillStyle = "#1e293b";
          ctx.font = "bold 20px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("♫", 0, 7);
        }

        ctx.restore();
      }

      // Draw Player (Doraemon with Take-copter)
      const player = playerRef.current;
      ctx.save();
      ctx.translate(player.x, player.y);

      // Shield Aura
      if (shieldTime > 0) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
        ctx.fill();
      }

      // Take-copter
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(0, -30);
      ctx.stroke();

      // Spinning rotor blade
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 3.5;
      const bladeW = Math.cos(player.rotorAngle) * 22;
      ctx.beginPath();
      ctx.moveTo(-bladeW, -30);
      ctx.lineTo(bladeW, -30);
      ctx.stroke();

      // Doraemon Head (Blue circle)
      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.arc(0, -2, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // White face
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(0, 2, 17, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(-5, -9, 4.5, 6.5, 0, 0, Math.PI * 2);
      ctx.ellipse(5, -9, 4.5, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pupils
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(-4, -9, 2, 0, Math.PI * 2);
      ctx.arc(4, -9, 2, 0, Math.PI * 2);
      ctx.fill();

      // Red nose
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, -3, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Mouth
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 3, 7, 0.1, Math.PI - 0.1);
      ctx.stroke();

      // Collar with yellow bell
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(-12, 16, 24, 4);
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(0, 19, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Floating text alerts (+10, -1 Life, etc.)
      const remainingTexts = [];
      for (const ft of floatTextsRef.current) {
        ft.y -= 40 * dt;
        ft.opacity -= 1.2 * dt;
        if (ft.opacity > 0) {
          ctx.save();
          ctx.font = "bold 15px 'Outfit', sans-serif";
          ctx.fillStyle = ft.color || "#0284c7";
          ctx.globalAlpha = Math.max(0, ft.opacity);
          ctx.textAlign = "center";
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
          remainingTexts.push(ft);
        }
      }
      floatTextsRef.current = remainingTexts;

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameState, shieldTime]);

  const letterGrade = score >= 1200 ? "S" : score >= 800 ? "A" : score >= 500 ? "B" : "C";

  return (
    <div className="min-h-screen bg-[#070f26] py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>60FPS Arcade Experience</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            Dorayaki Sky Catch
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Fly Doraemon with his Take-copter! Catch as many sweet Dorayakis as possible, grab golden bells & anywhere doors, and dodge scary mice!
          </p>
        </div>

        {/* Game Container */}
        <div className="bg-[#0b1636] rounded-3xl p-4 sm:p-6 border border-[#193275]/70 shadow-2xl space-y-4">
          {/* Game HUD */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#070f26] px-5 py-3 rounded-2xl border border-[#193275]/70 font-bold text-sm">
            {/* Lives */}
            <div className="flex items-center gap-1.5 text-rose-500">
              <span className="text-xs text-sky-300/70 uppercase mr-1">Lives:</span>
              {[1, 2, 3].map((heart) => (
                <Heart
                  key={heart}
                  className={`w-5 h-5 ${
                    heart <= lives ? "fill-rose-500 text-rose-500" : "text-slate-700"
                  }`}
                />
              ))}
            </div>

            {/* Score & Dorayakis */}
            <div className="flex items-center gap-4">
              <div className="text-white">
                <span className="text-xs text-sky-300/70 uppercase mr-1.5">Score:</span>
                <span className="text-lg font-display font-extrabold text-sky-400">{score}</span>
              </div>
              <div className="text-white">
                <span className="text-xs text-sky-300/70 uppercase mr-1.5">Dorayakis:</span>
                <span className="text-lg font-display font-extrabold text-amber-400">{dorayakiCount}</span>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4 text-sky-400" />
              <span className="font-mono text-base">{timeLeft}s</span>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative aspect-[16/10] sm:aspect-[2/1] w-full rounded-2xl overflow-hidden shadow-inner border border-[#193275]/80 bg-[#070f26]">
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="w-full h-full block cursor-crosshair touch-none"
            />

            {/* Start / Ready Screen Overlay */}
            {gameState === "ready" && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center shadow-lg text-slate-950 animate-bounce">
                  <Gamepad2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
                    Ready to Take Flight?
                  </h2>
                  <p className="text-xs sm:text-sm text-sky-200 max-w-md">
                    Use your Mouse, Touch, or Arrow keys / WASD to fly Doraemon. Catch Dorayakis (+10) and Bells (+50), but watch out for sneaky Mice!
                  </p>
                </div>
                <button
                  onClick={startGame}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold shadow-lg shadow-sky-500/30 transform hover:scale-105 active:scale-95 transition-all text-base"
                >
                  Start Flying Now
                </button>
              </div>
            )}

            {/* Game Over Screen Overlay */}
            {gameState === "gameover" && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center space-y-5 animate-fade-in">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    Mission Accomplished
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
                    Flight Summary
                  </h2>
                </div>

                {/* Score Summary Box */}
                <div className="bg-[#0b1636]/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-[#193275]/80 flex items-center justify-center gap-8 text-center min-w-[280px]">
                  <div>
                    <span className="block text-xs font-bold text-sky-200 uppercase">Final Score</span>
                    <span className="text-3xl font-display font-black text-amber-300">{score}</span>
                  </div>
                  <div className="border-l border-[#193275]/80 pl-8">
                    <span className="block text-xs font-bold text-sky-200 uppercase">Pilot Grade</span>
                    <span className="text-4xl font-display font-black text-emerald-400">{letterGrade}</span>
                  </div>
                </div>

                {/* Leaderboard Submission Form */}
                {!scoreSubmitted ? (
                  <form onSubmit={handleScoreSubmit} className="flex gap-2 max-w-sm w-full">
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter Pilot Call-sign..."
                      maxLength={16}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#070f26] border border-[#193275]/80 text-white text-xs sm:text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm transition-all whitespace-nowrap"
                    >
                      Save Score
                    </button>
                  </form>
                ) : (
                  <div className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-500/40">
                    ✓ Score recorded on community leaderboard!
                  </div>
                )}

                <button
                  onClick={startGame}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm transition-all shadow-md shadow-sky-500/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>
            )}
          </div>

          {/* Controls hint */}
          <div className="text-center text-xs text-sky-300/80 font-medium">
            Controls: Move your mouse or fingers across the sky, or use Arrow keys / WASD.
          </div>
        </div>

        {/* Global Hall of Fame Leaderboard */}
        <section className="bg-[#0b1636] rounded-3xl p-6 sm:p-8 border border-[#193275]/70 shadow-2xl space-y-6 text-white">
          <div className="flex items-center justify-between border-b border-[#193275]/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-display font-extrabold text-white">
                  Hall of Fame Leaderboard
                </h2>
                <p className="text-xs text-slate-300">Top Doraemon pilots across Tokyo and the 22nd Century</p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-300 bg-[#070f26] border border-[#193275]/60 px-3 py-1 rounded-full">
              Live Standings
            </span>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-sky-300/70 border-b border-[#193275]/60 text-[11px] font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Rank</th>
                  <th className="pb-3">Pilot</th>
                  <th className="pb-3">Badge</th>
                  <th className="pb-3 text-center">Dorayakis</th>
                  <th className="pb-3 text-right pr-2">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#193275]/40 font-semibold">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <tr
                    key={entry.id || index}
                    className={`hover:bg-[#0f1f4b] transition-colors ${
                      index === 0 ? "bg-amber-950/25" : ""
                    }`}
                  >
                    <td className="py-3.5 pl-2 font-bold font-mono">
                      {index === 0 ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Medal className="w-4 h-4" /> #1
                        </span>
                      ) : index === 1 ? (
                        <span className="text-slate-400">#2</span>
                      ) : index === 2 ? (
                        <span className="text-amber-600">#3</span>
                      ) : (
                        <span className="text-slate-400">#{index + 1}</span>
                      )}
                    </td>
                    <td className="py-3.5 text-white font-bold">
                      {entry.playerName}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                        entry.badge === "Legend"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                          : entry.badge === "Master"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                          : "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                      }`}>
                        {entry.badge}
                      </span>
                    </td>
                    <td className="py-3.5 text-center text-sky-200 font-mono">
                      {entry.dorayakis}
                    </td>
                    <td className="py-3.5 text-right pr-2 font-display font-black text-sky-400">
                      {entry.score.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
