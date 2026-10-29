// Geography Quiz — harder questions with higher grade
const KEY = 'geographyQuizBest';
const BANK = {
    easy: [
        { q: 'Maps help you find...', a: ['Places', 'Dreams only', 'Cookies'], c: 0 },
        { q: 'Which planet do we live on?', a: ['Mars', 'Earth', 'Saturn'], c: 1 },
        { q: 'An island is land...', a: ['With no water', 'Surrounded by water', 'Only on the moon'], c: 1 },
        { q: 'The North Pole is mostly...', a: ['Ice', 'Desert sand', 'Jungle'], c: 0 },
        { q: 'Which is bigger?', a: ['A city', 'A continent', 'A house'], c: 1 },
        { q: 'Oceans are made of...', a: ['Salt water', 'Milk', 'Lava'], c: 0 }
    ],
    medium: [
        { q: 'Which is the biggest ocean?', a: ['Atlantic', 'Pacific', 'Arctic'], c: 1 },
        { q: 'The USA is on which continent?', a: ['Asia', 'Africa', 'North America'], c: 2 },
        { q: 'Paris is in...', a: ['France', 'Canada', 'Egypt'], c: 0 },
        { q: 'Which is a continent?', a: ['Texas', 'Africa', 'Pacific'], c: 1 },
        { q: 'Egypt is famous for...', a: ['Pyramids', 'Kangaroos', 'Igloos'], c: 0 },
        { q: 'Tokyo is a city in...', a: ['Japan', 'Brazil', 'Kenya'], c: 0 }
    ],
    hard: [
        { q: 'The equator is an imaginary line around...', a: ["Earth's middle", 'The Moon only', 'One school'], c: 0 },
        { q: 'Which country is also a continent?', a: ['Australia', 'Spain', 'Peru'], c: 0 },
        { q: 'The Amazon rainforest is mostly in...', a: ['South America', 'Antarctica', 'Europe'], c: 0 },
        { q: 'Mount Everest is in the...', a: ['Alps', 'Himalayas', 'Rockies'], c: 1 },
        { q: 'The Nile is a famous...', a: ['River', 'Desert', 'Planet'], c: 0 },
        { q: 'Canada is north of the...', a: ['United States', 'Brazil', 'Australia'], c: 0 }
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
                $('status').textContent = 'Great!';
                setTimeout(next, 450);
            } else {
                $('status').textContent = 'Keep thinking';
            }
        };
        box.appendChild(b);
    });
}

$('actionBtn').onclick = next;
ensureGradeUI({ onChange: () => { score = 0; $('score').textContent = '0'; next(); } });
next();
