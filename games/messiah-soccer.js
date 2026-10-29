// Messiah Soccer
// WesleyDude.com

const KEY = 'messiahSoccerBest';
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const $ = (id) => document.getElementById(id);

let messiahGoals = 0;
let opponentGoals = 0;
let best = Number(localStorage.getItem(KEY) || 0);
let timeLeft = 60;
let running = false;
let raf = null;
let tick = null;
let goalCooldown = 0;
const keys = {};

const player = { x: 140, y: 160, w: 36, h: 48, speed: 3.2, name: 'Messiah' };
const ball = { x: 280, y: 160, r: 10, vx: 0, vy: 0 };
const rightGoal = { x: 520, y: 110, w: 28, h: 100 }; // Messiah scores here
const leftGoal = { x: 12, y: 110, w: 28, h: 100 }; // opponents score here
const opponents = [
    { x: 360, y: 100, w: 34, h: 46, speed: 1.7, name: 'Rival 1', color: '#c62828', kickCd: 0 },
    { x: 400, y: 180, w: 34, h: 46, speed: 1.5, name: 'Rival 2', color: '#ad1457', kickCd: 0 },
    { x: 320, y: 220, w: 34, h: 46, speed: 1.6, name: 'Rival 3', color: '#6a1b9a', kickCd: 0 }
];

$('best').textContent = best;
$('backBtn').onclick = () => { window.location.href = 'index.html'; };

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault();
    if (e.key === ' ' && running) kickBall(player, 8.2, 'Messiah shoots!');
});
window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('pointermove', (e) => {
    if (!running) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    player.x = clamp(x - player.w / 2, 50, canvas.width - 90);
    player.y = clamp(y - player.h / 2, 30, canvas.height - player.h - 12);
});

function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
}

function centerOf(p) {
    return { x: p.x + p.w / 2, y: p.y + p.h * 0.65 };
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 0;
    ball.vy = 0;
}

function kickBall(kicker, power, message) {
    const c = centerOf(kicker);
    const dx = ball.x - c.x;
    const dy = ball.y - c.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 52) return false;
    const nx = dx / (dist || 1);
    const ny = dy / (dist || 1);
    // Always push away from kicker — never attach/pickup
    ball.vx = nx * power;
    ball.vy = ny * power;
    // nudge ball outside feet so it can't stick
    ball.x = c.x + nx * 28;
    ball.y = c.y + ny * 28;
    if (message) $('status').textContent = message;
    return true;
}

function bumpBall(person) {
    // Walking into the ball only nudges it — no pickup / sticky dribble
    const c = centerOf(person);
    const dx = ball.x - c.x;
    const dy = ball.y - c.y;
    const dist = Math.hypot(dx, dy);
    const minDist = 26;
    if (dist >= minDist || dist < 0.01) return;
    const nx = dx / dist;
    const ny = dy / dist;
    ball.x = c.x + nx * minDist;
    ball.y = c.y + ny * minDist;
    ball.vx += nx * 1.4;
    ball.vy += ny * 1.4;
}

function drawField() {
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#388e3c';
    for (let i = 0; i < canvas.width; i += 40) ctx.fillRect(i, 0, 20, canvas.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 16);
    ctx.lineTo(canvas.width / 2, canvas.height - 16);
    ctx.stroke();

    drawGoal(leftGoal, 'THEM');
    drawGoal(rightGoal, 'YOU');
}

function drawGoal(g, label) {
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(g.x, g.y, g.w, g.h);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(g.x, g.y, g.w, g.h);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, g.x + g.w / 2, g.y - 6);
    ctx.textAlign = 'left';
}

function drawPerson(p, bodyColor, label) {
    ctx.fillStyle = bodyColor;
    ctx.fillRect(p.x + 8, p.y + 16, 18, 20);
    ctx.beginPath();
    ctx.fillStyle = '#f5c6a5';
    ctx.arc(p.x + p.w / 2, p.y + 12, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bodyColor;
    ctx.fillRect(p.x + 10, p.y + 36, 5, 10);
    ctx.fillRect(p.x + 18, p.y + 36, 5, 10);
    ctx.fillStyle = '#111';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, p.x + p.w / 2, p.y - 5);
    ctx.textAlign = 'left';
}

function drawBall() {
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ball.x - 5, ball.y);
    ctx.lineTo(ball.x + 5, ball.y);
    ctx.moveTo(ball.x, ball.y - 5);
    ctx.lineTo(ball.x, ball.y + 5);
    ctx.stroke();
}

function updateOpponents() {
    opponents.forEach((o) => {
        o.kickCd = Math.max(0, o.kickCd - 1);
        const c = centerOf(o);
        const dx = ball.x - c.x;
        const dy = ball.y - c.y;
        const dist = Math.hypot(dx, dy) || 1;

        // Chase ball, bias toward defending right side / attacking left
        let tx = ball.x;
        let ty = ball.y;
        if (ball.x < canvas.width * 0.45) {
            tx = ball.x - 10;
        }
        const mx = tx - c.x;
        const my = ty - c.y;
        const mlen = Math.hypot(mx, my) || 1;
        o.x += (mx / mlen) * o.speed;
        o.y += (my / mlen) * o.speed;
        o.x = clamp(o.x, 50, canvas.width - 90);
        o.y = clamp(o.y, 30, canvas.height - o.h - 12);

        bumpBall(o);

        if (dist < 48 && o.kickCd === 0) {
            // Kick toward Messiah's goal (left)
            const aimX = leftGoal.x + leftGoal.w / 2 - ball.x;
            const aimY = leftGoal.y + leftGoal.h / 2 - ball.y;
            const alen = Math.hypot(aimX, aimY) || 1;
            ball.vx = (aimX / alen) * 6.2;
            ball.vy = (aimY / alen) * 6.2;
            ball.x += (aimX / alen) * 20;
            ball.y += (aimY / alen) * 20;
            o.kickCd = 55;
            $('status').textContent = `${o.name} kicks!`;
        }
    });
}

function inGoal(g, needVxSign) {
    const inside =
        ball.x + ball.r > g.x &&
        ball.x - ball.r < g.x + g.w &&
        ball.y > g.y + 4 &&
        ball.y < g.y + g.h - 4;
    if (!inside || goalCooldown > 0) return false;
    if (needVxSign > 0 && ball.vx <= 0.4) return false;
    if (needVxSign < 0 && ball.vx >= -0.4) return false;
    return true;
}

function scoreGoal(forMessiah) {
    goalCooldown = 90;
    if (forMessiah) {
        messiahGoals += 1;
        $('score').textContent = messiahGoals;
        if (messiahGoals > best) {
            best = messiahGoals;
            localStorage.setItem(KEY, String(best));
            $('best').textContent = best;
        }
        $('status').textContent = 'GOAL! Messiah scores!';
    } else {
        opponentGoals += 1;
        const opp = $('oppScore');
        if (opp) opp.textContent = opponentGoals;
        $('status').textContent = 'Oh no — opponents scored!';
    }
    updateScoreboard();
    resetBall();
    player.x = 140;
    player.y = 160;
    opponents[0].x = 360; opponents[0].y = 100;
    opponents[1].x = 400; opponents[1].y = 180;
    opponents[2].x = 320; opponents[2].y = 220;
}

function updateScoreboard() {
    $('score').textContent = messiahGoals;
    const opp = $('oppScore');
    if (opp) opp.textContent = opponentGoals;
}

function update() {
    if (goalCooldown > 0) goalCooldown -= 1;

    let mx = 0;
    let my = 0;
    if (keys.w || keys.arrowup) my -= 1;
    if (keys.s || keys.arrowdown) my += 1;
    if (keys.a || keys.arrowleft) mx -= 1;
    if (keys.d || keys.arrowright) mx += 1;
    if (mx || my) {
        const len = Math.hypot(mx, my) || 1;
        player.x += (mx / len) * player.speed;
        player.y += (my / len) * player.speed;
    }
    player.x = clamp(player.x, 50, canvas.width - 90);
    player.y = clamp(player.y, 30, canvas.height - player.h - 12);

    bumpBall(player);
    updateOpponents();

    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vx *= 0.988;
    ball.vy *= 0.988;
    if (Math.abs(ball.vx) < 0.04) ball.vx = 0;
    if (Math.abs(ball.vy) < 0.04) ball.vy = 0;

    // Bounce on field borders, but allow goals through the goal mouths
    const inRightMouth = ball.y > rightGoal.y && ball.y < rightGoal.y + rightGoal.h;
    const inLeftMouth = ball.y > leftGoal.y && ball.y < leftGoal.y + leftGoal.h;

    if (ball.x < 26 + ball.r && !inLeftMouth) { ball.x = 26 + ball.r; ball.vx *= -0.55; }
    if (ball.x > canvas.width - 26 - ball.r && !inRightMouth) { ball.x = canvas.width - 26 - ball.r; ball.vx *= -0.55; }
    if (ball.y < 26 + ball.r) { ball.y = 26 + ball.r; ball.vy *= -0.6; }
    if (ball.y > canvas.height - 26 - ball.r) { ball.y = canvas.height - 26 - ball.r; ball.vy *= -0.6; }

    if (inGoal(rightGoal, 1)) scoreGoal(true);
    else if (inGoal(leftGoal, -1)) scoreGoal(false);

    // Keep ball from flying far offscreen past goals
    if (ball.x < -20 || ball.x > canvas.width + 20) resetBall();
}

function loop() {
    if (!running) return;
    update();
    drawField();
    opponents.forEach((o) => drawPerson(o, o.color, o.name));
    drawPerson(player, '#1565c0', 'Messiah');
    drawBall();
    raf = requestAnimationFrame(loop);
}

function endGame() {
    running = false;
    clearInterval(tick);
    cancelAnimationFrame(raf);
    $('status').textContent = `Final: Messiah ${messiahGoals} - ${opponentGoals} Opponents`;
    $('actionBtn').textContent = 'Play Again';
}

$('actionBtn').onclick = () => {
    cancelAnimationFrame(raf);
    clearInterval(tick);
    messiahGoals = 0;
    opponentGoals = 0;
    timeLeft = 60;
    goalCooldown = 0;
    updateScoreboard();
    $('time').textContent = '60';
    player.x = 140;
    player.y = 160;
    opponents[0].x = 360; opponents[0].y = 100; opponents[0].kickCd = 0;
    opponents[1].x = 400; opponents[1].y = 180; opponents[1].kickCd = 0;
    opponents[2].x = 320; opponents[2].y = 220; opponents[2].kickCd = 0;
    resetBall();
    running = true;
    $('actionBtn').textContent = 'Restart';
    $('status').textContent = 'Go Messiah! WASD move, Space to kick (no picking up!).';
    tick = setInterval(() => {
        if (!running) return;
        timeLeft -= 1;
        $('time').textContent = String(timeLeft);
        if (timeLeft <= 0) endGame();
    }, 1000);
    loop();
};

drawField();
opponents.forEach((o) => drawPerson(o, o.color, o.name));
drawPerson(player, '#1565c0', 'Messiah');
drawBall();
