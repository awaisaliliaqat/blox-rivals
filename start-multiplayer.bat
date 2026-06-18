@echo off
title BLOX RIVALS - Multiplayer Host
cd /d "%~dp0"

if not exist node_modules\ws (
  echo Installing server dependency ^(ws^)...
  call npm install ws
)

echo.
echo ============================================================
echo   BLOX RIVALS - hosting multiplayer
echo ============================================================
echo Starting the game server on port 8080...
start "BLOX RIVALS server" cmd /k "node server-example.js"

timeout /t 3 >nul

echo.
echo Opening a public link. In a few seconds, look BELOW for a line like:
echo     https://something-random.trycloudflare.com
echo.
echo Share this with your friends as the SERVER URL (change https to wss):
echo     wss://something-random.trycloudflare.com
echo ...plus a ROOM CODE you all agree on (e.g. myroom).
echo.
echo KEEP THIS WINDOW OPEN while you play. Close it (or Ctrl+C) to stop.
echo ============================================================
echo.

cloudflared.exe tunnel --url http://localhost:8080

pause
