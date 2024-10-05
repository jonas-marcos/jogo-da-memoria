let cards = [
    '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍊', '🍊',
    '🍓', '🍓', '🍍', '🍍'
];

let cardElements = [];
let cardValues = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let playerName = '';
let difficulty = '';
let moves = 0; // Adicionando a contagem de movimentos

// Embaralhandp cartas
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// Ajusta as cartas com base no nível da dificuldade
function setDifficulty() {
    if (difficulty === 'easy') {
        cards = [
            '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍊', '🍊'
        ];
    } else if (difficulty === 'hard') {
        cards = [
            '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍊', '🍊',
            '🍓', '🍓', '🍍', '🍍', '🥭', '🥭', '🍉', '🍉'
        ];
    }
}

// Criando o tabuleiro
function createBoard() {
    const gameBoard = document.getElementById('game-board');
    shuffle(cards);
    cards.forEach((value) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cardElements.push(card);
    });
}

// Virando as carta
function flipCard() {
    if (lockBoard) return;

    this.classList.add('flipped');
    cardValues.push(this.dataset.value);
    this.textContent = this.dataset.value; 
    moves++; // Incrementa o número de movimentos

    if (cardValues.length === 2) {
        checkMatch();
    }
}

// se as cartas estao combinando
function checkMatch() {
    lockBoard = true;
    firstCard = cardElements.find(card => card.classList.contains('flipped') && card.dataset.value === cardValues[0]);
    secondCard = cardElements.find(card => card.classList.contains('flipped') && card.dataset.value === cardValues[1]);

    if (cardValues[0] === cardValues[1]) {
        score++;  
        resetCards();  

        // Verifica se o jogo terminou 
        if (score === cards.length / 2) {
            endGame();  // Finaliza o jogo
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = ''; 
            secondCard.textContent = ''; 
            resetCards(); 
        }, 1000);
    }
}

// Reseta valores
function resetCards() {
    cardValues = [];
    lockBoard = false;
}

// Calcular a pontuação com base nos movimentos
function calculateScore() {
    let maxScore = 1000; // Pontuação máxima
    let penaltyPerMove = 1; // Penalidade por movimento extra
    let scoreBasedOnMoves = maxScore - (moves - cards.length / 2) * penaltyPerMove;
    return Math.max(scoreBasedOnMoves, 0); // A pontuação não pode ser negativa
}

// Finaliza o jogo
function endGame() {
    // Calcula a pontuação baseada no número de movimentos
    score = calculateScore();

    // Escondendo o tabuleiro e exibindo o botão de reiniciar
    document.getElementById('game-board').style.display = 'none';
    document.getElementById('reset-button').style.display = 'block';
    document.getElementById('score').textContent = `${playerName}, sua pontuação é: ${score}`;
    document.getElementById('score').style.display = 'block';

    // Mostra o ranking após o jogo
    document.getElementById('ranking').style.display = 'block';  // Torna o ranking visível

    // Atualiza o ranking
    updateRanking();
    displayRanking();
}

// Inicia o jogo
document.getElementById('start-button').addEventListener('click', () => {
    playerName = document.getElementById('player-name').value;
    if (!playerName) {
        alert("Por favor, insira seu nome.");
        return;
    }

    if (!difficulty) { 
        alert("Por favor, selecione um nível de dificuldade.");
        return;
    }

    score = 0;
    moves = 0; 
    cardElements.forEach(card => card.remove());
    cardElements = [];
    document.getElementById('player-info').style.display = 'none';
    document.getElementById('game-board').style.display = 'grid'; 
    createBoard();
    document.getElementById('reset-button').style.display = 'none';
    document.getElementById('score').style.display = 'none';
});

// Seleciona nível fácil
document.getElementById('easy-button').addEventListener('click', () => {
    difficulty = 'easy';
    setDifficulty();
    highlightSelectedButton();
});

// Seleciona nível difícil
document.getElementById('hard-button').addEventListener('click', () => {
    difficulty = 'hard';
    setDifficulty();
    highlightSelectedButton();
});

// Destacando botão selecionado
function highlightSelectedButton() {
    const easyButton = document.getElementById('easy-button');
    const hardButton = document.getElementById('hard-button');

   
    easyButton.classList.remove('selected');
    hardButton.classList.remove('selected');

    
    if (difficulty === 'easy') {
        easyButton.classList.add('selected');
    } else {
        hardButton.classList.add('selected');
    }
}

// Reinicia o jogo
document.getElementById('reset-button').addEventListener('click', () => {
    cardElements.forEach(card => card.remove());
    cardElements = [];
    score = 0;
    moves = 0; 

    // Esconde o tabuleiro e a pontuação
    document.getElementById('game-board').style.display = 'none';
    document.getElementById('score').style.display = 'none';

    
    document.getElementById('player-info').style.display = 'block';
    document.getElementById('reset-button').style.display = 'none';


    document.getElementById('easy-button').classList.remove('selected');
    document.getElementById('hard-button').classList.remove('selected');
    difficulty = '';

    document.getElementById('ranking').style.display = 'none';
});

// Atualiza o ranking
function updateRanking() {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ name: playerName, score: score });
    ranking.sort((a, b) => b.score - a.score); // Ordena por pontuação
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

// Exibindp o ranking
function displayRanking() {
    const rankingElement = document.getElementById('ranking');
    rankingElement.innerHTML = '<h3>Ranking</h3>';
    
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.forEach(player => {
        const playerElement = document.createElement('p');
        playerElement.textContent = `${player.name}: ${player.score} pontos`;
        rankingElement.appendChild(playerElement);
    });
}
