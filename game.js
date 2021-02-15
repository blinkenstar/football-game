const cvs = document.getElementById('game');
const ctx = cvs.getContext('2d');

// PITCH
const drawRect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// BALL
const drawCircleF = (x, y, r, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0,2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

// CIRCLE
const drawCircleS = (x, y, r, w, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x, y, r, 0,2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
}

// TEXT
const drawText = (text, x, y, color) => {
    ctx.fillStyle = color;
    ctx.font = '50px sans-serif';
    ctx.fillText(text, x, y);    
}

// USER SLIDER BAR
const user = {
    x: 20,                      // 20px from the left side
    y: cvs.height / 2 - 50,
    w: 10,
    h: 100,
    color: '#fff',
    score: 0
}

// COM SLIDER BAR
const com = {
    x: cvs.width - 30,          // from right side -20-10, because w=10
    y: cvs.height / 2 - 50,
    w: 10,
    h: 100,
    color: '#fff',
    score: 0
}

// BALL
const ball = {
    x: cvs.width / 2,
    y: cvs.height / 2,
    r: 13,
    color: '#a51890',
    speed: 5,
    velocityX: 3,
    velocityY: 4,
    stop: true
}

// USER SLIDING BAR CONTROLS
const movePaddle = (event) => {
    let rect = cvs.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.h / 2;
    ball.stop = false;                              // if mouse is moved ball will start moving
}

cvs.addEventListener('mousemove', movePaddle);

// COLLISION (b = ball, p= player)
const collision = (b, p) => {
    b.top = b.y - b.r;
    b.bottom = b.y + b.r;
    b.left = b.x - b.r;
    b.right = b.x + b.r;

    p.top = p.y;
    p.bottom = p.y + p.h;
    p.left = p.x;
    p.right = p.x + p.w;

    // return true for collision (ball and player are within each's bondaries)
    return (b.top < p.bottom && b.bottom > p.top && b.left < p.right && b.right > p.left);
}

// RESET BALL
const resetBall = () => {
    ball.x = cvs.width / 2;
    ball.y = cvs.height / 2;

    ball.speed = 5;
    ball.velocityX = 3;
    ball.velocityY = 4;
    ball.stop = true;
}

// DINAMICALLY MANAGE GAME PARAMETERS
const update = () => {
    if (!ball.stop) {               // if user doesn't move the slider bar (mouse) the ball will not move
        // move the ball
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;   
    }

    // if hits the sides reverse the velocity (direction)
    if (ball.y + ball.r > cvs.height || ball.y - ball.r < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // make the com slider bar follow the ball
    let comLvl = 0.1;               // accuracy (from 0.1 to 1)
    com.y += (ball.y - (com.y + com.h / 2)) * comLvl; 

    // decide in which side of the pitch the ball is (user or com?)
    let player = (ball.x < cvs.width / 2) ? user : com; 

    // add exitement (if the ball hits the upper half of the bar bounce upwards and vice versa,
    // .. if ball hits middle of the bar bounce straight horizontally)
    if (collision(ball, player)) {
        let intersectY = ball.y - (player.y + player.h / 2);    // gives us a value between -50 and 50
        intersectY /= player.h / 2;
        
        let maxBounceRate = Math.PI / 3;                        // bounce angle (between 30 and 75 is good)
        let bounceAngle = intersectY * maxBounceRate;

        let direction = (ball.x < cvs.width / 2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(bounceAngle);    // cos() gives the velocity value of x axis
        ball.velocityY = ball.speed * Math.sin(bounceAngle);                // sin() gives the vertical velocity value (y axis)

        ball.speed += 1;            // acceleration rate
    }
    
    // if there is no collision (ball is outside of the pitch) there will be a score)
    if (ball.x > cvs.width) {
        user.score++;
        resetBall();
    } else if (ball.x < 0) {
        com.score++;
        resetBall();
    }
}

const render = () => {
    drawRect(0, 0, cvs.width, cvs.height, '#008374');
    drawRect(cvs.width / 2 - 2, 0, 4, cvs.height, '#fff');
    drawCircleF(cvs.width / 2, cvs.height / 2, 8, '#fff');
    drawCircleS(cvs.width / 2, cvs.height / 2, 50, 4, '#fff');
    // drawText(user.score, cvs.width / 4, 100, '#e4e932');
    // drawText(com.score, 3 * cvs.width / 4, 100, '#e4e932');

    drawRect(user.x, user.y, user.w, user.h, user.color);
    drawRect(com.x, com.y, com.w, com.h, com.color);
    drawCircleF(ball.x, ball.y, ball.r, ball.color);
}


const game = () => {
    update();
    render();

    // Rersult panel
    const scoreUser = document.querySelector('#score-user');
    const scoreComp = document.querySelector('#score-comp');
    scoreUser.textContent = user.score;
    scoreComp.textContent = com.score;
}


// display a frame every second (fps)
const fps = 50;                     // number of frames
setInterval(game, 1000 / fps);      // 1s = 1000ms








// drawRect(0, 0, 600, 400, '#000');
// drawCircleF(50, 50, 10, '#fff');
// drawCircleS(250, 250, 50, 10, '#fff');
// drawText('deneme', 400, 200, '#fff');