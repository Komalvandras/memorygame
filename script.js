const emojis = ['\u{1F600}','\u{1F602}','\u{1F609}','\u{1F618}','\u{1F923}','\u{1F60D}','\u{1F62E}','\u{1F61C}'];
let cards = [];
let board = document.getElementById('board');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCount = 0;
let timerInterval;
let time = 300;

function shuffle() {
  const doubled = [...emojis, ...emojis];
  return doubled.sort(() => 0.5 - Math.random());
}

function startTimer() {
  clearInterval(timerInterval);
  document.getElementById("time").textContent = time;
  timerInterval = setInterval(() => {
    time--;
    document.getElementById("time").textContent = time;
    if (time <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
}

function createCard(content) {
  const div = document.createElement('div');
  div.classList.add('card');
  div.dataset.value = content;
  div.innerHTML = '<span style="display:none">' + content + '</span>';

  div.addEventListener('click', () => {
    if (lockBoard || div.classList.contains('flipped')) return;

    div.classList.add('flipped');
    div.querySelector('span').style.display = 'block';

    if (!firstCard) {
      firstCard = div;
    } else {
      secondCard = div;
      checkForMatch();
    }
  });
  return div;
}

function checkForMatch() {
  lockBoard = true;
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedCount++;
    reset();
    if (matchedCount === emojis.length) {
      clearInterval(timerInterval);
      endGame(true);
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.querySelector('span').style.display = 'none';
      secondCard.querySelector('span').style.display = 'none';
      reset();
    }, 1000);
  }
}

function reset() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function endGame(win) {
  board.style.display = 'none';
  document.getElementById('restart').style.display = 'inline-block';
  document.getElementById('start').style.display = 'none';
  document.getElementById(win ? 'celebration' : 'lose-message').style.display = 'block';
}

function initGame() {
  time = 300;
  document.getElementById('celebration').style.display = 'none';
  document.getElementById('lose-message').style.display = 'none';
  document.getElementById('start').style.display = 'none';
  document.getElementById('restart').style.display = 'inline-block';
  board.style.display = 'grid';
  board.innerHTML = '';
  cards = shuffle();
  cards.forEach(emoji => board.appendChild(createCard(emoji)));
  matchedCount = 0;
  startTimer();
}

document.getElementById("start").addEventListener("click", initGame);
document.getElementById("restart").addEventListener("click", initGame);
