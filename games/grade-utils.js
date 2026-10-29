// Shared grade helpers for educational games
// WesleyDude.com

const GRADE_STORAGE_KEY = 'wesleyGrade';

const GRADE_LABELS = {
    K: 'Kindergarten',
    1: '1st Grade',
    2: '2nd Grade',
    3: '3rd Grade',
    4: '4th Grade',
    5: '5th Grade'
};

function getSavedGrade() {
    return localStorage.getItem(GRADE_STORAGE_KEY) || '';
}

function setSavedGrade(grade) {
    if (!grade) localStorage.removeItem(GRADE_STORAGE_KEY);
    else localStorage.setItem(GRADE_STORAGE_KEY, grade);
}

function gradeNumber(grade) {
    if (grade === 'K' || grade === '') return 0;
    return Number(grade) || 0;
}

/** 0 (K) .. 5 — higher = harder */
function difficultyLevel(grade = getSavedGrade()) {
    return Math.max(0, Math.min(5, gradeNumber(grade)));
}

function ensureGradeUI(options = {}) {
    const {
        selectId = 'gradeSelect',
        labelId = 'gradeLabel',
        onChange = null
    } = options;

    const select = document.getElementById(selectId);
    const label = document.getElementById(labelId);
    const grade = getSavedGrade();

    if (select && grade) select.value = grade;
    if (label) label.textContent = grade ? (GRADE_LABELS[grade] || grade) : '-';

    if (select && !select.dataset.bound) {
        select.dataset.bound = '1';
        select.addEventListener('change', () => {
            const value = select.value;
            setSavedGrade(value);
            if (label) label.textContent = value ? (GRADE_LABELS[value] || value) : '-';
            if (typeof onChange === 'function') onChange(value);
        });
    }

    return grade;
}
