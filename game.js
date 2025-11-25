// Game state
let currentMode = '';
let currentQuestion = 0;
let score = 0;
let questions = [];
let timer = null;
let timeLeft = 60;
let lives = 3;
let currentStreak = 0;
let bestStreak = 0;

// Statistics
let stats = {
    totalGames: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestStreak: 0
};

// Load stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('geoGameStats');
    if (saved) {
        stats = JSON.parse(saved);
        updateStatsDisplay();
    }
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('geoGameStats', JSON.stringify(stats));
    updateStatsDisplay();
}

// Update stats display on menu
function updateStatsDisplay() {
    document.getElementById('totalGames').textContent = stats.totalGames;
    document.getElementById('totalCorrect').textContent = stats.totalCorrect;
    document.getElementById('bestStreak').textContent = stats.bestStreak;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
});

// Start game
function startGame(mode) {
    currentMode = mode;
    currentQuestion = 0;
    score = 0;
    currentStreak = 0;

    // Reset timer and lives
    timeLeft = 60;
    lives = 3;

    // Hide menu, show game
    document.getElementById('menu').classList.remove('active');
    document.getElementById('game').classList.add('active');

    // Set mode label
    const modeLabels = {
        'flagToCountry': '🚩 Vlajka → Země',
        'countryToFlag': '🏴 Země → Vlajka',
        'capitals': '🏛️ Hlavní města',
        'mapLocation': '🗺️ Mapa světa',
        'timeAttack': '⏱️ Časový režim',
        'endless': '♾️ Nekonečný režim'
    };
    document.getElementById('gameMode').textContent = modeLabels[mode];

    // Generate questions
    generateQuestions();

    // Setup mode-specific features
    if (mode === 'timeAttack') {
        document.getElementById('timerDisplay').style.display = 'block';
        startTimer();
    } else {
        document.getElementById('timerDisplay').style.display = 'none';
    }

    if (mode === 'endless') {
        document.getElementById('livesDisplay').style.display = 'block';
        document.getElementById('livesLeft').textContent = lives;
    } else {
        document.getElementById('livesDisplay').style.display = 'none';
    }

    // Show first question
    showQuestion();
}

// Generate questions based on mode
function generateQuestions() {
    const questionCount = currentMode === 'endless' ? 100 : 10;
    questions = [];

    for (let i = 0; i < questionCount; i++) {
        const correctCountry = countries[Math.floor(Math.random() * countries.length)];
        const wrongOptions = getRandomCountries(3, correctCountry);
        const allOptions = shuffle([correctCountry, ...wrongOptions]);

        questions.push({
            correct: correctCountry,
            options: allOptions
        });
    }
}

// Get random countries excluding the correct one
function getRandomCountries(count, exclude) {
    const filtered = countries.filter(c => c.name !== exclude.name);
    const selected = [];

    for (let i = 0; i < count; i++) {
        const random = filtered[Math.floor(Math.random() * filtered.length)];
        if (!selected.includes(random)) {
            selected.push(random);
        } else {
            i--; // Try again if duplicate
        }
    }

    return selected;
}

// Shuffle array
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Show current question
function showQuestion() {
    if (currentMode === 'timeAttack' && timeLeft <= 0) {
        endGame();
        return;
    }

    if (currentMode === 'endless' && lives <= 0) {
        endGame();
        return;
    }

    if (currentQuestion >= questions.length && currentMode !== 'endless') {
        endGame();
        return;
    }

    const question = questions[currentQuestion];
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';

    // Update score display
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = currentMode === 'endless' ? score + (lives > 0 ? 1 : 0) : questions.length;

    // Update progress bar
    if (currentMode !== 'endless') {
        const progress = (currentQuestion / questions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    }

    // Clear previous content
    document.getElementById('questionText').textContent = '';
    document.getElementById('flagDisplay').textContent = '';
    document.getElementById('optionsContainer').innerHTML = '';
    document.getElementById('mapContainer').style.display = 'none';

    // Show question based on mode
    switch (currentMode) {
        case 'flagToCountry':
        case 'timeAttack':
        case 'endless':
            showFlagToCountry(question);
            break;
        case 'countryToFlag':
            showCountryToFlag(question);
            break;
        case 'capitals':
            showCapitals(question);
            break;
        case 'mapLocation':
            showMapLocation(question);
            break;
    }
}

// Flag to Country mode
function showFlagToCountry(question) {
    document.getElementById('questionText').textContent = 'Která země má tuto vlajku?';
    document.getElementById('flagDisplay').textContent = question.correct.flag;

    const container = document.getElementById('optionsContainer');
    question.options.forEach(country => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = country.name;
        button.onclick = () => checkAnswer(country, question.correct, button);
        container.appendChild(button);
    });
}

// Country to Flag mode
function showCountryToFlag(question) {
    document.getElementById('questionText').textContent = `Která je vlajka země ${question.correct.name}?`;

    const container = document.getElementById('optionsContainer');
    question.options.forEach(country => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.innerHTML = `<span class="option-flag">${country.flag}</span>${country.name}`;
        button.onclick = () => checkAnswer(country, question.correct, button);
        container.appendChild(button);
    });
}

// Capitals mode
function showCapitals(question) {
    document.getElementById('questionText').textContent = `Jaké je hlavní město ${question.correct.name}?`;
    document.getElementById('flagDisplay').textContent = question.correct.flag;

    const container = document.getElementById('optionsContainer');
    question.options.forEach(country => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = country.capital;
        button.onclick = () => checkAnswer(country, question.correct, button);
        container.appendChild(button);
    });
}

// Map Location mode
async function showMapLocation(question) {
    document.getElementById('questionText').textContent = `Kde se nachází ${question.correct.name}?`;
    document.getElementById('flagDisplay').textContent = question.correct.flag;
    document.getElementById('mapContainer').style.display = 'block';

    const container = document.getElementById('mapContainer');

    // Load SVG map if not already loaded
    if (!container.querySelector('svg')) {
        try {
            const response = await fetch('world-map.svg');
            const svgText = await response.text();
            container.innerHTML = svgText;

            // Setup click handlers and tooltips for all countries
            const countries = container.querySelectorAll('.country');
            countries.forEach(countryPath => {
                const countryName = countryPath.getAttribute('data-country');
                countryPath.onclick = () => checkMapAnswer(countryName, question.correct, countryPath);

                // Add tooltip on hover
                countryPath.addEventListener('mouseenter', (e) => {
                    countryPath.setAttribute('data-tooltip', countryName);
                });
            });
        } catch (error) {
            console.error('Error loading map:', error);
            container.innerHTML = '<p style="color: red;">Chyba při načítání mapy. Prosím obnovte stránku.</p>';
            return;
        }
    } else {
        // Reset all countries styling
        const countryPaths = container.querySelectorAll('.country');
        countryPaths.forEach(path => {
            path.classList.remove('selected', 'incorrect');
            const countryName = path.getAttribute('data-country');
            path.onclick = () => checkMapAnswer(countryName, question.correct, path);
        });
    }
}

// Check map answer
function checkMapAnswer(selectedCountry, correct, countryPath) {
    const isCorrect = selectedCountry === correct.name;
    const feedback = document.getElementById('feedback');

    // Disable all clicks temporarily
    const allCountries = document.querySelectorAll('.country');
    allCountries.forEach(path => path.onclick = null);

    if (isCorrect) {
        countryPath.classList.add('selected');
        feedback.textContent = `✓ Správně! ${correct.name}`;
        feedback.className = 'feedback correct';
        score++;
        currentStreak++;
        if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else {
        countryPath.classList.add('incorrect');
        feedback.textContent = `✗ Špatně! Správná odpověď: ${correct.name}`;
        feedback.className = 'feedback incorrect';
        currentStreak = 0;

        // Highlight correct country
        allCountries.forEach(path => {
            if (path.getAttribute('data-country') === correct.name) {
                path.classList.add('selected');
            }
        });

        if (currentMode === 'endless') {
            lives--;
            document.getElementById('livesLeft').textContent = lives;
        }
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentMode === 'endless' && currentQuestion >= questions.length) {
            // Generate more questions for endless mode
            const moreQuestions = [];
            for (let i = 0; i < 10; i++) {
                const correctCountry = countries[Math.floor(Math.random() * countries.length)];
                const wrongOptions = getRandomCountries(3, correctCountry);
                const allOptions = shuffle([correctCountry, ...wrongOptions]);
                moreQuestions.push({ correct: correctCountry, options: allOptions });
            }
            questions.push(...moreQuestions);
        }
        showQuestion();
    }, 1500);
}

// Check answer
function checkAnswer(selected, correct, button) {
    const feedback = document.getElementById('feedback');
    const buttons = document.querySelectorAll('.option-button');

    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);

    if (selected.name === correct.name) {
        button.classList.add('correct');
        feedback.textContent = '✓ Správně!';
        feedback.className = 'feedback correct';
        score++;
        currentStreak++;
        if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else {
        button.classList.add('incorrect');
        feedback.textContent = `✗ Špatně! Správná odpověď: ${correct.name}`;
        feedback.className = 'feedback incorrect';
        currentStreak = 0;

        // Highlight correct answer
        buttons.forEach(btn => {
            if (btn.textContent.includes(correct.name) || btn.querySelector('.option-flag')) {
                const flagElement = btn.querySelector('.option-flag');
                if (flagElement && flagElement.textContent === correct.flag) {
                    btn.classList.add('correct');
                } else if (btn.textContent === correct.name || btn.textContent === correct.capital) {
                    btn.classList.add('correct');
                }
            }
        });

        if (currentMode === 'endless') {
            lives--;
            document.getElementById('livesLeft').textContent = lives;
        }
    }

    // Move to next question after delay
    setTimeout(() => {
        currentQuestion++;

        // Generate more questions for endless mode
        if (currentMode === 'endless' && currentQuestion >= questions.length) {
            const moreQuestions = [];
            for (let i = 0; i < 10; i++) {
                const correctCountry = countries[Math.floor(Math.random() * countries.length)];
                const wrongOptions = getRandomCountries(3, correctCountry);
                const allOptions = shuffle([correctCountry, ...wrongOptions]);
                moreQuestions.push({ correct: correctCountry, options: allOptions });
            }
            questions.push(...moreQuestions);
        }

        showQuestion();
    }, 1500);
}

// Timer for time attack mode
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

// End game
function endGame() {
    if (timer) clearInterval(timer);

    // Update statistics
    stats.totalGames++;
    stats.totalCorrect += score;
    stats.totalQuestions += currentMode === 'endless' ? currentQuestion : questions.length;
    if (bestStreak > stats.bestStreak) {
        stats.bestStreak = bestStreak;
    }
    saveStats();

    // Hide game, show results
    document.getElementById('game').classList.remove('active');
    document.getElementById('results').classList.add('active');

    // Display results
    document.getElementById('finalScore').textContent = score;
    const total = currentMode === 'endless' ? currentQuestion : questions.length;
    document.getElementById('resultTotal').textContent = total;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    document.getElementById('resultPercent').textContent = percent + '%';
    document.getElementById('resultStreak').textContent = bestStreak;
}

// Restart game with same mode
function restartGame() {
    document.getElementById('results').classList.remove('active');
    startGame(currentMode);
}

// Back to menu
function backToMenu() {
    if (timer) clearInterval(timer);

    document.getElementById('game').classList.remove('active');
    document.getElementById('results').classList.remove('active');
    document.getElementById('menu').classList.add('active');

    updateStatsDisplay();
}
