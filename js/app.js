let game = {
  //array with card's name (for start game)
  cards: ['fa-diamond', 'fa-diamond',
    'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-anchor', 'fa-anchor',
    'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube',
    'fa-leaf', 'fa-leaf',
    'fa-bicycle', 'fa-bicycle',
    'fa-bomb', 'fa-bomb'
  ],
  //current opened card
  openedCard: '',
  //already matched cards
  matchedCards: [],
  //count of moves
  moves: 0,
  //maximum starts
  maximumStarsRating: 3,
  //count of stars
  currentStarsRating: 0,
  //start time
  startTime: 0
};

const moveCounter = document.querySelector('.moves');
const starsPanel = document.querySelector('.score-panel');
const restart = document.querySelector('.restart');
const gameBoard = document.querySelector('.game-panel');
const popupWindow = document.querySelector('.popup-window');
const popupClose = document.querySelector('.popup-close');
const newGameButton = document.querySelector('#new-game');

//Start a new game
function newGame(game, gameBoard, moveCounter, starsPanel) {
  //reset stars
  game.currentStarsRating = 3;
  updateStarCounter(game.currentStarsRating, game.maximumStarsRating, starsPanel);
  //reset moves
  game.moves = 0;
  updateMoveCounter(game.moves, moveCounter);
  //empty matched cards
  game.matchedCards = [];
  //shuffle cards
  game.cards = shuffle(game.cards);
  //create board
  const board = createBoard(game.cards);
  //"repaint" board on the page
  const deck = document.querySelector('.deck');
  if (deck !== null) {
    gameBoard.removeChild(deck);
  }
  gameBoard.appendChild(board);
  gameBoard.addEventListener('click', mainLogic);
  //set timer
  game.startTime = performance.now();
  return game;
}

//create a board
/*
<ul class="deck">
  <li class="card">
    <i class="fa fa-name_of_element"></i>
  </li>
</ul>
 */
function createBoard(cards) {
  const board = document.createElement('ul');
  board.classList.add('deck');
  for (const card of cards) {
    //create card
    const newCardElement = document.createElement('li');
    newCardElement.classList.add('card');
    const cardContent = document.createElement('i');
    cardContent.classList.add('fa');
    cardContent.classList.add(card);
    newCardElement.appendChild(cardContent);
    //add card to the board
    board.appendChild(newCardElement);
  }
  return board;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//add animation
function addAnimationByClass(className) {
  const cards = document.getElementsByClassName(className);
  //add animation
  for (const card of cards) {
    card.classList.add('shake');
    card.classList.add('animated');
  }
}

//delete animation
function removeAnimationByClass(className) {
  const cards = document.getElementsByClassName(className);
  //add animation
  for (const card of cards) {
    card.classList.remove('shake');
    card.classList.remove('animated');
  }
}

//display the card's symbol
function showCard(card) {
  card.classList.add('open', 'show');
}

//get name of opened card
function getOpenCard(card) {
  //if card is already matched or open
  if (card.classList.contains('match') || card.classList.contains('show'))
    return false;
  else
    //if card isn't opened and matched return class with "name" of card
    return card.firstElementChild.className.split(" ")[1];
}

//if the cards do match, lock the cards in the open position
function matchCards(matchedCards, cardName) {
  const cards = document.getElementsByClassName(cardName);
  for (const card of cards) {
    card.parentElement.classList.add('pulse');
    card.parentElement.classList.add('animated');
    card.parentElement.classList.add('match');
    card.parentElement.classList.remove('open');
    card.parentElement.classList.remove('show');
  }
  //add matched cards to array
  matchedCards.push(cardName, cardName);
  return matchedCards;
}

//Hide opened cards
function hideOpenedCards() {
  const cards = document.getElementsByClassName('open');
  //hide cards
  while (cards.length != 0) {
    cards[0].classList.remove('show');
    cards[0].classList.remove('open');
  }
}

//show move counter on page
function updateMoveCounter(moves, movePanel) {
  moveCounter.textContent = moves;
}

//incrementMoveCounter
function incrementMoveCounter(moves, movePanel) {
  moves += 1;
  updateMoveCounter(moves, movePanel);
  return moves;
}

//show stars on page
/*
<i class="fa fa-star"></i> //full stars
<i class="fa fa-star-half-o"></i> //half full stars
<i class="fa fa-star-o"></i> //empty stars
*/
function updateStarCounter(countStars, maximumStarsRating, starsPanel) {
  //create new list with stars
  const starsList = document.createElement('ul');
  starsList.classList.add('stars');
  for (let i = 0; i < maximumStarsRating; i++) {
    const star = document.createElement('li');
    if (countStars >= 1) {
      star.innerHTML = '<i class="fa fa-star"></i>';
      countStars--;
    } else if (countStars == 0.5) {
      star.innerHTML = '<i class="fa fa-star-half-o"></i>';
      countStars--;
    } else {
      star.innerHTML = '<i class="fa fa-star-o"></i>';
    }
    starsList.appendChild(star);
  }
  //remove prevoius stars
  if (document.querySelector('.stars') !== null) {
    document.querySelector('.stars').remove();
  }
  //add new stars
  starsPanel.prepend(starsList);
}

//update game score (every matched pair of cards gives +0.5 star)
//Star rating can't be more than maximumStarsRating
function increaseStar(countStars, maximumStarsRating, starsPanel) {
  countStars = (countStars >= maximumStarsRating) ? maximumStarsRating : countStars + 0.5;
  updateStarCounter(countStars, maximumStarsRating, starsPanel);
  return countStars;
}

//update game score (every error increase star -0.5)
//count of stars can'be negative
function decreaseStar(countStars, maximumStarsRating, starsPanel) {
  countStars = (countStars <= 0) ? 0 : countStars - 0.5;
  updateStarCounter(countStars, maximumStarsRating, starsPanel);
  return countStars;
}

//show popup window with result
function showPopupWindow(popupWindow, headerText, messageText, stars, moves, time) {
  //generate content
  const popupContent = document.createElement('div');
  popupContent.classList.add('popup-message');

  const popupHeader = document.createElement('h1');
  popupHeader.innerHTML = headerText;
  const popupText = document.createElement('p');
  popupText.innerHTML = messageText;
  const popupScoreMessage = document.createElement('p');
  popupScoreMessage.innerHTML = 'Your final score is <span>' + stars +
    '</span> stars and <span>' + moves + '</span> moves.';
  popupContent.append(popupHeader);
  popupContent.append(popupText);
  popupContent.append(popupScoreMessage);
  //if user win show time
  if (time !== 0) {
    const popupTimeMessage = document.createElement('p');
    popupTimeMessage.innerHTML = 'Your time is <span>' + Math.floor(time / 1000) + '</span> sec.';
    popupContent.append(popupTimeMessage);
  }
  //if popup message is already exist - delete it
  const popupMessage = popupWindow.querySelector('.popup-message');
  if (popupMessage) {
    popupWindow.querySelector('.popup-content').removeChild(popupMessage);
  }

  //add content to page
  popupWindow.querySelector('.popup-content').prepend(popupContent);
  //show popup
  popupWindow.classList.remove('hide');
}

// Main logic of game
/*
 * User open a card by clicking on it.
 * if two cards are opened checking if the two cards match
 *    + if the cards do match, lock the cards in the open position (increase count of score(+0.5 star))
 *    + if the cards do not match hide the card's symbol (decrease count of stars(-0.5))
 *    + if all cards have matched(win) or count of stars is 0(lose) displays a message with the final score and moves)
 */
var mainLogic = function(evt) {
  const selectedCard = evt.target;
  const newCard = getOpenCard(evt.target);
  if (newCard) {
    showCard(selectedCard);
    //we have two opened cards
    if (game.openedCard !== '') {
      game.moves = incrementMoveCounter(game.moves, moveCounter);
      if (game.openedCard === newCard) {
        //the cards do match
        game.matchedCards = matchCards(game.matchedCards, game.openedCard);
        game.currentStarsRating = increaseStar(game.currentStarsRating, game.maximumStarsRating, starsPanel);
        game.openedCard = '';
      } else {
        //the cards do not match, close cards
        game.openedCard = '';
        game.currentStarsRating = decreaseStar(game.currentStarsRating, game.maximumStarsRating, starsPanel);
        addAnimationByClass('open');
        //hide opened cards with delay
        setTimeout(function() {
          removeAnimationByClass('open');
          hideOpenedCards();
        }, 600);
      }
    } else {
      game.openedCard = newCard;
    }
  }
  //in case of loss (game's stars rating is 0)
  if (game.currentStarsRating === 0) {
    //remove eventListeners from board(make board not interactive)
    gameBoard.removeEventListener('click', mainLogic);
    //generate and show lose message
    showPopupWindow(popupWindow, 'Game over:(', 'You lose.', game.currentStarsRating, game.moves, 0);
  }
  //in case of win
  if (game.cards.length === game.matchedCards.length) {
    //get end time
    const endTime = performance.now();
    gameBoard.removeEventListener('click', mainLogic);
    showPopupWindow(popupWindow, 'Congratulation:)', 'You won.', game.currentStarsRating, game.moves, (endTime - game.startTime));
  }
}

//when DOM is loaded start a new game
document.addEventListener('DOMContentLoaded', newGame(game, gameBoard, moveCounter, starsPanel));

//if user press a restart "button"
restart.addEventListener('click', function() {
  //if popup is open hide it
  if (!popupWindow.classList.contains('hide'))
    popupWindow.classList.add('hide');
  game = newGame(game, gameBoard, moveCounter, starsPanel);
});

//close popup
popupClose.addEventListener('click', function() {
  popupWindow.classList.add('hide');
});

//start a new game
newGameButton.addEventListener('click', function() {
  popupWindow.classList.add('hide');
  game = newGame(game, gameBoard, moveCounter, starsPanel);
});

//if user press an "Enter" key start a new game
document.addEventListener('keypress', function(evt) {
  if (evt.key === 'Enter') {
    //if popup is open hide it
    if (!popupWindow.classList.contains('hide'))
      popupWindow.classList.add('hide');
    game = newGame(game, gameBoard, moveCounter, starsPanel);
  }
});
