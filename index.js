const canvas = document.querySelector(".main-canvas");
const ctx = canvas.getContext('2d');
const pixels = 20;
const snakePadding = 5;
class Game{
    init(){
        this.snake = new Snake(0, 0, canvas.width / pixels);
        this.apple = new Apple(this.snake);
        this.apples = [this.apple];
    };

    eatApple(){
        let firstBlock = this.snake.tail[this.snake.tail.length - 1];
        for (let i = 0; i < this.apples.length; i++){
            const apple = this.apples[i];
            if (firstBlock.x == apple.x && firstBlock.y == apple.y){
                this.snake.tail.push({x: apple.x, y: apple.y});
                this.apples[i] = new Apple(this.snake);
            };
        };
    };

    spawnApple(){
        if(this.apples.length >= 3){
            return;
        };
        const apple = new Apple(this.snake);
        this.apples.push(apple);
    };
    
    checkHitWall(){
        let firstBlock = this.snake.tail[this.snake.tail.length - 1];
        if (firstBlock.x == -this.snake.size){
            firstBlock.x = canvas.width;
        }else if (firstBlock.x == canvas.width){
            firstBlock.x = 0;
        };
        if (firstBlock.y == -this.snake.size){
            firstBlock.y = canvas.height;
        }else if (firstBlock.y == canvas.height){
            firstBlock.y = 0;
        };
    };
    
    checkGameOver(){
        let firstBlock = this.snake.tail[this.snake.tail.length - 1];
        for (let i = 0; i < this.snake.tail.length - 1; i++){
            let block = this.snake.tail[i];
            if (block.x == firstBlock.x && block.y == firstBlock.y){
                return true;
            };
        };
        return false;
    };

    gameLoop(){
        this.init();
        this.movementControll();
        setInterval(this.show.bind(this), 1000 / 15); // 15 is fps
        setInterval(this.spawnApple.bind(this), 10000);
    };
    
    show() {
        this.update();
        this.draw();
    };
    
    update() {
        this.snake.move();
        if(this.checkGameOver()){
            this.init();
        };
        this.checkHitWall();
        this.eatApple();
    };

    movementControll() {
        window.onkeydown = (evt) => {
            setTimeout(() => {
                if (evt.keyCode == 37 && this.snake.rotateX != 1){
                    this.snake.rotateX = -1;
                    this.snake.rotateY = 0;
                }else if(evt.keyCode == 38 && this.snake.rotateY != 1){
                    this.snake.rotateY = -1;
                    this.snake.rotateX = 0;
                }else if(evt.keyCode == 39 && this.snake.rotateX != -1){
                    this.snake.rotateX = 1;
                    this.snake.rotateY = 0;
                }else if(evt.keyCode == 40 && this.snake.rotateY != -1){
                    this.snake.rotateY = 1;
                    this.snake.rotateX = 0;
                }
            }, 10)
        };
    };
    
    draw(){
        this.createRect(0, 0, canvas.width, canvas.height, "black");
        for (const block of this.snake.tail){
            this.createRect(block.x + snakePadding / 2, block.y + snakePadding / 2, this.snake.size - snakePadding, this.snake.size - snakePadding, "white");
        };
        for(const apple of this.apples){
            this.createRect(apple.x, apple.y, apple.size, apple.size, apple.color);
        };
    };
    
    createRect(x, y, width, height, color){
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    };
};
class Snake {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.tail = [{x: this.x, y: this.y}];
        this.rotateX = 0;
        this.rotateY = 1;
    };
    move() {
        let newRect;
        const firstBlock = this.tail[this.tail.length - 1];
        newRect = {
            x: firstBlock.x + this.size * this.rotateX,
            y: firstBlock.y + this.size * this.rotateY
        };
        this.tail.shift();
        this.tail.push(newRect);
    };
};

class Apple {
    constructor(snake) {
        let isTouching = true;
        while (isTouching){
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size;
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size;
            for(let i = 0; i < snake.tail.length; i++){
                isTouching = this.x == snake.tail[i].x && this.y == snake.tail[i].y;
            };
            this.color = "pink";
            this.size = snake.size;
        };
    };
};


window.onload = () => {
    const game = new Game();
    game.gameLoop();
};

