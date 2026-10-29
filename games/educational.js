// Educational games hub
// WesleyDude.com

const EDUCATIONAL_CATALOG = [
    { file: 'math-blitz.html', id: 'math-blitz', icon: '➕', title: 'Math Blitz', blurb: 'Solve quick math problems for points.', difficulty: 'Medium' },
    { file: 'word-scramble.html', id: 'word-scramble', icon: '🔤', title: 'Word Scramble', blurb: 'Unscramble the letters to make a word.', difficulty: 'Easy' },
    { file: 'spelling-bee.html', id: 'spelling-bee', icon: '🐝', title: 'Spelling Bee', blurb: 'Read the hint and spell the word.', difficulty: 'Easy' },
    { file: 'times-tables.html', id: 'times-tables', icon: '✖️', title: 'Times Tables', blurb: 'Practice multiplication facts fast.', difficulty: 'Easy' },
    { file: 'alphabet-order.html', id: 'alphabet-order', icon: '🔠', title: 'Alphabet Order', blurb: 'Put the letters in ABC order.', difficulty: 'Easy' },
    { file: 'counting-quiz.html', id: 'counting-quiz', icon: '🔢', title: 'Counting Quiz', blurb: 'Count the emoji and type how many.', difficulty: 'Easy' },
    { file: 'science-facts.html', id: 'science-facts', icon: '🔬', title: 'Science Facts', blurb: 'Pick the right science answer.', difficulty: 'Easy' },
    { file: 'geography-quiz.html', id: 'geography-quiz', icon: '🌍', title: 'Geography Quiz', blurb: 'Learn places around the world.', difficulty: 'Easy' }
];

function renderEducationalHub() {
    const container = document.getElementById('eduGamesContainer');
    if (container) {
        container.innerHTML = EDUCATIONAL_CATALOG.map(g => `
            <article class="game-card" data-game="${g.id}">
                <div class="game-preview"><div class="game-icon">${g.icon}</div></div>
                <div class="game-info">
                    <h3>${g.title}</h3>
                    <p>${g.blurb}</p>
                    <div class="game-stats">
                        <span class="difficulty">${g.difficulty}</span>
                        <span class="category">Educational</span>
                    </div>
                    <a href="${g.file}" class="btn btn-primary play-btn">Play</a>
                </div>
            </article>
        `).join('');
    }

    const gradeSelect = document.getElementById('gradeSelectHome');
    const gradeMsg = document.getElementById('gradeSavedMsg');
    const labels = { K: 'Kindergarten', 1: '1st Grade', 2: '2nd Grade', 3: '3rd Grade', 4: '4th Grade', 5: '5th Grade' };
    if (gradeSelect) {
        const saved = localStorage.getItem('wesleyGrade') || '';
        if (saved) {
            gradeSelect.value = saved;
            if (gradeMsg) gradeMsg.textContent = 'Saved: ' + (labels[saved] || saved);
        }
        gradeSelect.addEventListener('change', () => {
            const value = gradeSelect.value;
            if (!value) {
                localStorage.removeItem('wesleyGrade');
                if (gradeMsg) gradeMsg.textContent = '';
                return;
            }
            localStorage.setItem('wesleyGrade', value);
            if (gradeMsg) gradeMsg.textContent = 'Saved: ' + (labels[value] || value);
        });
    }

    const randomBtn = document.getElementById('randomEduBtn');
    if (randomBtn && !randomBtn.dataset.bound) {
        randomBtn.dataset.bound = '1';
        randomBtn.addEventListener('click', () => {
            const pick = EDUCATIONAL_CATALOG[Math.floor(Math.random() * EDUCATIONAL_CATALOG.length)];
            window.location.href = pick.file;
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderEducationalHub);
} else {
    renderEducationalHub();
}
