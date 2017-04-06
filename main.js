var players = {
  playerOne: {name: null, tileAmt: 0, score: 0, color: 'blue'},
  playerTwo: {name: null, tileAmt: 0, score: 0, color: 'red'}
};

var gridAmount = 28;
var board = [];
var $container = $('.container');
var $body = $('body');
var currentPlayer = players.playerOne;
var otherPlayer = players.playerTwo;
var $startButton = $('<button>Start Game</button>');
var $resetButton = $('<button>Reset Game</button>');
var clicks = 0;
var pointCounter = 0;
var lastCell = null;
var viableTiles = [];
var option1 = 0;
var option2 = 0;
var option3 = 0;
var option4 = 0;
var totalTurnsAmt = 0;
var playerOneScore = 0;
var playerTwoScore = 0;
var $scoreDisplay = $('.scoreBox');
var $player1Score = $('.player1Score > p');
var $player2Score = $('.player2Score > p');
var $header = $('header');
var $openPopup = $('.my_popup_open')

$scoreDisplay.prepend($openPopup)
$scoreDisplay.prepend($startButton);
// $scoreDisplay.prepend($resetButton);
// $resetButton.on('click', resetGame);
$startButton.on('click', startGame);

// Creates all the tiles
for (var i = 0; i < gridAmount; i++) {
  board[i] = new Tile()
  $container.append(board[i].tileDiv)
};

var $allTiles = $('.container > div')
$allTiles.mouseenter(function() {($(this).animate({opacity: .7}, 100))});
$allTiles.mouseleave(function() {($(this).animate({opacity: 1}, 100))});

// tile creation constructor
function Tile() {
  this.tileDiv = ($('<div></div>', {'class': 'neutral', 'id': i}));
  this.owner = null;
  this.armySize = 0;
  this.fortification = null;
  this.obstacle = null;
  this.showNewClass = function() { // refactor later and take out
    if (this.owner == players.playerOne) {
      if (this.tileDiv.hasClass('neutral')) {
        this.tileDiv.removeClass('neutral')
        this.tileDiv.toggleClass('blue')
      }
    }
    else if (this.owner == players.playerTwo) {
      if (this.tileDiv.hasClass('neutral')) {
        this.tileDiv.removeClass('neutral')
        this.tileDiv.toggleClass('red')
        }
      }
    };
    this.tileDiv.on('click', moveArmy);
};

// start game button and make armies appear
function startGame() {
  board[0].owner = players.playerOne
  board[0].showNewClass()
  board[0].tileDiv.text(players.playerOne.armySize)
  board[gridAmount - 1].owner = players.playerTwo
  board[gridAmount - 1].showNewClass()
  board[gridAmount - 1].tileDiv.text(players.playerTwo.armySize)
  $startButton.off('click', startGame)
  for (var i = 0; i < 15; i++) {
    toggleFortification()
    toggleDefectors()
  }
  for (var i = 0; i < 6; i++) {
    toggleSuperFortification()
    toggleSuperDefectors()
  }
  displayPlayerTurn()
  addTileScore()
};

// function resetGame() {
//   for (var i = 0; i < gridAmount; i++) {
//     $allTiles.eq(i).attr('class') = 'neutral'
//   }
//   startGame()
// }

function toggleFortification() {
  var randoNumbo = Math.floor((Math.random() * (gridAmount - 2)) + 1)
  if ($allTiles.eq(randoNumbo).attr('class') != 'fortification' &&
  $allTiles.eq(randoNumbo).attr('class') != 'defector') {
  $allTiles.eq(randoNumbo).removeClass('neutral')
  $allTiles.eq(randoNumbo).toggleClass('fortification')
  $allTiles.eq(randoNumbo).text('10')
  }
};

function toggleSuperFortification() {
  var randoNumbo = Math.floor((Math.random() * (gridAmount - 2)) + 1)
  if ($allTiles.eq(randoNumbo).attr('class') != 'fortification' &&
  $allTiles.eq(randoNumbo).attr('class') != 'defector' &&
  $allTiles.eq(randoNumbo).attr('class') != 'superFort') {
  $allTiles.eq(randoNumbo).removeClass('neutral')
  $allTiles.eq(randoNumbo).toggleClass('superFort')
  $allTiles.eq(randoNumbo).text('20')
  }
};

function toggleDefectors() {
  var randoNumbo = Math.floor((Math.random() * (gridAmount - 2)) + 1)
  if ($allTiles.eq(randoNumbo).attr('class') != 'fortification' &&
  $allTiles.eq(randoNumbo).attr('class') != 'defector') {
  $allTiles.eq(randoNumbo).removeClass('neutral')
  $allTiles.eq(randoNumbo).toggleClass('defector')
  $allTiles.eq(randoNumbo).text('-10')
  }
};

function toggleSuperDefectors() {
  var randoNumbo = Math.floor((Math.random() * (gridAmount - 2)) + 1)
  if ($allTiles.eq(randoNumbo).attr('class') != 'fortification' &&
  $allTiles.eq(randoNumbo).attr('class') != 'defector' &&
  $allTiles.eq(randoNumbo).attr('class') != 'superFort' &&
  $allTiles.eq(randoNumbo).attr('class') != 'superDef') {
  $allTiles.eq(randoNumbo).removeClass('neutral')
  $allTiles.eq(randoNumbo).toggleClass('superDef')
  $allTiles.eq(randoNumbo).text('-20')
  }
};

// switch turns
function switchTurns() {
  if(currentPlayer == players.playerOne) {
    currentPlayer = players.playerTwo
    otherPlayer = players.playerOne

  } else {
    currentPlayer = players.playerOne
    otherPlayer = players.playerTwo
  }
  displayPlayerTurn()
  addTileScore()
  turnCounter()
};

// displays to the user possible moves allowed
function checksOptions() {
  if (Number(lastCell.id) - 1 >= 0 && Number(lastCell.id) % 7 != 0) {
    option1 = Number(lastCell.id) - 1
    viableTiles[0] = option1
    //if .className != otherPlayer.color
    $allTiles.eq(option1).css('filter', 'brightness(3)')
  }
  if (Number(lastCell.id) - 7 >= 0) {
    option2 = Number(lastCell.id) - 7
    viableTiles[1] = option2
    $allTiles.eq(option2).css('filter', 'brightness(3)')
  }
  if (Number(lastCell.id) + 1 < gridAmount
  && ((Number(lastCell.id) + 1) % 7 != 0 || Number(lastCell.id) == 0)) { // put an or statement for the 0
    option3 = Number(lastCell.id) + 1
    viableTiles[2] = option3
    $allTiles.eq(option3).css('filter', 'brightness(3)')
  }
  if (Number(lastCell.id) + 7 < gridAmount) {
    option4 = Number(lastCell.id) + 7
    viableTiles[3] = option4
    $allTiles.eq(option4).css('filter', 'brightness(3)')
  }

};

// gets rid of the displayed options after the player has clicked
function resetOptionDisplay() {
  $allTiles.eq(option1).css('filter', 'brightness(1)')
  $allTiles.eq(option2).css('filter', 'brightness(1)')
  $allTiles.eq(option3).css('filter', 'brightness(1)')
  $allTiles.eq(option4).css('filter', 'brightness(1)')
}

function divide(armyToDivide) {
  return Math.round(Number(armyToDivide / 2))
};

currentArmy = 0;

// for to move, these can probably have individual functions instead of giant condition statements
function moveArmy() {
  if(clicks == 0 && $(this).attr('class') == currentPlayer.color) {
    clicks++
    pointCounter = this.innerText
    lastCell = this
    checksOptions()
  }
  // second click: if it's a fortification tile
  else if (clicks == 1 && $(this).attr('class') == 'fortification' &&
  (this.id == viableTiles[0] || this.id == viableTiles[1] || this.id == viableTiles[2] || this.id == viableTiles[3]) ) {
    $(this).removeClass('fortification')
    $(this).toggleClass(currentPlayer.color)
    this.innerText = ""
    currentPlayer.score += 10 // tie to current player
    lastCell.className = 'neutral'
    lastCell.innerText = ""
    clicks = 0
    resetOptionDisplay()
    switchTurns()
  }
  else if (clicks == 1 && $(this).attr('class') == 'defector' &&
  (this.id == viableTiles[0] || this.id == viableTiles[1] || this.id == viableTiles[2] || this.id == viableTiles[3]) ) {
    $(this).removeClass('defector')
    $(this).toggleClass(currentPlayer.color)
    this.innerText = ""
    currentPlayer.score -= 10
    lastCell.className = 'neutral'
    lastCell.innerText = ""
    clicks = 0
    resetOptionDisplay()
    switchTurns()
  }
  // second click: if a superFort tile is clicked
  else if ((clicks == 1 && $(this).attr('class') == 'superFort') &&
  (this.id == viableTiles[0] || this.id == viableTiles[1] || this.id == viableTiles[2] || this.id == viableTiles[3]) ) {
    $(this).removeClass('superFort')
    $(this).toggleClass(currentPlayer.color)
    this.innerText = ""
    currentPlayer.score += 20
    lastCell.className = 'neutral'
    lastCell.innerText = ""
    clicks = 0
    resetOptionDisplay()
    switchTurns()
  }
  else if ((clicks == 1 && $(this).attr('class') == 'superDef') &&
  (this.id == viableTiles[0] || this.id == viableTiles[1] || this.id == viableTiles[2] || this.id == viableTiles[3]) ) {
    $(this).removeClass('superDef')
    $(this).toggleClass(currentPlayer.color)
    this.innerText = ""
    currentPlayer.score -= 20
    lastCell.className = 'neutral'
    lastCell.innerText = ""
    clicks = 0
    resetOptionDisplay()
    switchTurns()
  }
  else if ((clicks == 1 && $(this).attr('class') == 'neutral') &&
  (this.id == viableTiles[0] || this.id == viableTiles[1] || this.id == viableTiles[2] || this.id == viableTiles[3]) ) {
    $(this).removeClass('neutral')
    $(this).toggleClass(currentPlayer.color)
    this.innerText = ""
    lastCell.className = 'neutral'
    lastCell.innerText = ""
    clicks = 0
    resetOptionDisplay()
    switchTurns()
  }
  else {
    console.log("Not a valid move")
  }
};

// for win condition scoring
function addTileScore() {
  for (var i = 0; i < $('.container > div').length; i++) {
    var thisAttr = $allTiles.eq(i).attr('class')
    if (thisAttr != 'neutral') {
      if ($allTiles.eq(i).attr('class') == 'blue') {
        $player1Score.eq(2).text(':' + players.playerOne.score)
      }
      else if ($allTiles.eq(i).attr('class') == 'red') {
        $player2Score.eq(2).text(':' + players.playerTwo.score)
      }
    }
  }
  checkWinner()
};

function checkWinner() {
  var allForts = 0
  var allSuperForts = 0
  for (var i = 0; i < (gridAmount - 1); i++) {
    if ($allTiles.eq(i).attr('class') == 'fortification') {
      allForts += 1
    }
    else if ($allTiles.eq(i).attr('class') == 'superFort') {
      allSuperForts += 1
    }
  }
  if (allForts + allSuperForts == 0) {
    displayWinner()
  }
};

function displayWinner() {
  console.log('chceckin winner')
  if (players.playerOne.score > players.playerTwo.score) {
    $player2Score.css('opacity', '0.3')
    $player1Score.css('opacity', '1')
    $player1Score.eq(0).text('Player 1 Wins!')
    turnClicksOff()
  }
  if (players.playerTwo.tileAmt > players.playerOne.score) {
    $player1Score.css('opacity', '0.3')
    $player2Score.css('opacity', '1')
    $player2Score.eq(0).text('Player 2 Wins!')
    turnClicksOff()
  }
  if (players.playerTwo.tileAmt > players.playerOne.score) {
    $player1Score.css('opacity', '1')
    $player2Score.css('opacity', '1')
    $player1Score.eq(0).text('Player 1 Wins!')
    $player2Score.eq(0).text('Player 2 Wins!')
    turnClicksOff()
  }
};

function turnClicksOff() {
  for (var i = 0; i < gridAmount; i++) {
    board[0].tileDiv.off('click', moveArmy)
  }
}

function turnCounter() {
  var temp = totalTurnsAmt
  temp += 1
  if (temp % 2 == 0) {
    totalTurnsAmt += (temp/2)
  }
};

function displayPlayerTurn() {
  if (currentPlayer.color  == 'blue') {
    $player2Score.css('opacity', '0.3')
    $player1Score.css('opacity', '1')
  }
  else if (currentPlayer.color == 'red') {
    $player1Score.css('opacity', '0.3')
    $player2Score.css('opacity', '1')
  }
};

// breakpoint is about 1110px (fix for tablet & (mobile?))
