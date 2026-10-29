// Math Blitz — harder with higher grade
const KEY = 'mathBlitzBest';
const $ = (id) => document.getElementById(id);
let answer = 0;
let score = 0;
let best = Number(localStorage.getItem(KEY) || 0);
$('best').textContent = best;
$('backBtn').onclick = () => { location.href = 'educational.html'; };

function problem() {
    const level = difficultyLevel();
    // K: + to 5; 1: +/− to 10; 2: +/− to 20; 3: × intro; 4: × to 10; 5: × to 12 + mixed
    let a, b, op;
    if (level <= 0) {
        a = 1 + Math.floor(Math.random() * 5);
        b = 1 + Math.floor(Math.random() * 5);
        op = '+';
    } else if (level === 1) {
        a = 1 + Math.floor(Math.random() * 10);
        b = 1 + Math.floor(Math.random() * 10);
        op = Math.random() < 0.5 ? '+' : '-';
    } else if (level === 2) {
        a = 1 + Math.floor(Math.random() * 20);
        b = 1 + Math.floor(Math.random() * 20);
        op = Math.random() < 0.55 ? '+' : '-';
    } else if (level === 3) {
        a = 1 + Math.floor(Math.random() * 6);
        b = 1 + Math.floor(Math.random() * 6);
        op = ['+', '-', '×'][Math.floor(Math.random() * 3)];
    } else if (level === 4) {
        a = 2 + Math.floor(Math.random() * 9);
        b = 2 + Math.floor(Math.random() * 9);
        op = Math.random() < 0.7 ? '×' : (Math.random() < 0.5 ? '+' : '-');
        if (op !== '×') { a = 10 + Math.floor(Math.random() * 40); b = 10 + Math.floor(Math.random() * 40); }
    } else {
        a = 2 + Math.floor(Math.random() * 12);
        b = 2 + Math.floor(Math.random() * 12);
        op = ['+', '-', '×'][Math.floor(Math.random() * 3)];
        if (op !== '×') { a = 20 + Math.floor(Math.random() * 80); b = 10 + Math.floor(Math.random() * 50); }
    }

    if (op === '+') {
        answer = a + b;
        $('display').textContent = `${a} + ${b} = ?`;
    } else if (op === '-') {
        const x = Math.max(a, b);
        const y = Math.min(a, b);
        answer = x - y;
        $('display').textContent = `${x} - ${y} = ?`;
    } else {
        answer = a * b;
        $('display').textContent = `${a} × ${b} = ?`;
    }
    $('answerInput').value = '';
    $('status').textContent = getSavedGrade() ? `Grade ${GRADE_LABELS[getSavedGrade()] || getSavedGrade()} challenge!` : 'Pick a grade for the right level.';
}

$('actionBtn').onclick = problem;
$('submitBtn').onclick = () => {
    const v = Number($('answerInput').value);
    if (Number.isNaN(v)) { $('status').textContent = 'Enter a number'; return; }
    if (v === answer) {
        score += 1;
        $('score').textContent = score;
        if (score > best) { best = score; localStorage.setItem(KEY, String(best)); $('best').textContent = best; }
        $('status').textContent = 'Correct!';
        problem();
    } else {
        $('status').textContent = 'Try again';
    }
};

ensureGradeUI({ onChange: () => { score = 0; $('score').textContent = '0'; problem(); } });
problem();
