const KEY = 'dragonQuestBest';
let score = 0;
let treasure = 0;
let best = +localStorage.getItem(KEY) || 0;
let left = 0;
let spawn = null;
let tick = null;
let running = false;

const $ = (id) => document.getElementById(id);
$('best').textContent = best;
$('backBtn').onclick = () => { location.href = 'index.html'; };

function clearTimers() {
    clearInterval(spawn);
    clearInterval(tick);
    spawn = null;
    tick = null;
}

function spawnThing() {
    if (!running) return;
    const area = $('area');
    const isDragon = Math.random() < 0.62;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = isDragon ? 'quest-item dragon' : 'quest-item loot';
    btn.textContent = isDragon
        ? ['🐉', '🐲', '🔥'][Math.floor(Math.random() * 3)]
        : ['💰', '💎', '👑', '🪙'][Math.floor(Math.random() * 4)];
    btn.style.left = (8 + Math.random() * 84) + '%';
    btn.style.top = (12 + Math.random() * 72) + '%';
    btn.onclick = () => {
        if (!running) return;
        if (isDragon) {
            score += 10;
            $('status').textContent = 'Dragon defeated! +10';
        } else {
            treasure += 1;
            score += 5;
            $('treasure').textContent = treasure;
            $('status').textContent = 'Treasure grabbed! +5';
        }
        $('score').textContent = score;
        btn.remove();
    };
    area.appendChild(btn);
    setTimeout(() => btn.remove(), 1600);
}

function endQuest() {
    running = false;
    clearTimers();
    $('status').textContent = `Quest over! Score ${score} · Treasure ${treasure}`;
    if (score > best) {
        best = score;
        localStorage.setItem(KEY, best);
        $('best').textContent = best;
        $('status').textContent += ' — new best!';
    }
    $('actionBtn').textContent = 'Play Again';
}

$('actionBtn').onclick = () => {
    clearTimers();
    $('area').innerHTML = '';
    running = true;
    score = 0;
    treasure = 0;
    left = 30;
    $('score').textContent = '0';
    $('treasure').textContent = '0';
    $('time').textContent = left;
    $('status').textContent = 'Fight dragons — grab treasure!';
    $('actionBtn').textContent = 'Questing...';
    spawnThing();
    spawn = setInterval(spawnThing, 520);
    tick = setInterval(() => {
        left -= 1;
        $('time').textContent = Math.max(0, left);
        if (left <= 0) endQuest();
    }, 1000);
};
