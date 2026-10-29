// Counting Quiz — higher grades count more / trickier groups
const KEY = 'countingQuizBest';
const ICONS = ['⭐', '🍎', '🐶', '🎈', '🟢', '📘', '🐸', '🚗'];
const $ = (id) => document.getElementById(id);
let answer = 0;
let score = 0;
let best = Number(localStorage.getItem(KEY) || 0);
$('best').textContent = best;
$('backBtn').onclick = () => { location.href = 'educational.html'; };

function next() {
    const level = difficultyLevel();
    const max = [5, 7, 10, 12, 15, 20][level] || 10;
    const min = level >= 4 ? 6 : 1;
    const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
    answer = min + Math.floor(Math.random() * (max - min + 1));
    $('display').textContent = icon.repeat(answer);
    $('display').style.fontSize = answer > 12 ? '1.35rem' : '2rem';
    $('answerInput').value = '';
    $('status').textContent = getSavedGrade() ? `Count up to ${max}` : 'Pick a grade for the right level.';
}

$('actionBtn').onclick = next;
$('submitBtn').onclick = () => {
    const v = Number($('answerInput').value);
    if (v === answer) {
        score += 1;
        $('score').textContent = score;
        if (score > best) { best = score; localStorage.setItem(KEY, String(best)); $('best').textContent = best; }
        $('status').textContent = 'Correct!';
        next();
    } else {
        $('status').textContent = 'Count again';
    }
};

ensureGradeUI({ onChange: () => { score = 0; $('score').textContent = '0'; next(); } });
next();
