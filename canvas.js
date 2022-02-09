const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//TODO: fix code and add more features to learn stuff

class GameEngine {
	constructor() {
		this.directionX = [];
		this.directionY = [];
		this.ballSpeed = 5;
		this.wallCollision = [];
		this.height = 50;
		this.width = 50;
		this.speedX = 8;
		this.speedY = 5;
		this.canvasWidth = 600;
		this.canvasHeight = 600;
		this.positionX = 300;
		this.positionY = 300;
		this.image = new Image(200, 200);
		this.image.src = "/dvd.png";
	}

	init(ctx) {
		ctx.fillStyle = "black";
		ctx.drawImage(
			this.image,
			this.positionX,
			this.positionY,
			this.width,
			this.height
		);
		//ctx.fillRect(this.positionX, this.positionY, this.height, this.width);
	}

	moveLeft() {}

	moveRight() {
		this.positionX += this.speedX;
	}
	moveDown() {
		this.positionY += this.speedY;
	}

	collisionDetectionWall() {
		if (this.positionX >= this.canvasWidth - this.width) {
			this.speedX = -this.speedX;
		}
		if (this.positionX <= 0) {
			this.speedX = 8;
		}
		if (this.positionY >= this.canvasHeight - this.height) {
			this.speedY = -this.speedY;
		}
		if (this.positionY <= 0) {
			this.speedY = 6;
		}
	}
}

let x = 0;
let y = 0;
let direction = "right";

let game = new GameEngine();
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	game.init(ctx);
	game.moveRight();
	game.collisionDetectionWall();
	game.moveDown();
	requestAnimationFrame(animate);
}

animate();
