// Alphabet Order — more letters / wider alphabet with grade
const KEY = 'alphabetOrderBest';
const $ = (id) => document.getElementById(id);
let answer = '';
let score = 0;
let best = Number(localStorage.getItem(KEY) || 0);
$('best').textContent = best;
$('backBtn').onclick = () => { location.href = 'educational.html'; };

function next() {
    const level = difficultyLevel();
    const count = [3, 3, 4, 4, 5, 6][level] || 3;
    const alphabetSize = level <= 1 ? 10 : 26; // K-1 mostly early letters
    const letters = [];
    while (letters.length < count) {
        const L = String.fromCharCode(65 + Math.floor(Math.random() * alphabetSize));
        if (!letters.includes(L)) letters.push(L);
    }
    answer = letters.slice().sort().join('');
    $('display').textContent = letters.join(' ');
    $('answerInput').value = '';
    $('status').textContent = getSavedGrade()
        ? `Put ${count} letters in ABC order`
        : 'Pick a grade for the right level.';
}

$('actionBtn').onclick = next;
$('submitBtn').onclick = () => {
    const g = $('answerInput').value.trim().toUpperCase().replace(/\s+/g, '');
    if (g === answer) {
        score += 1;
        $('score').textContent = score;
        if (score > best) { best = score; localStorage.setItem(KEY, String(best)); $('best').textContent = best; }
        $('status').textContent = 'Yes! ' + answer;
        next();
    } else {
        $('status').textContent = 'Not yet - think ABC';
    }
};

ensureGradeUI({ onChange: () => { score = 0; $('score').textContent = '0'; next(); } });
next();
