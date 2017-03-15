//Author: Keoagile M. Dinake 
//Date: 09 MARCH 2017 
//TODO: Game Logic for Tic-Tac-Toe  
class GameNode {
    constructor() {
        this.isLeaf = true; // by default no node has a child
        this.isMax = true;  // nodes is either MAX or MIn
        this.state = null; // represents state of the board
        this.level = -1; // higher levels indicate lower levels on tree
        this.parent = null;
        this.children = [];
        this.score = {
            alpha: Number.POSITIVE_INFINITY,
            beta: Number.NEGATIVE_INFINITY
        }
    }

    printNode(){
        console.log(`Node INFO:\nisMax = ${this.isMax}\t\tLevel = ${this.level}`
            +`\nAlpha = ${this.score.alpha}\tBeta = ${this.score.beta}`);
        if(!this.isLeaf && this.children !== undefined && this.children !== null){
            console.log('\nChildren:\n');
            for(var i = 0; i < this.children.length; i++){
                console.log(`Child [${(i + 1)}] = `);
                if(this.children[i] !== undefined || this.children[i] !== null){
                    //this.children[i].printNode();
                } else {
                    //console.log("Warning -> child Reference Error");
                }
            }
        } else {
            console.log('\nNo children');
        }
    }
}

class GameTree {
        constructor(){
            this.root = null;
            this.limit = 0;
        }

        insert(state){
            // Insert at root
            if(this.root === undefined || this.root === null){
                //console.log("insert at head");
                this.root = new GameNode();
                this.root.state = state;
                this.root.level = state.availableCells;
                this.printTree();
                return true;
            }

            const newGameNode = new GameNode();
            newGameNode.state = state;
            newGameNode.level = state.availableCells;
            if(newGameNode.level % 2 === 0){
                newGameNode.isMax = false; // max nodes on odd levels & min nodes on even levels
            }
            this.limit = 0;
            this.rec_insert(this.root, newGameNode);
        }

        rec_insert(iter, node){
            if(iter === undefined || iter === null){
                console.log("Warning -> iter is undefined || null");
                return;
            }

            if (node === undefined || node === null){
                console.log("Warning -> node is undefined || null");
                return;
            }

            if(node.level === iter.level){
                // Check not to add at root again
                if(iter === this.root){
                    console.log("Warning -> CANT add at root again");
                    return;
                }
                // Check if parent exists
                if(iter.parent === undefined || iter.parent === null){
                    console.log("Warning -> Parent does NOT exists");
                    return;
                }
                // Insert as sibling of iter
                node.parent = iter.parent;
                iter.parent.children.push(node);
                //console.log("Insert as sibling of iter");
                return;
            }
            // Insert as child of iter
            if(node.level === (iter.level - 1) && this.limit < 3){
                node.parent = iter;
                iter.children.push(node);
                this.limit = this.limit + 1;
                iter.isLeaf = false;
                console.log("Insert as child of iter + limit => %d", this.limit);
                return;
            }
            // Insert as some granchild of iter
            if(iter.children !== undefined && iter.children !== null){
                //console.log("Insert as some granchild of iter");
                for(var c = 0; c < iter.children.length; c++){
                    if(iter.children[c] !== undefined && iter.children[c] !== null){
                        this.rec_insert(iter.children[c], node);
                    }
                }
                //console.log("BackTRACKED to iter");
            }
        }

        printTree(){
            this.rec_printTree(this.root);
        }

        rec_printTree(node){
            if(node !== undefined && node !== null){
                node.printNode();
                if(!node.isLeaf){
                    for(var i = 0; i < node.children.length; i++)
                        this.rec_printTree(node.children[i]);
                }
            }
        }
}

class Player{
    constructor(name, symbol) {
        this.name = name;
        this.score = {
             wins: 0,
             loses: 0,
             draws: 0
        }
        this.symbol = symbol;
    }

    getScore(){
         return (
             `<span>W ${this.score.wins}</span>
             <span>D ${this.score.draws}</span>
             <span>L ${this.score.loses}</span>`
          );
    }
}

class AIPlayer extends Player {
    constructor() {
        super("Intelli Bot", "o");
        this.tree = new GameTree();
        this.symbols = ['x', 'o'];
    }

    buildTree(board){
        /*
        This method builds and returns an Alpha-Beta Game Tree.
        O(n^3) -> not great, but this is due to the fact that JS makes shallow copies
        in single line operations i.e tempBoard.state = board.state will result
        in the same object reference, provided the object/array is multidimensional.
        Hence I was compelled to write my own deep copy. Nonetheless, the algorithm
        is feasible since n is guaranteed to be relatively small.
        */
       if(board === undefined || board === null){
           return null;
       }

       if(board.state === undefined || board.state === null){
           return null;
       }

       if(this.limit === 3){ return; }

       //console.log("CurrentBoard => ", board);
       this.tree.insert(board);
       for(var i = 0; i < 3; i++){
           for(var j = 0; j < 3; j++){
               if(board.state[i][j] === ''){
                   var tempBoard = new Board();
                   for(var x = 0; x < 3; x++){
                       tempBoard.state[x] = [...board.state[x]];
                   }
                   tempBoard.state[i][j] = this.symbols[j % 2];
                   tempBoard.availableCells = board.availableCells - 1;
                   this.buildTree(tempBoard);
               }
           }
       }
    }

    destroyTree(tree){
        /*
        As implied by the name, this method destroys a game tree.
        */
    }

    evaluate(tree){
        /*
        This method will use the A*Search Algorithm to intelligently guide
        find a solution. By no means is learning employed at this stage of this
        implementation.
        */
    }

    generateMoves(tree){
            /**
             *  This method will take a search tree and return an Array
             *  containing the best possible moves
             */
    }

    bestMove(arrMoves){
        /**
         * This method will take in an array of moves, choose and return
         * the most optimal move, encapsulated in an MoveObj.
         */
    }

    finalizeMove(board, moveObj) {
        if(board === undefined || board === null){
            console.log("Error -> board is undefined or null. finalizeMove aborted");
            return false;
        } else if (moveObj === undefined || moveObj === null){
            console.log("Error -> board is undefined or null. finalizeMove aborted");
            return false;
        }

        if(board.state === undefined || board.state === null){
            console.log("Error -> board's state is undefined or null. finalizeMove aborted");
            return false;
        }
        if(moveObj.row === undefined || moveObj.row === null){
            console.log("Error -> moveObj's row is undefined or null. finalizeMove aborted");
            return false;
        }
        if(moveObj.col === undefined || moveObj.col === null){
            console.log("Error -> moveObj's col is undefined or null. finalizeMove aborted");
            return false;
        }
        if(moveObj.symbol === undefined || moveObj.symbol === null){
            console.log("Error -> moveObj's symbol is undefined or null. finalizeMove aborted");
            return false;
        }

        var r = moveObj.row, c = moveObj.col;

        board.state[r][c] = moveObj.symbol;
        var cell = document.querySelector(`div[data-row=${r} data-col=${c}]`);
        if(cell === undefined || cell === null){
            console.log("Error -> cell is undefined or null. finalizeMove aborted");
            return false;
        }
        cell.innerHTML = board.state[r][c];
        return true;
    }
    pruneTree(tree){

    }

    makeMove(board){
        this.buildTree(board);
        this.tree.printTree();
    }
}

class Board {
    constructor() {
        this.state = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.availableCells = 9;
        this.hasWinner = false;
        this.hasDraw = false;
        this.winningSymbol = '';
    }
    reset(){
        this.state = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.availableCells = 9;
    }
    evaluateBoardState(){
        if(this.state[0][0] === this.state[0][1] && this.state[0][1] === this.state[0][2]){ // row 1
            this.hasWinner = true;
            this.winningSymbol = this.state[0][0];
        } else if(this.state[1][0] === this.state[1][1] && this.state[1][1] === this.state[1][2]){ // row 2
            this.hasWinner = true;
            this.winningSymbol = this.state[1][0];
        } else if(this.state[2][0] === this.state[2][1] && this.state[2][1] === this.state[2][2]){ // row 3
            this.hasWinner = true;
            this.winningSymbol = this.state[2][0];
        } else if(this.state[0][0] === this.state[1][0] && this.state[1][0] === this.state[2][0]){ // col 1
            this.hasWinner = true;
            this.winningSymbol = this.state[0][0];
        } else if(this.state[0][1] === this.state[1][1] && this.state[1][1] === this.state[2][1]){ // col 2
            this.hasWinner = true;
            this.winningSymbol = this.state[0][1];
        } else if(this.state[0][2] === this.state[1][2] && this.state[1][2] === this.state[2][2]){ // col 3
            this.hasWinner = true;
            this.winningSymbol = this.state[0][2];
        } else if(this.state[0][0] === this.state[1][1] && this.state[1][1] === this.state[2][2]){ // diag 1 -> 2
            this.hasWinner = true;
            this.winningSymbol = this.state[0][0];
        } else if(this.state[0][2] === this.state[1][1] && this.state[1][1] === this.state[2][0]){ // diag 2 -> 1
            this.hasWinner = true;
            this.winningSymbol = this.state[0][2];
        } else {
            if(this.availableCells == 0){
                this.hasDraw = true;
            } else {
                this.hasWinner = false;
                this.winningSymbol = '';
            }
        }
        if(this.winningSymbol === ''){
            this.hasWinner = false;
        }
    }
}

function printBoard(board, elem){
    if(board !== undefined && board !== null){
        if(board.state !== undefined || board.state !== null){
            var sBoard = "";
            for(var i = 0; i < 3; i++){
                sBoard += '<div class="row">';
                for(var j = 0; j < 3; j++){
                    sBoard += `<div class="col" data-row ="${i}" data-col="${j}">`;
                    if(board.state[i][j] !== undefined && board.state[i][j] !== null && board.state[i][j] !== ''){
                        sBoard += board.state[i][j];
                    }
                    sBoard += '</div>';
                }
                sBoard += '</div>';
            }
            if(sBoard !== "" && (elem !== undefined || elem !== null)){
                elem.innerHTML = sBoard;
            } else {
                console.error("Error -> Proccessing printBoard failed.");
            }
        } else {
            console.error("Error -> Board's state is undefined or null.");
        }
    } else {
        console.error("Error -> Board is undefined or null.");
    }
}

function showScores(score, name, player){
    if(score === undefined || score === null){
        console.error("Error -> Player score board is undefined or null.");
        return;
    }

    if(name === undefined || name === null){
        console.error("Error -> Player name board is undefined or null.");
        return;
    }

    if(player === undefined || player === null){
        console.error("Error -> Player is undefined or null.");
        return;
    }

    name.innerHTML = player.name;
    score.innerHTML = player.getScore();
}

function updateBoard(cell, board, currentPlayer) {
    if(cell === undefined || cell === null){
        console.log("Error -> Failed to updateBoard, missing cell");
        return false;
    } else if(board === undefined || board === null){
        console.log("Error -> Failed to updateBoard, missing board");
        return false;
    } else if(board.state === undefined || board.state === null){
       console.log("Error -> Failed to updateBoard, missing board state");
       return false;
    } else if(currentPlayer === undefined || currentPlayer === null){
        console.log("Error -> Failed to updateBoard, missing currentPlayer");
        return false;
    }

    if(board.state[cell.dataset.row][cell.dataset.col] == ''){
        board.state[cell.dataset.row][cell.dataset.col] = currentPlayer.symbol;
        cell.innerHTML = board.state[cell.dataset.row][cell.dataset.col];
        board.availableCells--;
        return true;
    }
    return false;
}

function handleClick(e) {
    var endTurn = updateBoard(this, board, currentPlayer);
    if(endTurn === false){ return; }
    board.evaluateBoardState();

    if(board.hasWinner === true){
        _board.innerHTML = `<span class="winner">${currentPlayer.name} Wins</span>`;
        currentPlayer.score.wins += 1;
        if(player.symbol === currentPlayer.symbol){
            bot.score.loses += 1;
        } else {
            player.score.loses += 1;
        }
        _messageBoard.innerHTML = '';
    } else if(board.hasDraw === true){
        _board.innerHTML = `<span class="winner">Draw</span>`;
        player.score.draws += 1;
        bot.score.draws += 1;
        _messageBoard.innerHTML = '';
    } else {
        if(currentPlayer.name == player.name){
            currentPlayer = bot;
        } else {
            currentPlayer = player;
        }
        _messageBoard.innerHTML = `${currentPlayer.name}'s turn`;
        _messageBoard.classList.toggle("w3-animate-bottom");
        if(currentPlayer.name == bot.name){
            bot.makeMove(board);
        }
    }
    showScores(_playerScore, playerName, player);
    showScores(_botScore, botName, bot);
}

function resetBoard(){
    board.reset();
    printBoard(board, _board);
    grid = Array.from(document.querySelectorAll('.col'));
    grid.forEach(col => {
        //console.log('col => ', col);
        col.addEventListener('click', handleClick);
    });
    if(board.hasWinner || board.hasDraw){
        board.hasWinner = false;
        board.hasDraw = false;
    }
}

/* Main */
const board = new Board();
const player = new Player("KMD", 'x');
const bot = new AIPlayer('o');

var currentPlayer = player;
const _board = document.querySelector('#board');
const _messageBoard = document.querySelector('#message');

const _playerScore = document.querySelector('#playerScore');
const _botScore = document.querySelector('#botScore');

const _playerName = document.querySelector('#playerName');
const _botName = document.querySelector('#botName');

const reset_link = document.querySelector('#reset-link');
reset_link.addEventListener('click', resetBoard);
showScores(_playerScore, playerName, player);
showScores(_botScore, botName, bot);
printBoard(board, _board);
var grid = document.querySelectorAll('.col');
for (var i = 0; i < grid.length; i++) {
    if (grid[i] !== undefined && grid[i] !== null) {
        grid[i].addEventListener('click', handleClick);
    }
}

bot.makeMove(board); // make first move
