


import * as  prompt from 'prompt' ; 

let SinglePlayer:number = 0 ;  // determine whether it is singleor multiplayer mode
let boardSize:number = 0 ;   // size of the board

let Board : string[][] ; 
// let allWinnings : string[][] ; 
let allWinnings : number[][][] ;   // // it is an array contains the all possible wiining combination 



// // function to initialize the board with empty string
function initializeBoard() : void 
{
    Board = [] ; 
    for(let i=0; i<boardSize; i++)
    {
        let boardRow :string [] = []  ;
        for(let j=0; j<boardSize; j++)
        {
            boardRow.push(' ') ; 
        }
        Board.push(boardRow) ; 
    }
    printBoard() ; // call the function to print the board after initialization
}
// //  // function to print the board 
function printBoard() : void 
{
    for(let i=0; i<boardSize; i++)
    {
        let boardRow = '| ' ; 
        for(let j=0; j<boardSize; j++)
        {
            boardRow += Board[i][j] + ' | ' ;
        }
        console.log(boardRow) ;
    }
}


// //  // // function to generate  all possible wiining combination 
function generateAllPossibleWinnings()  : void 
{
    allWinnings = [] ; 
    for(let i=0; i<boardSize; i++)
    {
        let rowWinnings:number[][] = []  ;
        let colWinnings:number[][] = []  ;
        for(let j=0; j<boardSize; j++)
        {
            rowWinnings.push([i, j]) ; 
            colWinnings.push([j, i]) ; 
        }
        allWinnings.push(rowWinnings) ;
        allWinnings.push(colWinnings) ;
    }
    let diaWinnings1:number[][] = []  ;
    let diaWinnings2:number[][] = []  ;
    for(let i=0; i<boardSize; i++)
    {
        diaWinnings1.push([i,i] ) ; 
        diaWinnings2.push([i, boardSize-1-i] ) ; 
    }
    allWinnings.push(diaWinnings1) ;
    allWinnings.push(diaWinnings2) ;
    printAllPossibleWinnings() ;
}
// // fuction to print the all possible winnings combination 
function printAllPossibleWinnings() : void 
{
    let sz = allWinnings.length ; 
    for(let i=0; i<sz; i++)
    {
        let rowstr = '| ' ; 
        for(let j=0; j<boardSize; j++)
        {
            rowstr += `${allWinnings[i][j]}` + " | " ; 
        }
        console.log(rowstr) ; 
    }
}


// //  function to check whether player is win the game or not
function checkWin( player : string ) : boolean
{
    let sz = allWinnings.length
    for(let i=0; i<sz; i++)
    {
        let ct = 0 ;  
        for(let j=0; j<allWinnings[i].length; j++)
        {
            let [x,y] = allWinnings[i][j] ; 
            // console.log(x,y) ; 
            if(  Board[x][y] == player ) ct++ ; 
        }
        if( ct == boardSize ) return true ; 
    }
    return false ;   
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








function AiTurn() : void 
{
    let bestScore = -Infinity;
    // let move ; 
    let move: { i: number, j: number } | undefined = undefined; 

    // Iterate through all empty cells
    for(let i=0; i<boardSize; i++) 
    {
        for(let j=0; j<boardSize; j++) 
        {
            if(Board[i][j] === ' ') 
            {
                Board[i][j] = 'O';
                let score = minimax(Board, 0, false);
                Board[i][j] = ' ';
                console.log(score) ; 
                if(score > bestScore) 
                {
                    bestScore = score;
                    move = {i, j};
                }
            }
        }
    }
    // Board[move.i][move.j] = 'O'; // //  shows warning as error but code works
    if (move !== undefined) Board[move.i][move.j] = 'O';
    else {
        console.error("No available moves for AI.");
    }
}
// // // minimax algorithm to find the best possible move on 
function minimax(board: string[][], depth: number, isMaximizing: boolean): number 
{
    // Check if the game is over or if it's a terminal state
    if(checkWin('X'))  return -1;
    else if(checkWin('O'))  return 1;
    else if(isBoardFull())  return 0;
    console.log(depth) ; 
    if(isMaximizing) 
    {
        // Maximizing player's turn for player 'O' or Ai turn
        let bestScore = -Infinity;
        for(let i=0; i<boardSize; i++) 
        {
            for(let j=0; j<boardSize; j++) 
            {
                if(board[i][j] === ' ') 
                {
                    board[i][j] = 'O'; 
                    let score = minimax(board, depth+1, false);
                    board[i][j] = ' '; 
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } 
    else 
    { 
        // Minimizing player's turn forplayer 'X'
        let bestScore = Infinity;
        for(let i=0; i<boardSize; i++) 
        {
            for(let j=0; j<boardSize; j++) 
            {
                if(board[i][j] === ' ') 
                {
                    board[i][j] = 'X'; 
                    let score = minimax(board, depth+1, true);
                    board[i][j] = ' '; 
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}























// //  this function will check whether board is full or not and if full then match will draw
function isBoardFull(): boolean 
{
    for(let i=0; i<boardSize; i++) 
    {
        for(let j=0; j<boardSize; j++) 
        {
            if(Board[i][j] === ' ') 
            {
                return false; // Found an empty cell, board is not full
            }
        }
    }
    return true; // Board is full
}


// //  to check postion co ordinates have in the range or 0 to boardSize
function validPosition( i:number , j:number ) : boolean
{
    return i>=0 && j>=0 && i<boardSize && j<boardSize ;
}

// //  funciton to play the each plyer turn
function playerTurn( player: string) : void
{
    if(isBoardFull()) 
    {
        console.log("Match draw ") ;  
        return ;  
    }
    if( SinglePlayer === 1 && player === 'O' )
    {
        console.log( `Player  ${player} Turn  :  it will automatically fill it  ` ) ;
        AiTurn() ; 
        printBoard() ;
        if( checkWin(player) )
        {
            console.log( ` ${player} won the game ` ) ; 
            return ; 
        }
        playerTurn('X') ;
    }
    else
    {
        console.log( `Player  ${player} Turn  :  Enter position in i,j format  ` ) ; 
        prompt.get( ['position'] , function( err:any , result:any ) {
            if( result && result.position )
            {
                const [i,j] = result.position.split(',').map((num:string)=>parseInt(num)) ; 
                if( validPosition(i,j) )
                {
                    // if (Board[i][j] !== 'X' && Board[i][j] !== 'O')
                    if( Board[i][j] === ' ' )
                    {
                        Board[i][j] = player  ;
                        printBoard() ;
                        if( checkWin(player) )
                        {
                            console.log( ` ${player} won the game ` ) ; 
                            return ; 
                        }
                        if(player === 'X' )  playerTurn('O') ;
                        else  playerTurn('X') ;
                    }
                    else 
                    {
                        console.log( " This position is already filled enter another position " ) ; 
                        playerTurn(player) ; 
                    }
                }
                else
                {
                    console.log( "Please enter the valid position  !") ; 
                    playerTurn(player) ; 
                }
            }
            else
            {
                console.log( " Please Enter the numbers in  i,j format " ) ;
                playerTurn(player) ;  
            }
        })
    }
}





// //  after selecting game mode player can strt the game and enter the size of the board
function startPlaying() : void 
{
    console.log( "Enter the size of the board" ) ; 
    prompt.get( ['size'] , function(err:any , result:any) {
        let size:number = parseInt(result.size) ; 
        if( size > 2 )
        {
            boardSize = size ; 
            console.log(boardSize) ; 
            initializeBoard() ; 
            generateAllPossibleWinnings() ; 
            playerTurn('X') ; 
        }
        else 
        {
            console.log("Please enter the size in numbers greater than or equal to 3") ;  
            startPlaying() ; 
        }
    })
}




// //  function to choosethe game mode i.e sinle player or multiplyer mode
function chooseGameMode() : void 
{
    console.log("Start the game by selecting the game mode ") ; 
    console.log( "1  :  For the Single Player Mode " ) ; 
    console.log( "2  :  For the Multi Player Mode " ) ; 
    prompt.get( ['mode'] ,function(err:any , result:any) {
        const mode:number =  parseInt(result.mode) ; 
        if( mode === 1)
        {
            console.log('Single Player mode selected.');
            startPlaying() ;
            SinglePlayer = 1 ; 
        }
        else if( mode === 2)
        {
            console.log('Multi Player mode selected.');
            startPlaying() ;
        }
        else 
        {
            console.log("Invalid choice. Please enter 1 for Single Player or 2 for Multiplayer.");
            chooseGameMode();
        }
    })
}

chooseGameMode() ; 






















































































