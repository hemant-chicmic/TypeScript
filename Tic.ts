




import * as prompt from 'prompt';

let SinglePlayer: number = 0; // determine whether it is single or multiplayer mode
let boardSize: number = 0; // size of the board

let Board: string[][];
let allWinnings: number[][][]; // it is an array contains the all possible winning combination

// function to initialize the board with empty string
function initializeBoard(): void 
{
    Board = [];
    for (let i = 0; i < boardSize; i++) 
    {
        let boardRow: string[] = [];
        for (let j = 0; j < boardSize; j++) 
        {
            boardRow.push(' ');
        }
        Board.push(boardRow);
    }
    printBoard(); // call the function to print the board after initialization
}

// function to print the board
function printBoard(): void 
{
    for (let i = 0; i < boardSize; i++) 
    {
        let boardRow = '| ';
        for (let j = 0; j < boardSize; j++) 
        {
            boardRow += Board[i][j] + ' | ';
        }
        console.log(boardRow);
    }
}

// function to generate all possible winning combinations
function generateAllPossibleWinnings(): void 
{
    allWinnings = [];
    for (let i = 0; i < boardSize; i++) 
    {
        let rowWinnings: number[][] = [];
        let colWinnings: number[][] = [];
        for (let j = 0; j < boardSize; j++) 
        {
            rowWinnings.push([i, j]);
            colWinnings.push([j, i]);
        }
        allWinnings.push(rowWinnings);
        allWinnings.push(colWinnings);
    }
    let diaWinnings1: number[][] = [];
    let diaWinnings2: number[][] = [];
    for (let i = 0; i < boardSize; i++) 
    {
        diaWinnings1.push([i, i]);
        diaWinnings2.push([i, boardSize - 1 - i]);
    }
    allWinnings.push(diaWinnings1);
    allWinnings.push(diaWinnings2);
    printAllPossibleWinnings();
}

// function to print all possible winning combinations
function printAllPossibleWinnings(): void 
{
    let sz = allWinnings.length;
    for (let i = 0; i < sz; i++) 
    {
        let rowstr = '| ';
        for (let j = 0; j < boardSize; j++) 
        {
            rowstr += `${allWinnings[i][j]}` + ' | ';
        }
        console.log(rowstr);
    }
}

// function to check whether player has won the game or not
function checkWin(player: string): boolean 
{
    let sz = allWinnings.length;
    for (let i = 0; i < sz; i++) 
    {
        let ct = 0;
        for (let j = 0; j < allWinnings[i].length; j++) 
        {
            let [x, y] = allWinnings[i][j];
            if (Board[x][y] === player) ct++;
        }
        if (ct === boardSize) return true;
    }
    return false;
}







// AI's turn using a simple heuristic algorithm
function AiTurn(): void 
{
    let emptyCells = [];
    for (let i = 0; i < boardSize; i++) 
    {
        for (let j = 0; j < boardSize; j++) 
        {
            if (Board[i][j] === ' ') emptyCells.push([i, j]);
        }
    }
    // Check if AI can win in the next move
    for (let i = 0; i < emptyCells.length; i++) 
    {
        const [x, y] = emptyCells[i];
        Board[x][y] = 'O';
        if (checkWin('O')) return;
        Board[x][y] = ' ';
    }
    // Check if player can win in the next move and block it
    for (let i = 0; i < emptyCells.length; i++) 
    {
        const [x, y] = emptyCells[i];
        Board[x][y] = 'X';
        if (checkWin('X')) 
        {
            Board[x][y] = 'O';
            return;
        }
        Board[x][y] = ' ';
    }
    // If neither winning nor blocking, make a random move
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const [x, y] = randomCell;
    Board[x][y] = 'O';
}








   


// function to check if the board is full
function isBoardFull(): boolean 
{
    for (let i = 0; i < boardSize; i++) 
    {
        for (let j = 0; j < boardSize; j++) 
        {
            if (Board[i][j] === ' ') 
            {
                return false; // Found an empty cell, board is not full
            }
        }
    }
    return true; // Board is full
}


// to check position coordinates have in the range or 0 to boardSize
function validPosition(i: number, j: number): boolean 
{
    return i >= 0 && j >= 0 && i < boardSize && j < boardSize;
}

// function to play each player's turn
function playerTurn(player: string): void 
{
    if (isBoardFull()) 
    {
        console.log("Match draw ");
        return;
    }
    if (SinglePlayer === 1 && player === 'O') 
    {
        console.log(`Player ${player} Turn :  it will automatically fill it `);
        AiTurn();
        printBoard();
        if (checkWin(player)) 
        {
            console.log(` ${player} won the game `);
            return;
        }
        playerTurn('X');
    } 
    else 
    {
        console.log(`Player ${player} Turn :  Enter position in i,j format  `);
        prompt.get(['position'], function (err: any, result: any) 
        {
            if (result && result.position) 
            {
                const [i, j] = result.position.split(',').map((num: string) => parseInt(num));
                if (validPosition(i, j)) 
                {
                    if (Board[i][j] === ' ') 
                    {
                        Board[i][j] = player;
                        printBoard();
                        if (checkWin(player)) 
                        {
                            console.log(` ${player} won the game `);
                            return;
                        }
                        if (player === 'X') 
                        {
                            playerTurn('O');
                        } 
                        else 
                        {
                            playerTurn('X');
                        }
                    } 
                    else 
                    {
                        console.log(" This position is already filled enter another position ");
                        playerTurn(player);
                    }
                } 
                else 
                {
                    console.log("Please enter a valid position!");
                    playerTurn(player);
                }
            } 
            else 
            {
                console.log(" Please Enter the numbers in i,j format ");
                playerTurn(player);
            }
        })
    }
}

// After selecting game mode, player can start the game and enter the size of the board
function startPlaying(): void 
{
    console.log("Enter the size of the board");
    prompt.get(['size'], function (err: any, result: any) 
    {
        let size: number = parseInt(result.size);
        if (size > 2) 
        {
            boardSize = size;
            console.log(boardSize);
            initializeBoard();
            generateAllPossibleWinnings();
            playerTurn('X');
        } 
        else 
        {
            console.log("Please enter the size as a number greater than or equal to 3");
            startPlaying();
        }
    })
}

// Function to choose the game mode: single player or multiplayer
function chooseGameMode(): void 
{
    console.log("Start the game by selecting the game mode");
    console.log("1: For Single Player Mode");
    console.log("2: For Multiplayer Mode");
    prompt.get(['mode'], function (err: any, result: any) 
    {
        const mode: number = parseInt(result.mode);
        if (mode === 1) 
        {
            console.log('Single Player mode selected.');
            startPlaying();
            SinglePlayer = 1;
        } 
        else if (mode === 2) 
        {
            console.log('Multiplayer mode selected.');
            startPlaying();
        } 
        else 
        {
            console.log("Invalid choice. Please enter 1 for Single Player or 2 for Multiplayer.");
            chooseGameMode();
        }
    })
}

chooseGameMode();












































