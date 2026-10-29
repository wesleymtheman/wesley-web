// Times Tables — harder with higher grade
const KEY = 'timesTablesBest';
const $ = (id) => document.getElementById(id);
let answer = 0;
let score = 0;
let best = Number(localStorage.getItem(KEY) || 0);
$('best').textContent = best;
$('backBtn').onclick = () => { location.href = 'educational.html'; };

function next() {
    const level = difficultyLevel();
    // K/1: doubles & small; higher grades expand factors
    let maxA, maxB;
    if (level <= 0) { maxA = 5; maxB = 2; }
    else if (level === 1) { maxA = 5; maxB = 5; }
    else if (level === 2) { maxA = 10; maxB = 5; }
    else if (level === 3) { maxA = 10; maxB = 10; }
    else if (level === 4) { maxA = 12; maxB = 10; }
    else { maxA = 12; maxB = 12; }

    const a = 1 + Math.floor(Math.random() * maxA);
    const b = 1 + Math.floor(Math.random() * maxB);
    answer = a * b;
    $('display').textContent = `${a} × ${b} = ?`;
    $('answerInput').value = '';
    $('status').textContent = getSavedGrade() ? `Up to ${maxA}×${maxB}` : 'Pick a grade for the right level.';
}

$('actionBtn').onclick = next;
$('submitBtn').onclick = () => {
    const v = Number($('answerInput').value);
    if (Number.isNaN(v)) { $('status').textContent = 'Enter a number'; return; }
    if (v === answer) {
        score += 1;
        $('score').textContent = score;
        if (score > best) { best = score; localStorage.setItem(KEY, String(best)); $('best').textContent = best; }
        $('status').textContent = 'Nice!';
        next();
    } else {
        $('status').textContent = 'Try again';
    }
};

ensureGradeUI({ onChange: () => { score = 0; $('score').textContent = '0'; next(); } });
next();
