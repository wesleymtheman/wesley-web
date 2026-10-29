const KEY = 'petRescueBest';
const HIDES = ['🏠', '🌳', '🚗', '📦', '🪴', '🏡', '🪨', '🪵', '🏪', '🚪', '🪴', '🌳'];
const PETS = ['🐶', '🐱', '🐰', '🐹', '🦊', '🐸', '🐦', '🐢'];

let score = 0;
let petsLeft = 0;
let best = +localStorage.getItem(KEY) || 0;
let left = 0;
let tick = null;
let running = false;
let spots = [];

const $ = (id) => document.getElementById(id);
$('best').textContent = best;
$('backBtn').onclick = () => { location.href = 'index.html'; };

function clearTimers() {
    clearInterval(tick);
    tick = null;
}

function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function endRescue(won) {
    running = false;
    clearTimers();
    $('area').classList.add('dark');
    if (won) {
        $('status').textContent = `All pets safe! You saved ${score} before dark.`;
    } else {
        $('status').textContent = `Night fell! Saved ${score}, missed ${petsLeft}.`;
    }
    if (score > best) {
        best = score;
        localStorage.setItem(KEY, best);
        $('best').textContent = best;
        $('status').textContent += ' New best!';
    }
    $('actionBtn').textContent = 'Rescue Again';
}

function buildMap() {
    const area = $('area');
    area.innerHTML = '';
    area.classList.remove('dark', 'dusk');
    spots = shuffle(HIDES).slice(0, 12);
    const petCount = 5;
    const petIndexes = shuffle([...Array(12).keys()]).slice(0, petCount);
    petsLeft = petCount;
    $('leftPets').textContent = petsLeft;

    spots.forEach((cover, i) => {
        const hasPet = petIndexes.includes(i);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pet-spot';
        btn.dataset.open = '0';
        btn.innerHTML = `<span class="pet-cover">${cover}</span><span class="pet-found" hidden></span>`;
        btn.onclick = () => {
            if (!running || btn.dataset.open === '1') return;
            btn.dataset.open = '1';
            btn.classList.add('opened');
            const found = btn.querySelector('.pet-found');
            if (hasPet) {
                const pet = PETS[Math.floor(Math.random() * PETS.length)];
                found.hidden = false;
                found.textContent = pet;
                btn.querySelector('.pet-cover').hidden = true;
                score += 1;
                petsLeft -= 1;
                $('score').textContent = score;
                $('leftPets').textContent = petsLeft;
                $('status').textContent = `Found a ${pet}! ${petsLeft} left.`;
                if (petsLeft <= 0) endRescue(true);
            } else {
                found.hidden = false;
                found.textContent = '💨';
                btn.querySelector('.pet-cover').hidden = true;
                $('status').textContent = 'Nobody here — keep looking!';
            }
        };
        area.appendChild(btn);
    });
}

$('actionBtn').onclick = () => {
    clearTimers();
    running = true;
    score = 0;
    left = 25;
    $('score').textContent = '0';
    $('time').textContent = left;
    $('status').textContent = 'Find the pets before it gets dark!';
    $('actionBtn').textContent = 'Searching...';
    buildMap();
    tick = setInterval(() => {
        left -= 1;
        $('time').textContent = Math.max(0, left);
        if (left <= 8) $('area').classList.add('dusk');
        if (left <= 0) endRescue(false);
    }, 1000);
};
