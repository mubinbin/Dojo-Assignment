// JavaScript source code

/* this is make sure the all html files are loaded in the javascript. the same as putting the javascript at the end of <body> in html */
document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    let width = 10;
    /* bomb amount can be change later on*/
    let bombAmount = 15;
    let squares = [];
    let isGameOver = false;
    let flags = 0;

    //create board
    function createBoard () {
        
        //create bomb array
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width*width - bombAmount).fill('valid');

        // add emptyArray with bombsArray
        const gameArray = emptyArray.concat(bombsArray);

        // shuffle an array in javascrip
        // array.sort(function (a, b) { return 0.5 — Math.random() })
        const shuffleArray = gameArray.sort(() => Math.random() - 0.5);

        
        for (let i = 0; i < width * width; i++) {

            const square = document.createElement('div');
            square.setAttribute('id', i);

            // add class name from shuffleArray to the square
            square.classList.add(shuffleArray[i]);
            grid.appendChild(square);
            squares.push(square);

            // normal click
            // control + left click to add flag
            square.addEventListener('click', function(e) {
                if (event.ctrlKey) {
                    addFlag(square);
                }else if(event.altKey){
                    alt_reveal(square);
                }else{
                    click(square);}
            })

            /* this is right click to add flag
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }*/
        }

        // add numbers to the neighbor sqaures of bombs
        for (let i = 0; i < squares.length; i++){

            let total = 0;
            var isLeftEdge = (i % width === 0);
            var isRightEdge = (i % width === width -1);

            if (squares[i].classList.contains('valid')) {

                // checking left square has a bomb or not
                if (i>0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total++;
                // checking top-right square has a bomb or not
                if (i>9 && !isRightEdge && squares[i+1-width].classList.contains('bomb')) total++;
                //checking top
                if (i>9 && squares[i-width].classList.contains('bomb')) total++;
                // checking top-left square has a bomb or not
                if (i>10 && !isLeftEdge && squares[i-1-width].classList.contains('bomb')) total++;
                // checking bottom
                if (i<90 && squares[i+width].classList.contains('bomb')) total++;
                // checking right
                if (i<99 && !isRightEdge && squares[i+1].classList.contains('bomb')) total++;
                // checking bottom-left
                if (i<90 && !isLeftEdge && squares[i-1+width].classList.contains('bomb')) total++;
                // checking bottom-right
                if (i<89 && !isRightEdge && squares[i+1+width].classList.contains('bomb')) total++;
                
                // number is total
                squares[i].setAttribute('data', total);
                //console.log(squares[i]);
            }
        }
    }

    createBoard();

    // add flag 
    function addFlag(square) {

        if (isGameOver) return;
        if (!square.classList.contains('checked') && flags < width*width+1){
            if(!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🔥';
                flags ++;
                checkWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags --;
            }
        }
    }
    
    // click on square actions
    function click(square) {

        let currentId = square.id;

        // stop when game over
        if (isGameOver) return;
        
        // what happen when click on checked or flag square
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;

        if (square.classList.contains('bomb')) {
            //alert('Game Over')
            //console.log("Game Over");
            // game over function
            gameOver(square);

        } else{
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked');
                // once the square has been checked, display the total number at the same time
                square.innerHTML = total;
                // break cycle
                return;
            }

            checkSquare(square, currentId);
        }
        square.classList.add('checked');
    }

    //reveal function
    function alt_reveal(square){
        let currentId = square.id;
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);
        let correctCount = 0;
        let total = square.getAttribute('data');
        let new_Id = 0;
        let new_Square=0;
        //left
        if(currentId > 0 && !isLeftEdge && squares[parseInt(currentId)-1].classList.contains('flag') && squares[parseInt(currentId)-1].classList.contains('bomb')){
            correctCount++;
        }
        // top-right
        if(currentId > 9 && !isRightEdge && squares[parseInt(currentId)+1-width].classList.contains('flag') && squares[parseInt(currentId)+1-width].classList.contains('bomb')){
            correctCount++;
        }
        // top
        if(currentId > 9 && squares[parseInt(currentId)-width].classList.contains('flag') && squares[parseInt(currentId)-width].classList.contains('bomb')){
            correctCount++;
        }
        //top-left
        if(currentId > 10 && !isLeftEdge && squares[parseInt(currentId)-1-width].classList.contains('flag') && squares[parseInt(currentId)-1-width].classList.contains('bomb')){
            correctCount++;
        }
        //right
        if(currentId < 99 && !isRightEdge && squares[parseInt(currentId)+1].classList.contains('flag') && squares[parseInt(currentId)+1].classList.contains('bomb')){
            correctCount++;
        }
        //bottom
        if(currentId < 90 && squares[parseInt(currentId)+width].classList.contains('flag') && squares[parseInt(currentId)+width].classList.contains('bomb')){
            correctCount++;
        }
        //bottom-left
        if(currentId < 90 && !isLeftEdge && squares[parseInt(currentId)-1+width].classList.contains('flag') && squares[parseInt(currentId)-1+width].classList.contains('bomb')){
            correctCount++;
        }
        //bottom-right
        if(currentId < 89 && !isRightEdge && squares[parseInt(currentId)+1+width].classList.contains('flag') && squares[parseInt(currentId)+1+width].classList.contains('bomb')){
            correctCount++;
        }
        if (correctCount == total){
            if(currentId > 0 && !isLeftEdge && !squares[parseInt(currentId)-1].classList.contains('checked')){
                new_Id = squares[parseInt(currentId) - 1].id;
                new_Square = document.getElementById(new_Id);
                click(new_Square);
            }
            if(currentId > 9 && !isRightEdge && !squares[parseInt(currentId)+1-width].classList.contains('checked')){
                new_Id = squares[parseInt(currentId) + 1 - width].id;
                new_Square = document.getElementById(new_Id);
                click(new_Square);
            }
            if(currentId > 9 && !squares[parseInt(currentId)-width].classList.contains('checked')){
                new_Id = squares[parseInt(currentId) - width].id;
                new_Square = document.getElementById(new_Id);
                click(new_Square);
            }

            if(currentId > 10 && !isLeftEdge && !squares[parseInt(currentId)-width -1].classList.contains('checked')){
                new_Id = squares[parseInt(currentId) - width-1].id;
                new_Square = document.getElementById(new_Id);
                click(new_Square);
            }
            if(currentId < 99 && !isRightEdge && !squares[parseInt(currentId)+1].classList.contains('checked')){
                new_Id = squares[parseInt(currentId)+1].id;
                new_Square = document.getElementById(new_Id);
                click(new_Square);
            }
            if(currentId < 90 && !squares[parseInt(currentId)+width].classList.contains('checked')){
                new_Id = squares[parseInt(currentId)+width].id;
                new_Square = document.getElementById(new_Id);
                click(new_Square);
            }
            if(currentId < 90 && !isLeftEdge && !squares[parseInt(currentId)+width-1].classList.contains('checked')){
                new_Id = squares[parseInt(currentId)+width-1].id;
                new_Square = document.getElementById(new_Id);
                click(new_Square);
            }
            if(currentId < 89 && !isRightEdge && !squares[parseInt(currentId)+width+1].classList.contains('checked')){
                new_Id = squares[parseInt(currentId)+width+1].id;
                new_Square = document.getElementById(new_Id);
                click(new_Square);
            }
        }
    }

    // check neighboring squares once square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(() => {
            // check left
            if (currentId > 0 && !isLeftEdge){
                                      //parseInt here makes sure this is number not string
                const newId = squares[parseInt(currentId) - 1].id;
                const newSqure = document.getElementById(newId);
                click(newSqure);
            }
            // check top-right
            if (currentId > 9 && !isRightEdge){
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSqure = document.getElementById(newId);
                click(newSqure);
            }
            // check top
            if (currentId > 9 ){
                const newId = squares[parseInt(currentId) - width].id;
                const newSqure = document.getElementById(newId);
                click(newSqure);
            }
            // check top-left
            if (currentId > 10 && !isLeftEdge ){
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSqure = document.getElementById(newId);
                click(newSqure);
            }
            // check right
            if (currentId < 99 && !isRightEdge ){
                const newId = squares[parseInt(currentId) + 1].id;
                const newSqure = document.getElementById(newId);
                click(newSqure);
            }
            // check bottom
            if (currentId < 90){
                const newId = squares[parseInt(currentId) + width].id;
                const newSqure = document.getElementById(newId);
                click(newSqure);
            }
            // check bottom-left
            if (currentId < 90 && !isLeftEdge){
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSqure = document.getElementById(newId);
                click(newSqure);
            }
            // check bottom-right
            if (currentId < 89 && !isRightEdge){
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSqure = document.getElementById(newId);
                click(newSqure);
            }
        }, 10)
    }

    function gameOver(square) {
        //show all bombs location
        squares.forEach(square => {
            if (square.classList.contains('bomb')){
                square.innerHTML = '💣';
            }
        })

        isGameOver = true;
        alert('BOOM! GAME OVER!!');
        
        // refresh page
        location.reload();    
    }

    // check for win
    function checkWin() {
        let match = 0;

        for (let i =0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                match ++;
            }
            
        }
        if (match === bombAmount) {
            isGameOver = true;
            alert('YOU WIN!');
            location.reload();
        }
    }

})
