let currentPos = { cordX: 0, cordY: 0, cenX: 10, cenY: 10 };
let pokeBallPos = [];
let score = 0;
let canvas = {};

(function(window, document, undefined){
    window.onload = init;
    function init(){
        var imgPokemon = new Image(20, 20);
        var imgPokeBall = new Image(20, 20);
        imgPokemon.src = 'https://static.pokemonpets.com/images/monsters-images-800-800/93-Haunter.png';
        imgPokeBall.src = 'https://pngimg.com/uploads/pokeball/pokeball_PNG2.png';
        canvas = document.getElementById('game');
        document.getElementById('score-hundreth').innerHTML = '0';
        document.getElementById('score-tenth').innerHTML = '0';
        document.getElementById('score-one').innerHTML = '0';
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#95c262';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            imgPokemon.onload = function() {
                drawPokemon(ctx, 0, 0);
            };
            imgPokeBall.onload = function() {
                setInterval(() => {
                    if (pokeBallPos.length<5) {
                        const ctx = canvas.getContext('2d');
                        const cordX = Math.round(Math.random()*(canvas.width-20));
                        const cordY = Math.round(Math.random()*(canvas.height-20));
                        if (!checkPokeBallAvailability(cordX+10, cordY+10)) {
                            pokeBallPos.push({ cordX, cordY, cenX: cordX+10, cenY: cordY+10 });
                        };
                        pokeBallPos.forEach(ballPos => drawPokeBall(ctx, ballPos.cordX, ballPos.cordY));
                        drawPokemon(ctx, currentPos.cordX, currentPos.cordY);
                    }
                }, 3000);
            };
        };
    }

})(window, document, undefined);

function onRestart() {
    currentPos = { cordX: 0, cordY: 0, cenX: 10, cenY: 10 };
    pokeBallPos = [];
    score = 0;
    document.getElementById('score-hundreth').innerHTML = '0';
    document.getElementById('score-tenth').innerHTML = '0';
    document.getElementById('score-one').innerHTML = '0';
}

function getDistance(xA, yA, xB, yB) { 
	var xDiff = xA - xB; 
	var yDiff = yA - yB; 

	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

function checkPokeBallAvailability(x, y) {
    return pokeBallPos.some(ballPos => getDistance(ballPos.cenX, ballPos.cenY, x, y)<20);
}

function drawPokemon(ctx, x,y) {
    var img = new Image(20, 20);
    img.src = 'https://static.pokemonpets.com/images/monsters-images-800-800/93-Haunter.png';
    ctx.drawImage(img, x, y, 20, 20);
}

function drawPokeBall(ctx, x,y) {
    var img = new Image(20, 20);
    img.src = 'https://pngimg.com/uploads/pokeball/pokeball_PNG2.png';
    ctx.drawImage(img, x, y, 20, 20);
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
        if (getDistance(ballPos.cenX, ballPos.cenY, cenX, cenY) < 5) {
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

document.addEventListener('keydown', function(e) {
    const canvas = document.getElementById('game');   
    const ctx = canvas.getContext('2d');
    switch (e.keyCode) {
        case 37:
            currentPos = checkPos(currentPos.cordX-5, currentPos.cordY );
            break;
        case 38:
            currentPos = checkPos(currentPos.cordX, currentPos.cordY-5 );
            break;
        case 39:
            currentPos = checkPos(currentPos.cordX+5, currentPos.cordY );
            break;
        case 40:
            currentPos = checkPos(currentPos.cordX, currentPos.cordY+5 );
            break;
        default:
            break;
    };
    if (canvas) {
        ctx.fillStyle = '#95c262';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        pokeBallPos.forEach(ballPos => drawPokeBall(ctx, ballPos.cordX, ballPos.cordY));
        drawPokemon(ctx, currentPos.cordX, currentPos.cordY);
    }
});