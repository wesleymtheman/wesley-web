// Spelling Bee
// WesleyDude.com

const GRADE_KEY = 'wesleyGrade';
const BEST_KEY = 'spellingBeeBest';

const WORDS_BY_GRADE = {
    K: [
        { w: 'CAT', h: 'A pet that says meow' },
        { w: 'DOG', h: 'A pet that barks' },
        { w: 'SUN', h: 'Bright in the sky in the day' },
        { w: 'BED', h: 'Where you sleep' },
        { w: 'RED', h: 'A color like an apple' },
        { w: 'BUS', h: 'A big yellow school ride' }
    ],
    1: [
        { w: 'FISH', h: 'Lives in water and swims' },
        { w: 'BOOK', h: 'You read this at school' },
        { w: 'BALL', h: 'You can throw or kick this' },
        { w: 'TREE', h: 'Tall plant with leaves' },
        { w: 'CAKE', h: 'Sweet dessert for birthdays' },
        { w: 'HOME', h: 'Where your family lives' }
    ],
    2: [
        { w: 'APPLE', h: 'A red or green fruit teachers love' },
        { w: 'HAPPY', h: 'How you feel when you smile' },
        { w: 'WATER', h: 'You drink this every day' },
        { w: 'SCHOOL', h: 'Where you learn every day' },
        { w: 'FRIEND', h: 'Someone you like to play with' },
        { w: 'GREEN', h: 'Color of grass' }
    ],
    3: [
        { w: 'PLANET', h: 'Earth is one of these' },
        { w: 'ROCKET', h: 'Flies into space' },
        { w: 'BANANA', h: 'A yellow fruit monkeys like' },
        { w: 'PURPLE', h: 'A color between blue and red' },
        { w: 'CASTLE', h: 'A big stone home for kings' },
        { w: 'ANIMAL', h: 'A living creature like a dog or bird' }
    ],
    4: [
        { w: 'GUITAR', h: 'An instrument with strings' },
        { w: 'OCEAN', h: 'A huge body of salt water' },
        { w: 'SCIENCE', h: 'A school subject about how things work' },
        { w: 'HISTORY', h: 'Learning about the past' },
        { w: 'JOURNEY', h: 'A long trip from one place to another' },
        { w: 'WEATHER', h: 'Rain, sun, wind, and snow' }
    ],
    5: [
        { w: 'ANALYZE', h: 'To look closely and figure something out' },
        { w: 'EQUATION', h: 'A math sentence with an equals sign' },
        { w: 'MOUNTAIN', h: 'A very tall landform' },
        { w: 'CITIZEN', h: 'A member of a country or community' },
        { w: 'DIGEST', h: 'What your body does with food' },
        { w: 'GEOMETRY', h: 'Math about shapes and angles' }
    ]
};

const $ = (id) => document.getElementById(id);

let grade = localStorage.getItem(GRADE_KEY) || '';
let cur = null;
let score = 0;
let best = Number(localStorage.getItem(BEST_KEY) || 0);
let waitingForNext = false;

$('best').textContent = best;

function setEnabled(on) {
    $('answerInput').disabled = !on;
    $('submitBtn').disabled = !on;
    $('actionBtn').disabled = !on;
}

function wordList() {
    return WORDS_BY_GRADE[grade] || WORDS_BY_GRADE['2'];
}

function updateGradeUI() {
    const labels = { K: 'K', 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th' };
    $('gradeLabel').textContent = grade ? (labels[grade] || grade) : '-';
    if (grade) $('gradeSelect').value = grade;
}

function nextWord() {
    if (!grade) {
        $('display').textContent = 'Pick your grade to start';
        $('status').textContent = 'Choose a grade first.';
        setEnabled(false);
        return;
    }
    const list = wordList();
    cur = list[Math.floor(Math.random() * list.length)];
    waitingForNext = false;
    $('display').textContent = 'Hint: ' + cur.h;
    $('answerInput').value = '';
    $('answerInput').disabled = false;
    $('submitBtn').disabled = false;
    $('actionBtn').disabled = false;
    $('submitBtn').textContent = 'Check';
    $('status').textContent = 'Spell it!';
    $('answerInput').focus();
}

function checkSpelling() {
    if (!grade) {
        $('status').textContent = 'Pick your grade first!';
        return;
    }
    if (waitingForNext) {
        nextWord();
        return;
    }
    if (!cur) {
        nextWord();
        return;
    }

    const guess = $('answerInput').value.trim().toUpperCase();
    if (!guess) {
        $('status').textContent = 'Type a word first.';
        $('answerInput').focus();
        return;
    }

    if (guess === cur.w) {
        score += 1;
        $('score').textContent = String(score);
        if (score > best) {
            best = score;
            localStorage.setItem(BEST_KEY, String(best));
            $('best').textContent = String(best);
        }
        $('status').textContent = 'Correct! ' + cur.w;
        $('display').textContent = cur.w;
        waitingForNext = true;
        $('submitBtn').textContent = 'Next Word';
        $('answerInput').disabled = true;
    } else {
        $('status').textContent = 'Not quite - try again!';
        $('answerInput').focus();
        $('answerInput').select();
    }
}

$('backBtn').addEventListener('click', () => {
    window.location.href = 'educational.html';
});

$('gradeSelect').addEventListener('change', () => {
    grade = $('gradeSelect').value;
    if (!grade) {
        localStorage.removeItem(GRADE_KEY);
        updateGradeUI();
        setEnabled(false);
        cur = null;
        $('display').textContent = 'Pick your grade to start';
        $('status').textContent = 'Choose a grade first.';
        return;
    }
    localStorage.setItem(GRADE_KEY, grade);
    score = 0;
    $('score').textContent = '0';
    updateGradeUI();
    setEnabled(true);
    $('status').textContent = 'Grade saved! Here is your first word.';
    nextWord();
});

$('actionBtn').addEventListener('click', (e) => {
    e.preventDefault();
    nextWord();
});

$('submitBtn').addEventListener('click', (e) => {
    e.preventDefault();
    checkSpelling();
});

$('answerInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkSpelling();
    }
});

updateGradeUI();
if (grade) {
    setEnabled(true);
    nextWord();
} else {
    setEnabled(false);
}
