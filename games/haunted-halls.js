(() => {
    const KEY = 'hauntedHallsBest';
    const MAP_W = 16;
    const MAP_H = 12;
    // 0 empty, 1 wall, 2 key, 3 exit door, 4 start
    const MAP = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,0,0,1,0,0,0,0,0,1,0,0,0,2,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,0,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,2,1,1,1,1,0,0,0,1,0,0,0,1,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const $ = (id) => document.getElementById(id);

    let best = localStorage.getItem(KEY);
    $('best').textContent = best ? best + 's' : '—';
    $('backBtn').onclick = () => { location.href = 'index.html'; };

    let running = false;
    let won = false;
    let lost = false;
    let keysFound = 0;
    let fear = 0;
    let elapsed = 0;
    let lastTs = 0;
    let jumpCooldown = 0;
    let footstep = 0;
    let caughtSequence = false;
    let turnProgress = 0;
    let turnStartA = 0;
    let turnTargetA = 0;
    let scareShown = false;
    let scareTimer = 0;

    const keysDown = Object.create(null);
    const player = { x: 1.5, y: 1.5, a: 0, speed: 2.4, turn: 2.2, lookSens: 0.0024 };
    const ghost = { x: 14.5, y: 10.5, speed: 1.15, visible: false };
    const pickups = [];
    let mouseLookQueued = 0;
    let draggingLook = false;
    let lastDragX = 0;

    function normalizeAngle(a) {
        while (a > Math.PI) a -= Math.PI * 2;
        while (a < -Math.PI) a += Math.PI * 2;
        return a;
    }

    function lerpAngle(from, to, t) {
        const diff = normalizeAngle(to - from);
        return from + diff * t;
    }

    function hideMysteryScare() {
        const el = $('mysteryScare');
        if (!el) return;
        el.classList.remove('show');
        el.setAttribute('aria-hidden', 'true');
    }

    function playScareSound() {
        try {
            const ac = new (window.AudioContext || window.webkitAudioContext)();
            const now = ac.currentTime;
            // loud scare hit + quick cat-ish yowl
            const hit = ac.createOscillator();
            const yowl = ac.createOscillator();
            const g1 = ac.createGain();
            const g2 = ac.createGain();
            hit.type = 'sawtooth';
            yowl.type = 'sine';
            hit.connect(g1);
            yowl.connect(g2);
            g1.connect(ac.destination);
            g2.connect(ac.destination);
            hit.frequency.setValueAtTime(70, now);
            hit.frequency.exponentialRampToValueAtTime(240, now + 0.2);
            yowl.frequency.setValueAtTime(900, now + 0.05);
            yowl.frequency.exponentialRampToValueAtTime(480, now + 0.45);
            g1.gain.setValueAtTime(0.0001, now);
            g1.gain.exponentialRampToValueAtTime(0.3, now + 0.03);
            g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            g2.gain.setValueAtTime(0.0001, now);
            g2.gain.exponentialRampToValueAtTime(0.16, now + 0.08);
            g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
            hit.start(now);
            yowl.start(now + 0.04);
            hit.stop(now + 0.35);
            yowl.stop(now + 0.5);
            setTimeout(() => ac.close(), 700);
        } catch (e) { /* ignore */ }
    }

    function showMysteryScare() {
        const el = $('mysteryScare');
        if (!el) return;
        el.classList.add('show');
        el.setAttribute('aria-hidden', 'false');
        playScareSound();
        const flash = $('jumpFlash');
        if (flash) {
            flash.classList.add('show');
            setTimeout(() => flash.classList.remove('show'), 180);
        }
    }

    function finishCaught() {
        caughtSequence = false;
        lost = true;
        running = false;
        hideMysteryScare();
        exitLookLock();
        $('status').textContent = 'It was a cat… Try again if you dare.';
        $('overlay').hidden = false;
        $('overlay').innerHTML = '<p>You looked behind you…</p><p class="haunted-hint">Just a cat. Press Start to try again.</p>';
        $('actionBtn').textContent = 'Try Again';
        $('actionBtn').disabled = false;
    }

    function beginCaughtSequence() {
        if (caughtSequence || lost || won) return;
        caughtSequence = true;
        scareShown = false;
        scareTimer = 0;
        turnProgress = 0;
        mouseLookQueued = 0;
        draggingLook = false;
        exitLookLock();

        // Mystery beat: slow turn to face whatever is behind you
        turnStartA = player.a;
        turnTargetA = player.a + Math.PI;
        ghost.x = player.x - Math.cos(player.a) * 0.9;
        ghost.y = player.y - Math.sin(player.a) * 0.9;

        $('status').textContent = '……';
        $('actionBtn').disabled = true;
    }

    function updateCaughtSequence(dt) {
        // Phase 1: slow mysterious turn (~2.8s)
        if (!scareShown) {
            turnProgress = Math.min(1, turnProgress + dt / 2.8);
            const t = turnProgress < 0.5
                ? 2 * turnProgress * turnProgress
                : 1 - Math.pow(-2 * turnProgress + 2, 2) / 2;
            player.a = lerpAngle(turnStartA, turnTargetA, t);
            fear = Math.min(100, fear + dt * 22);
            $('fear').textContent = fear | 0;
            $('vignette').style.opacity = String(0.5 + turnProgress * 0.5);

            if (turnProgress > 0.35 && turnProgress < 0.7) {
                $('status').textContent = 'Don’t look…';
            } else if (turnProgress >= 0.7 && turnProgress < 1) {
                $('status').textContent = '………';
            }

            if (turnProgress >= 1) {
                scareShown = true;
                scareTimer = 0;
                showMysteryScare();
                $('status').textContent = '';
            }
            return;
        }

        // Phase 2: hold jump scare, then game over
        scareTimer += dt;
        if (scareTimer >= 1.25) finishCaught();
    }

    function resetPickups() {
        pickups.length = 0;
        for (let y = 0; y < MAP_H; y++) {
            for (let x = 0; x < MAP_W; x++) {
                if (MAP[y][x] === 2) pickups.push({ x: x + 0.5, y: y + 0.5, taken: false });
                if (MAP[y][x] === 4) {
                    player.x = x + 0.5;
                    player.y = y + 0.5;
                    player.a = 0;
                }
            }
        }
    }

    function cell(x, y) {
        const cx = Math.floor(x);
        const cy = Math.floor(y);
        if (cx < 0 || cy < 0 || cx >= MAP_W || cy >= MAP_H) return 1;
        const v = MAP[cy][cx];
        return v === 2 || v === 4 ? 0 : v;
    }

    function isWall(x, y) {
        return cell(x, y) === 1;
    }

    function tryMove(nx, ny) {
        const r = 0.18;
        if (!isWall(nx - r, player.y) && !isWall(nx + r, player.y) && !isWall(nx, player.y - r) && !isWall(nx, player.y + r)) {
            player.x = nx;
        }
        if (!isWall(player.x - r, ny) && !isWall(player.x + r, ny) && !isWall(player.x, ny - r) && !isWall(player.x, ny + r)) {
            player.y = ny;
        }
    }

    function castRay(angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        let dist = 0;
        const step = 0.02;
        let hit = 0;
        let side = 0;
        let px = player.x;
        let py = player.y;
        while (dist < 14) {
            dist += step;
            const lx = px;
            const ly = py;
            px = player.x + cos * dist;
            py = player.y + sin * dist;
            const c = cell(px, py);
            if (c === 1 || c === 3) {
                hit = c;
                side = Math.abs(Math.floor(px) - Math.floor(lx)) > 0 ? 1 : 0;
                break;
            }
        }
        return { dist: dist * Math.cos(angle - player.a), raw: dist, hit, side };
    }

    function drawScene() {
        const w = canvas.width;
        const h = canvas.height;
        const half = h / 2;

        // ceiling / floor
        const gradC = ctx.createLinearGradient(0, 0, 0, half);
        gradC.addColorStop(0, '#050308');
        gradC.addColorStop(1, '#1a1020');
        ctx.fillStyle = gradC;
        ctx.fillRect(0, 0, w, half);

        const gradF = ctx.createLinearGradient(0, half, 0, h);
        gradF.addColorStop(0, '#120a14');
        gradF.addColorStop(1, '#030205');
        ctx.fillStyle = gradF;
        ctx.fillRect(0, half, w, half);

        const fov = Math.PI / 3;
        const zBuffer = new Float32Array(w);

        for (let col = 0; col < w; col++) {
            const rayAngle = player.a - fov / 2 + (col / w) * fov;
            const ray = castRay(rayAngle);
            zBuffer[col] = ray.dist;
            const wallH = Math.min(h, (h / Math.max(0.0001, ray.dist)) * 0.85);
            const shade = Math.max(0.08, 1 - ray.dist / 11);
            const centerBoost = 1 - Math.min(1, Math.abs(col - w / 2) / (w * 0.55));
            const light = shade * (0.35 + centerBoost * 0.65);

            let r, g, b;
            if (ray.hit === 3) {
                r = 70 + light * 185;
                g = 25 + light * 55;
                b = 25 + light * 35;
            } else {
                const base = ray.side ? 0.72 : 1;
                r = (45 + light * 120) * base;
                g = (30 + light * 70) * base;
                b = (70 + light * 140) * base;
            }

            // eerie striping
            if (Math.floor(col / 7) % 5 === 0) {
                r *= 0.88;
                g *= 0.84;
                b *= 0.95;
            }

            ctx.fillStyle = `rgb(${Math.min(255, r)|0},${Math.min(255, g)|0},${Math.min(255, b)|0})`;
            ctx.fillRect(col, half - wallH / 2, 1, wallH);

            // top/bottom edge to sell depth
            ctx.fillStyle = `rgba(0,0,0,${0.25 + (1 - light) * 0.35})`;
            ctx.fillRect(col, half - wallH / 2, 1, 2);
            ctx.fillRect(col, half + wallH / 2 - 2, 1, 2);
        }

        // keys as sprites
        pickups.forEach((p) => {
            if (p.taken) return;
            drawSprite(p.x, p.y, zBuffer, '#f5d76e', 0.35, '🗝️');
        });

        // ghost sprite
        drawGhost(zBuffer);

        // flashlight vignette
        const flash = ctx.createRadialGradient(w / 2, h * 0.52, 30, w / 2, h * 0.52, w * 0.62);
        flash.addColorStop(0, 'rgba(255,235,190,0.08)');
        flash.addColorStop(0.35, 'rgba(0,0,0,0)');
        flash.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = flash;
        ctx.fillRect(0, 0, w, h);

        // fear tint
        if (fear > 20) {
            ctx.fillStyle = `rgba(80,0,20,${Math.min(0.35, fear / 250)})`;
            ctx.fillRect(0, 0, w, h);
        }
    }

    function project(x, y) {
        const dx = x - player.x;
        const dy = y - player.y;
        const dist = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) - player.a;
        let a = angle;
        while (a > Math.PI) a -= Math.PI * 2;
        while (a < -Math.PI) a += Math.PI * 2;
        const fov = Math.PI / 3;
        if (Math.abs(a) > fov / 1.5) return null;
        const screenX = (0.5 + a / fov) * canvas.width;
        return { screenX, dist, angle: a };
    }

    function drawSprite(x, y, zBuffer, color, size, emoji) {
        const p = project(x, y);
        if (!p || p.dist < 0.2) return;
        const spriteH = (canvas.height / p.dist) * size;
        const spriteW = spriteH;
        const sx = p.screenX | 0;
        if (sx < 0 || sx >= canvas.width) return;
        if (p.dist > zBuffer[sx]) return;
        ctx.font = `${Math.max(12, spriteH)|0}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, p.screenX, canvas.height / 2);
        ctx.globalAlpha = 1;
    }

    function drawGhost(zBuffer) {
        // Keep the turn mysterious — don’t show the thing until the jump scare
        if (caughtSequence) {
            ghost.visible = false;
            return;
        }
        const p = project(ghost.x, ghost.y);
        ghost.visible = false;
        if (!p || p.dist < 0.15) return;
        const sx = Math.max(0, Math.min(canvas.width - 1, p.screenX | 0));
        if (p.dist > zBuffer[sx] + 0.15) return;
        ghost.visible = true;
        const h = (canvas.height / p.dist) * 1.1;
        const alpha = Math.min(0.95, 0.35 + (1 / p.dist) * 0.4);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#1a0510';
        ctx.beginPath();
        ctx.ellipse(p.screenX, canvas.height / 2 + h * 0.1, h * 0.28, h * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff3b3b';
        const eyeY = canvas.height / 2 - h * 0.08;
        const eyeS = Math.max(2, h * 0.06);
        ctx.beginPath();
        ctx.arc(p.screenX - h * 0.08, eyeY, eyeS, 0, Math.PI * 2);
        ctx.arc(p.screenX + h * 0.08, eyeY, eyeS, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.dist < 1.6 && jumpCooldown <= 0) {
            triggerJump();
        }
    }

    function triggerJump() {
        jumpCooldown = 4;
        fear = Math.min(100, fear + 18);
        $('fear').textContent = fear | 0;
        const flash = $('jumpFlash');
        flash.classList.add('show');
        setTimeout(() => flash.classList.remove('show'), 220);
        $('status').textContent = 'It sees you… RUN!';
    }

    function updateGhost(dt) {
        const dx = player.x - ghost.x;
        const dy = player.y - ghost.y;
        const dist = Math.hypot(dx, dy) || 1;
        const chase = ghost.speed * (keysFound >= 1 ? 1.2 : 1) * (keysFound >= 2 ? 1.35 : 1);
        let nx = ghost.x + (dx / dist) * chase * dt;
        let ny = ghost.y + (dy / dist) * chase * dt;

        // slide along walls
        if (!isWall(nx, ghost.y)) ghost.x = nx;
        else if (!isWall(ghost.x + Math.sign(dx) * 0.3, ghost.y)) ghost.x += Math.sign(dx) * chase * dt * 0.5;
        if (!isWall(ghost.x, ny)) ghost.y = ny;
        else if (!isWall(ghost.x, ghost.y + Math.sign(dy) * 0.3)) ghost.y += Math.sign(dy) * chase * dt * 0.5;

        if (dist < 0.55) {
            beginCaughtSequence();
        }
    }

    function checkPickups() {
        pickups.forEach((p) => {
            if (p.taken) return;
            if (Math.hypot(p.x - player.x, p.y - player.y) < 0.55) {
                p.taken = true;
                keysFound += 1;
                $('keys').textContent = keysFound + '/2';
                $('status').textContent = keysFound === 1 ? 'Key found! One more…' : 'Both keys! Find the red door!';
                fear = Math.max(0, fear - 10);
                $('fear').textContent = fear | 0;
            }
        });
    }

    function checkExit() {
        if (keysFound < 2) return;
        if (cell(player.x, player.y) === 3) {
            won = true;
            running = false;
            exitLookLock();
            const secs = Math.max(1, elapsed | 0);
            $('status').textContent = `You escaped in ${secs}s!`;
            if (!best || secs < +best) {
                best = String(secs);
                localStorage.setItem(KEY, best);
                $('best').textContent = best + 's';
                $('status').textContent += ' New best escape!';
            }
            $('overlay').hidden = false;
            $('overlay').innerHTML = `<p>You made it out!</p><p class="haunted-hint">Escaped in ${secs}s. Press Start to enter again… if you dare.</p>`;
            $('actionBtn').textContent = 'Play Again';
            $('actionBtn').disabled = false;
        }
    }

    function update(dt) {
        if (caughtSequence) {
            updateCaughtSequence(dt);
            return;
        }
        if (!running) return;
        elapsed += dt;
        $('time').textContent = elapsed | 0;
        if (jumpCooldown > 0) jumpCooldown -= dt;

        let turn = 0;
        let forward = 0;
        let strafe = 0;
        if (keysDown.ArrowLeft || keysDown.q || keysDown.Q) turn -= 1;
        if (keysDown.ArrowRight || keysDown.e || keysDown.E) turn += 1;
        if (keysDown.ArrowUp || keysDown.w || keysDown.W) forward += 1;
        if (keysDown.ArrowDown || keysDown.s || keysDown.S) forward -= 1;
        if (keysDown.a || keysDown.A) strafe -= 1;
        if (keysDown.d || keysDown.D) strafe += 1;

        player.a += turn * player.turn * dt;
        if (mouseLookQueued) {
            player.a += mouseLookQueued;
            mouseLookQueued = 0;
        }
        const mx = Math.cos(player.a) * forward + Math.cos(player.a + Math.PI / 2) * strafe;
        const my = Math.sin(player.a) * forward + Math.sin(player.a + Math.PI / 2) * strafe;
        const len = Math.hypot(mx, my) || 1;
        if (forward || strafe) {
            tryMove(player.x + (mx / len) * player.speed * dt, player.y + (my / len) * player.speed * dt);
            footstep += dt;
            if (footstep > 0.45) {
                footstep = 0;
                fear = Math.min(100, fear + 1);
                $('fear').textContent = fear | 0;
            }
        }

        checkPickups();
        checkExit();
        if (!won && !lost && !caughtSequence) updateGhost(dt);

        // ambient fear creep
        fear = Math.min(100, fear + dt * 1.2);
        $('fear').textContent = fear | 0;
        $('vignette').style.opacity = String(0.35 + fear / 180);
    }

    function loop(ts) {
        if (!lastTs) lastTs = ts;
        const dt = Math.min(0.05, (ts - lastTs) / 1000);
        lastTs = ts;
        update(dt);
        drawScene();
        if (running || caughtSequence || (!won && !lost)) requestAnimationFrame(loop);
        else drawScene();
    }

    window.addEventListener('keydown', (e) => {
        keysDown[e.key] = true;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => { keysDown[e.key] = false; });

    function applyLookDelta(dx) {
        if (!running || caughtSequence) return;
        mouseLookQueued += dx * player.lookSens;
    }

    function requestLookLock() {
        if (!running) return;
        const el = canvas;
        if (el.requestPointerLock) {
            el.requestPointerLock().catch(() => {});
        }
    }

    function exitLookLock() {
        if (document.pointerLockElement === canvas && document.exitPointerLock) {
            document.exitPointerLock();
        }
    }

    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === canvas && running) {
            $('status').textContent = 'Mouse look on — move the mouse to look around. Esc frees the cursor.';
            canvas.classList.add('looking');
        } else {
            canvas.classList.remove('looking');
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!running) return;
        if (document.pointerLockElement === canvas) {
            applyLookDelta(e.movementX || 0);
        }
    });

    // Click canvas to lock mouse, or drag to look without lock
    canvas.style.cursor = 'crosshair';
    canvas.addEventListener('click', () => {
        if (running) requestLookLock();
    });

    canvas.addEventListener('pointerdown', (e) => {
        if (!running || e.button !== 0) return;
        if (document.pointerLockElement === canvas) return;
        draggingLook = true;
        lastDragX = e.clientX;
        canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', (e) => {
        if (!draggingLook || document.pointerLockElement === canvas) return;
        const dx = e.clientX - lastDragX;
        lastDragX = e.clientX;
        applyLookDelta(dx);
    });

    function endDragLook(e) {
        if (!draggingLook) return;
        draggingLook = false;
        try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    canvas.addEventListener('pointerup', endDragLook);
    canvas.addEventListener('pointercancel', endDragLook);

    // touch / on-screen pad
    const pad = $('touchPad');
    if (pad) {
        const hold = Object.create(null);
        const map = { left: 'ArrowLeft', right: 'ArrowRight', forward: 'ArrowUp', back: 'ArrowDown' };
        pad.querySelectorAll('button').forEach((btn) => {
            const dir = btn.dataset.dir;
            const start = (e) => {
                e.preventDefault();
                hold[dir] = true;
                keysDown[map[dir]] = true;
            };
            const end = () => {
                hold[dir] = false;
                keysDown[map[dir]] = false;
            };
            btn.addEventListener('pointerdown', start);
            btn.addEventListener('pointerup', end);
            btn.addEventListener('pointerleave', end);
            btn.addEventListener('pointercancel', end);
        });
    }

    function startGame() {
        running = true;
        won = false;
        lost = false;
        caughtSequence = false;
        scareShown = false;
        scareTimer = 0;
        turnProgress = 0;
        keysFound = 0;
        fear = 0;
        elapsed = 0;
        lastTs = 0;
        jumpCooldown = 2.5;
        mouseLookQueued = 0;
        ghost.x = 14.5;
        ghost.y = 10.5;
        hideMysteryScare();
        resetPickups();
        $('keys').textContent = '0/2';
        $('fear').textContent = '0';
        $('time').textContent = '0';
        $('status').textContent = 'Click the dark view, then move your mouse to look around.';
        $('overlay').hidden = true;
        $('actionBtn').textContent = 'Running…';
        $('actionBtn').disabled = true;
        requestAnimationFrame(loop);
        // slight delay so the click that pressed Start doesn't steal focus weirdly
        setTimeout(requestLookLock, 50);
    }

    $('actionBtn').onclick = startGame;
    resetPickups();
    drawScene();
})();
