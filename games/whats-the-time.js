const KEY = 'whatsTheTimeBest';
const GOAL = 12;

let best = +localStorage.getItem(KEY) || 0;
let running = false;
let chasing = false;
let position = 0; // steps toward Mr. Clock (0 far, GOAL = reach)
let rounds = 0;
let totalSteps = 0;
let chaseTime = 0;
let escapeMeter = 0;
let chaseTick = null;

const $ = (id) => document.getElementById(id);
$('best').textContent = best;
$('backBtn').onclick = () => { location.href = 'index.html'; };

function setHands(hour, minute) {
    // 12-hour face: hour hand 30deg per hour + 0.5 per minute
    const h = ((hour % 12) + minute / 60) * 30;
    const m = minute * 6;
    $('hourHand').style.transform = `translateX(-50%) rotate(${h}deg)`;
    $('minuteHand').style.transform = `translateX(-50%) rotate(${m}deg)`;
}

function updatePath() {
    const away = Math.max(0, GOAL - position);
    $('away').textContent = away;
    $('steps').textContent = totalSteps;
    $('rounds').textContent = rounds;
    $('player').style.left = `${8 + (position / GOAL) * 72}%`;
    $('clockFace').classList.toggle('near', position >= GOAL - 3);
}

function clearChase() {
    clearInterval(chaseTick);
    chaseTick = null;
    chasing = false;
    $('runBtn').disabled = true;
    $('stage').classList.remove('chasing');
}

function endWin() {
    running = false;
    clearChase();
    $('askBtn').disabled = true;
    $('actionBtn').disabled = false;
    $('actionBtn').textContent = 'Play Again';
    $('speech').textContent = 'You made it to Mr. Clock!';
    $('status').textContent = `Safe! ${rounds} rounds · ${totalSteps} steps.`;
    if (rounds > best) {
        best = rounds;
        localStorage.setItem(KEY, best);
        $('best').textContent = best;
        $('status').textContent += ' New best!';
    }
}

function endLose() {
    running = false;
    clearChase();
    $('askBtn').disabled = true;
    $('actionBtn').disabled = false;
    $('actionBtn').textContent = 'Try Again';
    $('speech').textContent = 'TICK TOCK — caught!';
    $('status').textContent = `Mr. Clock got you after ${rounds} rounds.`;
    if (rounds > best) {
        best = rounds;
        localStorage.setItem(KEY, best);
        $('best').textContent = best;
        $('status').textContent += ' Still a new best rounds!';
    }
}

function startChase() {
    chasing = true;
    chaseTime = 20;
    escapeMeter = 0;
    $('askBtn').disabled = true;
    $('runBtn').disabled = false;
    $('stage').classList.add('chasing');
    setHands(12, 0);
    $('speech').textContent = 'MIDNIGHT!!!';
    $('status').textContent = 'Mash RUN to escape!';
    clearInterval(chaseTick);
    chaseTick = setInterval(() => {
        if (!chasing) return;
        chaseTime -= 1;
        $('status').textContent = chaseTime > 0
            ? `Mash RUN! Escape ${Math.min(100, Math.round(escapeMeter))}% · ${chaseTime}`
            : 'Too slow…';
        if (chaseTime <= 0) endLose();
    }, 260);
}

function takeSteps(n) {
    position = Math.min(GOAL, position + n);
    totalSteps += n;
    updatePath();
    if (position >= GOAL) {
        endWin();
        return true;
    }
    return false;
}

function askTime() {
    if (!running || chasing) return;
    rounds += 1;
    $('rounds').textContent = rounds;

    // ~22% chance of Midnight once you've asked a few times
    const midnight = rounds > 2 && Math.random() < 0.22 + Math.min(0.2, rounds * 0.015);
    if (midnight) {
        startChase();
        return;
    }

    const hour = 1 + Math.floor(Math.random() * 12);
    setHands(hour, 0);
    $('speech').textContent = `${hour} o'clock!`;
    $('status').textContent = `Take ${hour} step${hour === 1 ? '' : 's'}…`;
    $('askBtn').disabled = true;

    let left = hour;
    const stepTimer = setInterval(() => {
        if (!running) {
            clearInterval(stepTimer);
            return;
        }
        left -= 1;
        const done = takeSteps(1);
        if (done) {
            clearInterval(stepTimer);
            return;
        }
        if (left <= 0) {
            clearInterval(stepTimer);
            $('status').textContent = 'Ask again… or will it be Midnight?';
            $('askBtn').disabled = false;
        }
    }, 280);
}

$('actionBtn').onclick = () => {
    clearChase();
    running = true;
    chasing = false;
    position = 0;
    rounds = 0;
    totalSteps = 0;
    setHands(12, 0);
    updatePath();
    $('speech').textContent = 'What’s the time, Mr. Clock?';
    $('status').textContent = 'Ask Mr. Clock — step closer — RUN at Midnight!';
    $('askBtn').disabled = false;
    $('runBtn').disabled = true;
    $('actionBtn').disabled = true;
    $('actionBtn').textContent = 'Playing…';
};

$('askBtn').onclick = askTime;

$('runBtn').onclick = () => {
    if (!chasing || !running) return;
    escapeMeter += 7 + Math.random() * 4;
    position = Math.max(0, position - 0.3);
    updatePath();
    if (escapeMeter >= 100) {
        clearChase();
        $('speech').textContent = 'You escaped the midnight chase!';
        $('status').textContent = 'Phew! Ask the time again.';
        $('askBtn').disabled = false;
        setHands(3, 0);
    } else {
        $('status').textContent = `Mash RUN! Escape ${Math.min(100, Math.round(escapeMeter))}% · ${chaseTime}`;
    }
};

updatePath();
setHands(10, 10);
