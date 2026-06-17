# BLOX RIVALS — Arena FPS (v2)

A fast-paced, Roblox-Rivals-style first-person shooter in the browser, now with a full
**ring-out / knockback** mode, multiple maps, jump pads, moving platforms, a rocket launcher,
grenades, a melee knife, and **mobile touch controls**.
Built with [Three.js](https://threejs.org/) — **no build step, no install**.

## Play

**Just open it:** double-click `index.html`. (Three.js is vendored locally as `three.module.js`, so it works fully offline.)

**Or serve it** (recommended):
```bash
cd rivals-game
python -m http.server 8099
# open http://localhost:8099
```

Pick a **map**, set your **mouse sensitivity**, hit **► PLAY**, then move your mouse to aim.
Press **ESC** to release the mouse; click the screen to recapture it.

## Maps

| Map | Type | Notes |
|-----|------|-------|
| **Blox Arena** | Survival | Walled cover map, no void. |
| **Crossfire** | Survival | Tight grid, constant close combat. |
| **Sky Islands** | Ring-Out | Floating platforms over the void. Knock rivals off! |
| **Twin Towers** | Ring-Out | High decks linked by moving bridges, deadly drops. |

On **Ring-Out** maps, both you and the rivals die instantly if knocked into the void —
the rocket, grenades and melee all send enemies flying. Don't fall off yourself.

## Controls

| Key | Action | | Key | Action |
|-----|--------|-|-----|--------|
| `W A S D` | Move | | `R` | Reload |
| Mouse | Look / aim | | `G` | Throw grenade |
| L-Click | Shoot (hold for auto) | | `V` | Melee knife |
| `Space` | Jump | | `1`–`4` / scroll | Switch weapon |
| `Shift` | Sprint | | `Esc` | Release mouse |

**Mobile:** on touch devices an on-screen layout appears automatically — left stick to move,
drag the right side to look, plus FIRE / JUMP / 🔪 / 🧨 / RELOAD / SWAP buttons.

## Weapons & gadgets

- **SMG** — full-auto, fast, medium damage.
- **Shotgun** — 9 pellets, devastating up close.
- **Sniper** — near one-shot, headshots do 1.6×.
- **Rocket Launcher** — projectile with splash + big knockback. Direct hits kill; **rocket-jump** off your own blasts.
- **Grenades** (`G`) — thrown arc, bounce, explode with splash + knockback. Regenerate over time.
- **Melee knife** (`V`) — close-range, huge damage and knockback (great for ring-outs).

## Movement tech

- **Jump pads** — bounce you high to cross gaps and flank.
- **Moving platforms** — ride them; they carry you along.
- **Sprint + bunny-friendly jumping**, health regen after you stop taking damage.

## Tech notes

- Single file `index.html` (HTML + CSS + ES-module JS) + local `three.module.js` (r160).
- `window.RIVALS` debug bridge for deterministic testing:
  `RIVALS.begin()`, `RIVALS.step(dt)`, `RIVALS.spawn()`, `RIVALS.fire()`,
  `RIVALS.melee()`, `RIVALS.throwGrenade()`, `RIVALS.setMap(i)`, plus getters for
  `enemies`, `projectiles`, `movers`, `jumpPads`, `player`, `kills`.

## Multiplayer (lobby + chat + fight real people)

Click **🌐 MULTIPLAYER** on the title screen to open the **Lobby**: enter a **Server URL**,
your **name**, and a **Room code**, then **CONNECT**. Everyone who connects to the same
server + room is together — chat in the lobby, then **⚔ ENTER ARENA** to fight. In the
arena, press **T** or **Enter** to chat, and the scoreboard (top-right) tracks kills.

### What the server must do
The client only needs a **WebSocket room-relay**: when it receives a JSON text message,
rebroadcast it to every *other* connected client whose `room` matches. No game logic needed.
A ready-to-run reference is in [`server-example.js`](server-example.js) (~30 lines, Node + `ws`):

```bash
npm init -y && npm install ws
node server-example.js          # ws://localhost:8080
```
Host it with TLS (Render/Railway/Fly/VPS) and use a `wss://…` URL so it works over the internet
and from the HTTPS GitHub Pages build.

### Message protocol (client ⇄ relay ⇄ others)
Every message is JSON; the client adds `id` (unique per player) and `room` automatically.

| `t` | payload | meaning |
|-----|---------|---------|
| `join` | `name, color, reply?` | player joined (peers reply once so newcomers learn them) |
| `leave` | — | player left |
| `state` | `x,y,z,yaw,hp,name,color,wpn` | position/aim broadcast ~15×/sec |
| `chat` | `name, text` | lobby/arena chat line |
| `shot` | `from[3], to[3], color` | tracer to render on others' screens |
| `hit` | `target, dmg, head` | you hit `target` for `dmg` (victim applies it) |
| `death` | `by` | sender died, killed by player `by` (scoreboard +1) |

Damage is **victim-authoritative** (you tell others you hit them; they apply it and respawn),
which keeps the relay dumb and avoids a trusted host.

> Tip: to pre-fill the lobby's Server URL, set `DEFAULT_WS_URL` near the top of the
> multiplayer section in `index.html`.

## Ideas to extend

- Capture-the-flag / team modes, killstreaks, weapon pickups & powerups
- Destructible cover, more maps, a map editor
- Server-authoritative netcode + interpolation buffering for smoother high-ping play
