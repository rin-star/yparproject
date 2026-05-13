const questions = [
    {
        question: "What is the traditional Korean dress called?",
        options: ["Kimono", "Hanbok", "Cheongsam", "Sari"],
        correct: 1,
        fact: "Hanbok is the traditional Korean clothing worn during festivals and special occasions.",
        character: "Clothing"
    },
    {
        question: "Which dynasty ruled Korea for over 500 years?",
        options: ["Goryeo", "Joseon", "Silla", "Baekje"],
        correct: 1,
        fact: "The Joseon Dynasty (1392-1910) was known for its advancements in science, literature, and the Korean alphabet, Hangul.",
        character: "History"
    },
    {
        question: "What is Korea's national dish?",
        options: ["Bibimbap", "Kimchi", "Bulgogi", "Samgyetang"],
        correct: 1,
        fact: "Kimchi, fermented vegetables, is a staple in Korean cuisine and was recognized by UNESCO as an Intangible Cultural Heritage.",
        character: "Food"
    },
    {
        question: "What does the Korean flag, Taegeukgi, symbolize?",
        options: ["Unity of heaven and earth", "Balance of yin and yang", "Four seasons", "Five elements"],
        correct: 1,
        fact: "The Taegeukgi represents the balance of yin and yang, with the red and blue circles symbolizing the complementary forces of the universe.",
        character: "Symbol"
    },
    {
        question: "Which Korean holiday celebrates the harvest and thanks ancestors?",
        options: ["Seollal", "Chuseok", "Dano", "Hansik"],
        correct: 1,
        fact: "Chuseok is the Korean Thanksgiving, where families gather to honor ancestors and enjoy traditional foods.",
        character: "Holiday"
    },
    {
        question: "What is the Korean writing system called?",
        options: ["Hiragana", "Hangul", "Hanja", "Katakana"],
        correct: 1,
        fact: "Hangul was created in 1443 by King Sejong the Great to make reading and writing accessible to all Koreans.",
        character: "Language"
    },
    {
        question: "Which martial art originated in Korea?",
        options: ["Karate", "Taekwondo", "Judo", "Kung Fu"],
        correct: 1,
        fact: "Taekwondo, meaning 'the way of the foot and fist,' is Korea's national sport and a popular martial art worldwide.",
        character: "Sport"
    },
    {
        question: "What is the significance of the number 4 in Korean culture?",
        options: ["Good luck", "Bad luck", "Neutral", "Royal number"],
        correct: 1,
        fact: "The number 4 is considered unlucky in Korea because it sounds similar to the word for 'death' in Korean.",
        character: "Culture"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let playerPosition = 50; // percentage from left
let monsters = [];
let keys = {};

const startBtn = document.getElementById('start-btn');
const questionScreen = document.getElementById('question-screen');
const startScreen = document.getElementById('start-screen');
const resultScreen = document.getElementById('result-screen');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const feedbackText = document.getElementById('feedback-text');
const feedbackCharacter = document.getElementById('feedback-character');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const resultMessage = document.getElementById('result-message');
const scoreDisplay = document.getElementById('score-display');
const progressFill = document.getElementById('progress-fill');
const mainCharacter = document.getElementById('main-character');
const questionCharacter = document.getElementById('question-character');
const resultCharacter = document.getElementById('result-character');
const player = document.getElementById('player');
const monstersContainer = document.getElementById('monsters');
const particlesContainer = document.getElementById('particles');

startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartGame);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        movePlayer();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function movePlayer() {
    // Only allow movement when not answering questions
    if (!questionScreen.classList.contains('hidden') || !resultScreen.classList.contains('hidden')) {
        return;
    }
    
    const moveSpeed = 1;
    
    if (keys['ArrowLeft'] && playerPosition > 5) {
        playerPosition -= moveSpeed;
    }
    if (keys['ArrowRight'] && playerPosition < 95) {
        playerPosition += moveSpeed;
    }
    
    player.style.left = playerPosition + '%';
    
    // Check for monster collisions
    checkCollisions();
}

function checkCollisions() {
    monsters.forEach((monster, index) => {
        const monsterRect = monster.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        
        if (playerRect.left < monsterRect.right && 
            playerRect.right > monsterRect.left && 
            playerRect.top < monsterRect.bottom && 
            playerRect.bottom > monsterRect.top) {
            // Collision detected - trigger question
            if (questionScreen.classList.contains('hidden')) {
                showQuestion();
            }
        }
    });
}

function spawnMonster() {
    const monster = document.createElement('div');
    monster.className = 'monster';
    monster.textContent = '👹';
    monster.style.left = Math.random() * 80 + 10 + '%';
    monster.style.bottom = Math.random() * 30 + 10 + '%';
    monstersContainer.appendChild(monster);
    monsters.push(monster);
}

function defeatMonster() {
    if (monsters.length > 0) {
        const monster = monsters.shift();
        monster.classList.add('defeated');
        setTimeout(() => {
            monster.remove();
        }, 500);
    }
}

function startGame() {
    startScreen.classList.add('hidden');
    questionScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    
    // Reset player position
    playerPosition = 50;
    player.style.left = '50%';
    
    // Clear existing monsters
    monsters.forEach(monster => monster.remove());
    monsters = [];
    
    // Spawn initial monsters
    for (let i = 0; i < 3; i++) {
        spawnMonster();
    }
    
    // Start game loop
    gameLoop();
}

function gameLoop() {
    movePlayer();
    requestAnimationFrame(gameLoop);
}

function showQuestion() {
    questionScreen.classList.remove('hidden');
    const question = questions[currentQuestionIndex];
    questionEl.textContent = question.question;
    questionCharacter.textContent = question.character;
    optionsEl.innerHTML = '';
    feedbackEl.classList.add('hidden');
    nextBtn.classList.add('hidden');
    
    question.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.classList.add('option');
        optionEl.textContent = option;
        optionEl.addEventListener('click', () => selectOption(index));
        optionsEl.appendChild(optionEl);
    });
}

function selectOption(index) {
    if (selectedOption !== null) return;
    
    selectedOption = index;
    const question = questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    options.forEach((option, i) => {
        if (i === question.correct) {
            option.classList.add('correct');
        } else if (i === index) {
            option.classList.add('incorrect');
        }
    });
    
    if (index === question.correct) {
        score++;
        feedbackCharacter.textContent = 'Correct!';
        feedbackText.textContent = question.fact;
        feedbackEl.classList.add('correct');
        createParticles();
        defeatMonster();
        mainCharacter.textContent = 'Happy Guide';
    } else {
        feedbackCharacter.textContent = 'Oops!';
        feedbackText.textContent = question.fact;
        feedbackEl.classList.add('incorrect');
        mainCharacter.textContent = 'Thinking Guide';
    }
    
    feedbackEl.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    updateProgress();
}

function nextQuestion() {
    selectedOption = null;
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        showQuestion();
        // Spawn a new monster
        spawnMonster();
    } else {
        showResult();
    }
}

function showResult() {
    questionScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    const percentage = Math.round((score / questions.length) * 100);
    scoreDisplay.textContent = `${score}/${questions.length} (${percentage}%)`;
    
    let message = '';
    let character = '';
    
    if (percentage >= 80) {
        message = 'Amazing! You are a Korean culture master!';
        character = 'Master';
    } else if (percentage >= 60) {
        message = 'Great job! You know quite a bit about Korea.';
        character = 'Scholar';
    } else if (percentage >= 40) {
        message = 'Not bad! Keep exploring Korean culture.';
        character = 'Explorer';
    } else {
        message = 'Keep learning! Korea has so much to offer.';
        character = 'Student';
    }
    
    resultMessage.textContent = message;
    resultCharacter.textContent = character;
}

function restartGame() {
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    mainCharacter.textContent = 'Adventure Guide';
    playerPosition = 50;
    player.style.left = '50%';
    monsters.forEach(monster => monster.remove());
    monsters = [];
    currentQuestionIndex = 0;
    score = 0;
}

function updateProgress() {
    const progress = ((currentQuestionIndex + (selectedOption !== null ? 1 : 0)) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
}

function createParticles() {
    particlesContainer.classList.remove('hidden');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
    
    setTimeout(() => {
        particlesContainer.classList.add('hidden');
    }, 3000);
}