// Word Scramble — harder words with higher grade
const KEY = 'wordScrambleBest';
const WORDS = {
    0: ['CAT', 'DOG', 'SUN', 'BED', 'BUS', 'RED'],
    1: ['FISH', 'BOOK', 'BALL', 'TREE', 'CAKE', 'HOME'],
    2: ['APPLE', 'HAPPY', 'WATER', 'GREEN', 'SCHOOL', 'FRIEND'],
    3: ['PLANET', 'ROCKET', 'BANANA', 'CASTLE', 'ANIMAL', 'PURPLE'],
    4: ['GUITAR', 'OCEAN', 'SCIENCE', 'HISTORY', 'WEATHER', 'JOURNEY'],
    5: ['ANALYZE', 'EQUATION', 'MOUNTAIN', 'GEOMETRY', 'CITIZEN', 'DIGEST']
};
const $ = (id) => document.getElementById(id);
let word = '';
let score = 0;
let best = Number(localStorage.getItem(KEY) || 0);
$('best').textContent = best;
$('backBtn').onclick = () => { location.href = 'educational.html'; };

function scramble(w) {
    const a = w.split('');
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    const s = a.join('');
    return s === w ? scramble(w) : s;
}

function next() {
    const level = difficultyLevel();
    const list = WORDS[level] || WORDS[2];
    word = list[Math.floor(Math.random() * list.length)];
    $('display').textContent = scramble(word);
    $('answerInput').value = '';
    $('status').textContent = getSavedGrade() ? 'Unscramble it!' : 'Pick a grade for harder/easier words.';
}

$('actionBtn').onclick = next;
$('submitBtn').onclick = () => {
    const g = $('answerInput').value.trim().toUpperCase();
    if (g === word) {
        score += 1;
        $('score').textContent = score;
        if (score > best) { best = score; localStorage.setItem(KEY, String(best)); $('best').textContent = best; }
        $('status').textContent = 'Yes! ' + word;
        next();
    } else {
        $('status').textContent = 'Not quite';
    }
};

ensureGradeUI({ onChange: () => { score = 0; $('score').textContent = '0'; next(); } });
next();
