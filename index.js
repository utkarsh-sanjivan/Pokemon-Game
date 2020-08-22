let currentPos = { cordX: 0, cordY: 0, cenX: 10, cenY: 10 };
let pokeBallPos = [];
let score = 0;
let canvas = {};
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let pokemonImage = new Image();
pokemonImage.ready = false;
pokemonImage.onload = setAssetReady;
pokemonImage.src = 'images/pokemon.png';
let pokeBallImage = new Image();
pokeBallImage.ready = false;
pokeBallImage.onload = setAssetReady;
pokeBallImage.src = 'images/pokeball.png';

pokeBallImage.onload = function() {
    setInterval(() => {
        if (pokeBallPos.length<5) {
            const ctx = canvas.getContext('2d');
            const cordX = Math.round(Math.random()*(canvas.width-20));
            const cordY = Math.round(Math.random()*(canvas.height-20));
            if (!checkPokeBallAvailability(cordX+10, cordY+10) && getDistance(currentPos.cordX, currentPos.cordY, cordX+10, cordY+10) > 20) {
                pokeBallPos.push({ cordX, cordY, cenX: cordX+10, cenY: cordY+10 });
            };
            pokeBallPos.forEach(ballPos => drawPokeBall(ctx, ballPos.cordX, ballPos.cordY));
            drawPokemon(ctx, currentPos.cordX, currentPos.cordY);
        }
    }, 3000);
};

function setAssetReady() {
	this.ready = true;
}

(function(window, document, undefined){
    window.onload = init;
    function init(){
        canvas = document.getElementById('game');
        document.getElementById('score-hundreth').innerHTML = '0';
        document.getElementById('score-tenth').innerHTML = '0';
        document.getElementById('score-one').innerHTML = '0';
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#95c262';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            pokemonImage.onload = function() {
                drawPokemon(ctx, 0, 0);
            };
            setInterval(update, 50);		
            document.addEventListener("keydown",keyDownHandler, false);	
		    document.addEventListener("keyup",keyUpHandler, false);	
        };
    }

})(window, document, undefined);

function onRestart() {
    const ctx = canvas.getContext('2d');
    currentPos = { cordX: 0, cordY: 0, cenX: 10, cenY: 10 };
    pokeBallPos = [];
    score = 0;
    ctx.fillStyle = '#95c262';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById('score-hundreth').innerHTML = '0';
    document.getElementById('score-tenth').innerHTML = '0';
    document.getElementById('score-one').innerHTML = '0';
    pokeBallPos.forEach(ballPos => drawPokeBall(ctx, ballPos.cordX, ballPos.cordY));
    drawPokemon(ctx, currentPos.cordX, currentPos.cordY);
}

function getDistance(xA, yA, xB, yB) { 
	let xDiff = xA - xB; 
	let yDiff = yA - yB; 

	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

function checkPokeBallAvailability(x, y) {
    return pokeBallPos.some(ballPos => getDistance(ballPos.cenX, ballPos.cenY, x, y)<20);
}

function drawPokemon(ctx, x,y) {
    ctx.drawImage(pokemonImage, x, y, 20, 20);
}

function drawPokeBall(ctx, x,y) {
    ctx.drawImage(pokeBallImage, x, y, 20, 20);
}

function getScoreTextObj(score) {
    return { hun: score.toString()[score.toString().length-3]||'0', ten: score.toString()[score.toString().length-2]||'0', one: score.toString()[score.toString().length-1]||'0' };
}

function calculateScore() {
    if (score===999) {
        score = 0;
    } else {
        score+=1;
    };
    const { hun, ten, one } = getScoreTextObj(score);
    document.getElementById('score-hundreth').innerHTML = hun;
    document.getElementById('score-tenth').innerHTML = ten;
    document.getElementById('score-one').innerHTML = one;
}

function catchPokeBall(cenX, cenY) {
    let newPokeBallPos = [];
    pokeBallPos.forEach(ballPos => {
        if (getDistance(ballPos.cenX, ballPos.cenY, cenX, cenY) < 10) {
            calculateScore();
        } else {
            newPokeBallPos.push(ballPos);
        }
    });
    pokeBallPos = newPokeBallPos;
}

function checkPos(cordX, cordY) {
    let x = cordX;
    let y = cordY;
    if (cordX>canvas.width-10) x=0
    else if(-5>cordX) x=canvas.width-10;
    if (cordY>canvas.height-10) y=0;
    else if(-5>cordY) y=canvas.height-10;
    catchPokeBall(x+10, y+10);
    return { cordX: x, cordY: y, cenX: x+10, cenY: y+10 };
}

function update() {
    const canvas = document.getElementById('game');   
    const ctx = canvas.getContext('2d');
    
    if (canvas) {
        ctx.fillStyle = '#95c262';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let { cordX, cordY } = currentPos;
        if(rightPressed) {
            cordX += 5;
        }
        else if(leftPressed) {
            cordX -= 5;
        }
        if(downPressed) {
            cordY += 5;
        }
        else if(upPressed) {
            cordY -= 5;
        }
        currentPos = checkPos(cordX, cordY);
        pokeBallPos.forEach(ballPos => drawPokeBall(ctx, ballPos.cordX, ballPos.cordY));
        drawPokemon(ctx, currentPos.cordX, currentPos.cordY);
    }

}

function keyDownHandler(event) {
	if(event.keyCode == 39 || event.keyCode == 68) {
        rightPressed = true;
    }
    else if(event.keyCode == 37 || event.keyCode == 65) {
        leftPressed = true;
    }
    if(event.keyCode == 40 || event.keyCode == 83) {
    	downPressed = true;
    }
    else if(event.keyCode == 38 || event.keyCode == 87) {
    	upPressed = true;
    }
}

function keyUpHandler(event) {
	if(event.keyCode == 39 || event.keyCode == 68) {
        rightPressed = false;
    }
    else if(event.keyCode == 37 || event.keyCode == 65) {
        leftPressed = false;
    }
    if(event.keyCode == 40 || event.keyCode == 83) {
    	downPressed = false;
    }
    else if(event.keyCode == 38 || event.keyCode == 87) {
    	upPressed = false;
    }
}
