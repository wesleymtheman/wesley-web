const KEY = 'dunkContestBest';
let score = 0;
let rival = 0;
let best = +localStorage.getItem(KEY) || 0;
let clock = 24;
let round = 0;
let maxRounds = 6;
let running = false;
let meterPos = 0;
let meterDir = 1;
let meterRaf = null;
let clockTick = null;
let sweetStart = 58;
let sweetSize = 16;

const $ = (id) => document.getElementById(id);
$('best').textContent = best;
$('backBtn').onclick = () => { location.href = 'index.html'; };

function clearLoops() {
    if (meterRaf) cancelAnimationFrame(meterRaf);
    meterRaf = null;
    clearInterval(clockTick);
    clockTick = null;
}

function placeSweetSpot() {
    sweetSize = 12 + Math.floor(Math.random() * 10);
    sweetStart = 20 + Math.floor(Math.random() * (70 - sweetSize));
    const sweet = $('sweetSpot');
    sweet.style.left = sweetStart + '%';
    sweet.style.width = sweetSize + '%';
}

function animateMeter() {
    if (!running) return;
    const speed = 1.4 + round * 0.18;
    meterPos += meterDir * speed;
    if (meterPos >= 100) { meterPos = 100; meterDir = -1; }
    if (meterPos <= 0) { meterPos = 0; meterDir = 1; }
    $('meterFill').style.width = meterPos + '%';
    meterRaf = requestAnimationFrame(animateMeter);
}

function rivalDunk() {
    const chance = 0.35 + round * 0.05;
    if (Math.random() < chance) {
        rival += 2;
        $('rival').textContent = rival;
        return 'Rivals dunked for 2!';
    }
    return 'Rivals missed!';
}

function endContest() {
    running = false;
    clearLoops();
    $('dunkBtn').disabled = true;
    $('actionBtn').disabled = false;
    $('actionBtn').textContent = 'Play Again';
    let msg = score > rival ? `You win the dunk contest ${score}-${rival}!` :
        score < rival ? `Rivals win ${rival}-${score}. Try again!` :
        `Tie game ${score}-${rival}!`;
    if (score > best) {
        best = score;
        localStorage.setItem(KEY, best);
        $('best').textContent = best;
        msg += ' New best score!';
    }
    $('status').textContent = msg;
}

function nextRound() {
    round += 1;
    if (round > maxRounds) {
        endContest();
        return;
    }
    clock = 24;
    meterPos = 0;
    meterDir = 1;
    $('clock').textContent = clock;
    placeSweetSpot();
    $('status').textContent = `Round ${round}/${maxRounds} — dunk in the green before the shot clock!`;
    $('dunkBtn').disabled = false;
    clearInterval(clockTick);
    clockTick = setInterval(() => {
        clock -= 1;
        $('clock').textContent = Math.max(0, clock);
        if (clock <= 0) {
            $('dunkBtn').disabled = true;
            const rivalMsg = rivalDunk();
            $('status').textContent = `Shot clock violation! ${rivalMsg}`;
            setTimeout(nextRound, 900);
        }
    }, 1000);
}

$('actionBtn').onclick = () => {
    clearLoops();
    running = true;
    score = 0;
    rival = 0;
    round = 0;
    $('score').textContent = '0';
    $('rival').textContent = '0';
    $('actionBtn').disabled = true;
    $('actionBtn').textContent = 'Contesting...';
    $('dunkBtn').disabled = false;
    placeSweetSpot();
    animateMeter();
    nextRound();
};

$('dunkBtn').onclick = () => {
    if (!running || $('dunkBtn').disabled) return;
    $('dunkBtn').disabled = true;
    clearInterval(clockTick);
    clockTick = null;

    const inSweet = meterPos >= sweetStart && meterPos <= sweetStart + sweetSize;
    const close = Math.abs(meterPos - (sweetStart + sweetSize / 2)) < sweetSize;

    if (inSweet) {
        score += 3;
        $('ball').classList.remove('miss');
        $('ball').classList.add('swish');
        $('status').textContent = 'Poster dunk! +3 🔥';
    } else if (close) {
        score += 1;
        $('ball').classList.remove('miss');
        $('ball').classList.add('swish');
        $('status').textContent = 'Rim grazer dunk +1';
    } else {
        $('ball').classList.remove('swish');
        $('ball').classList.add('miss');
        $('status').textContent = 'Airball!';
    }
    $('score').textContent = score;

    setTimeout(() => {
        $('ball').classList.remove('swish', 'miss');
        const rivalMsg = rivalDunk();
        $('status').textContent += ` · ${rivalMsg}`;
        setTimeout(nextRound, 700);
    }, 450);
};
