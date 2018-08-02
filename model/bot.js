var requestp = require('request-promise-native');

let board = [];
let enemy_board = [];
const CARRIER_VAL =  5;
const BATTLESHIP_VAL = 4;
const CRUISER_VAL = 3;
const SUBMARINE_VAL = 3;
const DESTROYER_VAL = 2;

class Ship
{
  constructor(position, direction)
  {
    this.position = position
    this.direction = direction
  } 

  toJSON()
  {
    return {postion: this.position, direction: this.direction}
  }
}

let carrier = new Ship('A0', 'DOWN');
let battleship = new Ship('B1', 'DOWN');
let cruiser = new Ship('C2', 'DOWN');
let destroyer = new Ship('D3', 'DOWN');
let submarine = new Ship('E4', 'DOWN');

// store game init
let token = "";
let gameID = "";


for(var i = 0; i < 10; i++)
{
  board[i] = []
  for(var j = 0; j < 10; j++)
  {
      board[i].push('-');
  }
}

function convertCharToIndex(char)
{
  return char.charCodeAt(0) - 65;
}

// C4
function parsePosition(position)
{
  return [convertCharToIndex(position[0]), parseInt(position[1], 10)]
}

function createGame()
{
  let options = {
    method: 'POST',
    uri: 'http://battleship.inseng.net/games',
    json: true
  }
  
  return new Promise( function(resolve, reject) {
    requestp(options).then(function (response) {
      gameID = response.id;
      console.log(gameID);
      resolve(gameID);
      //console.log('body:', body); // Print the HTML for the Google homepage.
    }).catch(function (err) {
      console.log(err);
    });
  });
}



function joinGame(id)
{
  let body = {
    'name': 'hib',
    "carrier": {
      "position": "A0",
      "direction": "DOWN"
    },
    "battleship": {
      "position": "B1",
      "direction": "DOWN"
    },
    "cruiser": {
      "position": "C2",
      "direction": "DOWN"
    },
    "destroyer": {
      "position": "D3",
      "direction": "DOWN"
    },
    "submarine": {
      "position": "E4",
      "direction": "DOWN"
    }
  }

  var options = 
  {
    method: 'POST',
    uri: `http://battleship.inseng.net/games/${id}/players?match=1`,
    body: body,
    json: true
  }

  return new Promise( function (resolve, reject) {
    requestp(options).then(function (response) {
      enemy_board = response.board,
      token = response.currentPlayer.token;
      resolve(false);
    }).catch(function (err) {
      console.log(err);
    })
  })
}

//from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomPosition(usedPositions)
{
  var position = getRandomInt(100);

  var iter = 0;
  while(usedPositions.indexOf(position) > -1)
  {
      = getRandomInt(100);
    iter++;
    if(iter > 100)
    {
      console.log(usedPositions);
    }
  }
  
  usedPositions.push(position);
  let x = String.fromCharCode(position/10 + 65);
  let y = (position%10).toString();
  
  return x+y;
}

function selectPosition(island)
{
  
}

function move(isDone, usedPositions = [])
{
  let position = randomPosition(usedPositions);
  

  let options = {
    method: 'POST',
    uri: `http://battleship.inseng.net/games/${gameID}/moves`,
    headers: {
      "X-Token": token
    },
    body: {"position": position},
    json: true
  }
  
  return new Promise( function(resolve, reject) {
    requestp(options).then(function (response) {
      gameID = response.id;
      console.log(response);
      if(response.winner == null)
        move(response.winner == null ? false: true, usedPositions)
      resolve(response.board);
      //console.log('body:', body); // Print the HTML for the Google homepage.
    }).catch(function (err) {
      console.log(err);
    });
  });
}

async function playGame()
{
  await createGame().then(joinGame).then(move);
  console.log(token);
}

playGame();