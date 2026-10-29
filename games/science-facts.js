// Science Facts — question pools by grade band
const KEY = 'scienceFactsBest';
const BANK = {
    easy: [
        { q: 'What do plants need to make food?', a: ['Sunlight', 'Socks', 'Video games'], c: 0 },
        { q: 'Which planet do we live on?', a: ['Mars', 'Earth', 'Jupiter'], c: 1 },
        { q: 'What gas do we breathe in?', a: ['Oxygen', 'Helium', 'Smoke'], c: 0 },
        { q: 'The Sun is a...', a: ['Planet', 'Star', 'Moon'], c: 1 },
        { q: 'Rain comes from...', a: ['Clouds', 'Toasters', 'Shoes'], c: 0 },
        { q: 'Bones help you...', a: ['Stand up', 'Sleep only', 'Float in space'], c: 0 }
    ],
    medium: [
        { q: 'Water freezes at what Celsius?', a: ['0°', '100°', '50°'], c: 0 },
        { q: 'Insects usually have how many legs?', a: ['4', '6', '8'], c: 1 },
        { q: 'Which animal is a mammal?', a: ['Shark', 'Whale', 'Goldfish'], c: 1 },
        { q: 'Magnets attract...', a: ['Wood', 'Iron', 'Plastic'], c: 1 },
        { q: 'Your heart pumps...', a: ['Blood', 'Air only', 'Juice'], c: 0 },
        { q: 'A tadpole grows into a...', a: ['Frog', 'Bird', 'Cat'], c: 0 }
    ],
    hard: [
        { q: 'Photosynthesis mainly happens in the...', a: ['Leaves', 'Roots only', 'Bones'], c: 0 },
        { q: 'Earth orbits the...', a: ['Moon', 'Sun', 'Mars'], c: 1 },
        { q: 'Sound travels as a...', a: ['Wave', 'Color', 'Smell'], c: 0 },
        { q: 'Gravity pulls objects...', a: ['Upward', 'Toward Earth', 'Sideways only'], c: 1 },
        { q: 'Water boiling point in Celsius is about...', a: ['0°', '50°', '100°'], c: 2 },
        { q: 'Cells are the building blocks of...', a: ['Living things', 'Rocks only', 'Clouds only'], c: 0 }
    ]
};
const $ = (id) => document.getElementById(id);
let cur = null;
let score = 0;
let best = Number(localStorage.getItem(KEY) || 0);
$('best').textContent = best;
$('backBtn').onclick = () => { location.href = 'educational.html'; };

function pool() {
    const level = difficultyLevel();
    if (level <= 1) return BANK.easy;
    if (level <= 3) return [...BANK.easy, ...BANK.medium];
    return [...BANK.medium, ...BANK.hard];
}

function next() {
    const list = pool();
    cur = list[Math.floor(Math.random() * list.length)];
    $('display').textContent = cur.q;
    $('status').textContent = getSavedGrade() ? 'Choose one' : 'Pick a grade for harder questions.';
    const box = $('choices');
    box.innerHTML = '';
    cur.a.forEach((text, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'choice-btn';
        b.style.minWidth = '120px';
        b.style.fontSize = '1rem';
        b.style.padding = '0.75rem 1rem';
        b.textContent = text;
        b.onclick = () => {
            if (i === cur.c) {
                score += 1;
                $('score').textContent = score;
                if (score > best) { best = score; localStorage.setItem(KEY, String(best)); $('best').textContent = best; }
                $('status').textContent = 'Smart!';
                setTimeout(next, 450);
            } else {
                $('status').textContent = 'Nope - try another';
            }
        };
        box.appendChild(b);
    });
}

$('actionBtn').onclick = next;
ensureGradeUI({ onChange: () => { score = 0; $('score').textContent = '0'; next(); } });
next();
