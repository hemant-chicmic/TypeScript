"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prompt = require("prompt");
var SinglePlayer = 0; // determine whether it is singleor multiplayer mode
var boardSize = 0; // size of the board
var Board;
// let allWinnings : string[][] ; 
var allWinnings; // // it is an array contains the all possible wiining combination 
// // function to initialize the board with empty string
function initializeBoard() {
    Board = [];
    for (var i = 0; i < boardSize; i++) {
        var boardRow = [];
        for (var j = 0; j < boardSize; j++) {
            boardRow.push(' ');
        }
        Board.push(boardRow);
    }
    printBoard(); // call the function to print the board after initialization
}
// //  // function to print the board 
function printBoard() {
    for (var i = 0; i < boardSize; i++) {
        var boardRow = '| ';
        for (var j = 0; j < boardSize; j++) {
            boardRow += Board[i][j] + ' | ';
        }
        console.log(boardRow);
    }
}
// //  // // function to generate  all possible wiining combination 
function generateAllPossibleWinnings() {
    allWinnings = [];
    for (var i = 0; i < boardSize; i++) {
        var rowWinnings = [];
        var colWinnings = [];
        for (var j = 0; j < boardSize; j++) {
            rowWinnings.push([i, j]);
            colWinnings.push([j, i]);
        }
        allWinnings.push(rowWinnings);
        allWinnings.push(colWinnings);
    }
    var diaWinnings1 = [];
    var diaWinnings2 = [];
    for (var i = 0; i < boardSize; i++) {
        diaWinnings1.push([i, i]);
        diaWinnings2.push([i, boardSize - 1 - i]);
    }
    allWinnings.push(diaWinnings1);
    allWinnings.push(diaWinnings2);
    printAllPossibleWinnings();
}
// // fuction to print the all possible winnings combination 
function printAllPossibleWinnings() {
    var sz = allWinnings.length;
    for (var i = 0; i < sz; i++) {
        var rowstr = '| ';
        for (var j = 0; j < boardSize; j++) {
            rowstr += "".concat(allWinnings[i][j]) + " | ";
        }
        console.log(rowstr);
    }
}
// //  function to check whether player is win the game or not
function checkWin(player) {
    var sz = allWinnings.length;
    for (var i = 0; i < sz; i++) {
        var ct = 0;
        for (var j = 0; j < allWinnings[i].length; j++) {
            var _a = allWinnings[i][j], x = _a[0], y = _a[1];
            // console.log(x,y) ; 
            if (Board[x][y] == player)
                ct++;
        }
        if (ct == boardSize)
            return true;
    }
    return false;
}
// // //  Implemeted using simple math.random function
// // //  it is for ai turn when user play in single player mode
// function AiTurn() : void
// {
//     let emptyCells = []  ;
//     for(let i=0; i<boardSize; i++)
//     {
//         for(let j=0; j<boardSize; j++)
//         {
//             if( Board[i][j] === ' ' ) emptyCells.push( [i,j] ) ; 
//         }
//     }
//     const randomIndex = Math.floor(Math.random()*emptyCells.length) ; 
//     const randomCell = emptyCells[randomIndex] ;
//     const [x,y] = randomCell ; 
//     Board[x][y] = 'O' ;
// }
// // //  Implemeted using MiniMax algo 
// // // it is for ai turn when user play in single player mode
function AiTurn() {
    var bestScore = -Infinity;
    var move;
    // Iterate through all empty cells
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (Board[i][j] === ' ') {
                Board[i][j] = 'O';
                var score = minimax(Board, 0, false);
                Board[i][j] = ' ';
                console.log(score);
                if (score > bestScore) {
                    bestScore = score;
                    move = { i: i, j: j };
                }
            }
        }
    }
    Board[move.i][move.j] = 'O';
}
// // // minimax algorithm to find the best possible move on 
function minimax(board, depth, isMaximizing) {
    // Check if the game is over or if it's a terminal state
    if (checkWin('X'))
        return -1;
    else if (checkWin('O'))
        return 1;
    else if (isBoardFull())
        return 0;
    console.log(depth);
    if (isMaximizing) {
        // Maximizing player's turn for player 'O' or Ai turn
        var bestScore = -Infinity;
        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                if (board[i][j] === ' ') {
                    board[i][j] = 'O';
                    var score = minimax(board, depth + 1, false);
                    board[i][j] = ' ';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    }
    else {
        // Minimizing player's turn forplayer 'X'
        var bestScore = Infinity;
        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                if (board[i][j] === ' ') {
                    board[i][j] = 'X';
                    var score = minimax(board, depth + 1, true);
                    board[i][j] = ' ';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}
// //  this function will check whether board is full or not and if full then match will draw
function isBoardFull() {
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (Board[i][j] === ' ') {
                return false; // Found an empty cell, board is not full
            }
        }
    }
    return true; // Board is full
}
// //  to check postion co ordinates have in the range or 0 to boardSize
function validPosition(i, j) {
    return i >= 0 && j >= 0 && i < boardSize && j < boardSize;
}
// //  funciton to play the each plyer turn
function playerTurn(player) {
    if (isBoardFull()) {
        console.log("Match draw ");
        return;
    }
    if (SinglePlayer === 1 && player === 'O') {
        console.log("Player  ".concat(player, " Turn  :  it will automatically fill it  "));
        AiTurn();
        printBoard();
        if (checkWin(player)) {
            console.log(" ".concat(player, " won the game "));
            return;
        }
        playerTurn('X');
    }
    else {
        console.log("Player  ".concat(player, " Turn  :  Enter position in i,j format  "));
        prompt.get(['position'], function (err, result) {
            if (result && result.position) {
                var _a = result.position.split(',').map(function (num) { return parseInt(num); }), i = _a[0], j = _a[1];
                if (validPosition(i, j)) {
                    // if (Board[i][j] !== 'X' && Board[i][j] !== 'O')
                    if (Board[i][j] === ' ') {
                        Board[i][j] = player;
                        printBoard();
                        if (checkWin(player)) {
                            console.log(" ".concat(player, " won the game "));
                            return;
                        }
                        if (player === 'X')
                            playerTurn('O');
                        else
                            playerTurn('X');
                    }
                    else {
                        console.log(" This position is already filled enter another position ");
                        playerTurn(player);
                    }
                }
                else {
                    console.log("Please enter the valid position  !");
                    playerTurn(player);
                }
            }
            else {
                console.log(" Please Enter the numbers in  i,j format ");
                playerTurn(player);
            }
        });
    }
}
// //  after selecting game mode player can strt the game and enter the size of the board
function startPlaying() {
    console.log("Enter the size of the board");
    prompt.get(['size'], function (err, result) {
        var size = parseInt(result.size);
        if (size > 2) {
            boardSize = size;
            console.log(boardSize);
            initializeBoard();
            generateAllPossibleWinnings();
            playerTurn('X');
        }
        else {
            console.log("Please enter the size in numbers greater than or equal to 3");
            startPlaying();
        }
    });
}
// //  function to choosethe game mode i.e sinle player or multiplyer mode
function chooseGameMode() {
    console.log("Start the game by selecting the game mode ");
    console.log("1  :  For the Single Player Mode ");
    console.log("2  :  For the Multi Player Mode ");
    prompt.get(['mode'], function (err, result) {
        var mode = parseInt(result.mode);
        if (mode === 1) {
            console.log('Single Player mode selected.');
            startPlaying();
            SinglePlayer = 1;
        }
        else if (mode === 2) {
            console.log('Multi Player mode selected.');
            startPlaying();
        }
        else {
            console.log("Invalid choice. Please enter 1 for Single Player or 2 for Multiplayer.");
            chooseGameMode();
        }
    });
}
chooseGameMode();
