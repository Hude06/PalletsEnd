import { Rect } from "./RectUtils.js";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d")
let currentKey = new Map();
class MousePositionManager {
    constructor() {
      this.mouseX = 0;
      this.mouseY = 0;
      document.addEventListener('mousemove', this.updateMousePosition.bind(this));
    }
  
    updateMousePosition(event) {
        // Update the mouse position variables
        let rect = event.target.getBoundingClientRect()
        let x = event.clientX
        let y = event.clientY
        x = x - rect.x
        y = y - rect.y
        x = x*(canvas.width/rect.width)
        y = y*(canvas.height/rect.height)
        this.mouseX = x -5
        this.mouseY = y -5
    }
  }

// Add an event listener to the document to listen for mousemove events
class Bucket {
    constructor() {
        this.bounds = new Rect(600,200,32,32)
        this.sprite = new Image();
        this.sprite.src = "./Assets/Bucket.png"
    }
    draw() {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.sprite,this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
}
class Player {
    constructor() {
        this.Colored = 0;
        //X Y WIDTH and HEIGHT
        this.bounds = new Rect(canvas.width/2-16,canvas.height/2-16,32,32)
        this.EverythingElseX = 0;
        this.EverythingElseY = 0;
        this.Shadow = new Image();
        this.Shadow.src = "./Assets/PlayerShadow.png"
        //PLAYER SPEED
        this.speed = 1;
        //PLATER HEALTH
        this.health = 10
        //Player Color For a Rectangle
        this.playerColor = "red"
        this.sprite = new Image();
        //Source for your sprites Image
        this.sprite.src = "./Assets/Player.png"
        //Player Direction
        this.direction = "left"
        this.moving = false;
        this.shadowHeight = -12
        this.jumping = false;
        this.jumpingUP = false;
        this.jumpingDown = false;
        this.jumpingSpeed = 1;
        this.Bucket = null
    }
    draw() {
        if (this.Bucket !== null) {
            ctx.fillRect(this.bounds.x+20,this.bounds.y,mouse.mouseX-895,2)
        }
        ctx.imageSmoothingEnabled = false;
        if (this.Colored === 1) {
            this.sprite.src = "./Assets/PlayerHands.png"
        }
        ctx.drawImage(this.sprite,this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        ctx.drawImage(this.Shadow,this.bounds.x,this.bounds.y+this.bounds.h + this.shadowHeight,this.bounds.w,this.bounds.h)
    }
    update() {
        if (this.Bucket !== null) {
            if (this.Colored <= 0) {
                this.Colored += 1;
            }
            this.Bucket.bounds.w = 20;
            this.Bucket.bounds.h = 20;
            if (this.direction === "left") {
                this.Bucket.bounds.x = this.bounds.x+15
                this.Bucket.bounds.y = this.bounds.y+20

            } else {
                this.Bucket.bounds.x = this.bounds.x-5
                this.Bucket.bounds.y = this.bounds.y+20
                console.log(this.Bucket.bounds.x,this.Bucket.bounds.y)
            }
        }
        if (currentKey.get(" ")) {
            this.jumping = true
            this.jumpingUP = true
        }
        if (this.jumping) {
            if (this.jumpingUP) {
                this.shadowHeight += this.jumpingSpeed;
                console.log("UP")
            }
            if (this.shadowHeight >= 2) {
                this.jumpingDown = true
            } 
            if (this.jumpingDown) {
                this.jumpingUP = false
                this.shadowHeight -= this.jumpingSpeed/2
                console.log("Down")
            }
            console.log(this.shadowHeight)
            if (this.shadowHeight <= -12) {
                console.log("DOne")
                this.jumping = false                
            }
        }
        if (currentKey.get("w") || currentKey.get("ArrowUp")) {
            this.bounds.y -= this.speed
            this.direction = "forward"
            this.sprite.src = "./Assets/PlayerBack.png"
        }
        if (currentKey.get("s") || currentKey.get("ArrowDown")) {
            this.bounds.y += this.speed
            this.direction = "back"
            this.sprite.src = "./Assets/Player.png"
        }
        if (currentKey.get("a") || currentKey.get("ArrowLeft")) {
            this.bounds.x -= this.speed
            this.direction = "left"
            this.sprite.src = "./Assets/PlayerLEFT.png"
        }
        if (currentKey.get("d") || currentKey.get("ArrowRight")) {
            this.bounds.x += this.speed
            this.direction = "right"
            this.sprite.src = "./Assets/Player.png"
        }
    }
    collsion() {
        if (this.bounds.intersects(bucket.bounds) || bucket.bounds.intersects(this.bounds)) {
            this.Bucket = bucket
        }
    }
}
let bucket = new Bucket();
let player = new Player();
let mouse = new MousePositionManager();
let EveryObject = [bucket]
function keyboardInit() {
    window.addEventListener("keydown", function (event) {
        currentKey.set(event.key, true);
    });
    window.addEventListener("keyup", function (event) {
        currentKey.set(event.key, false);
    });
}
function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    player.draw();
    player.update();
    player.collsion();
    bucket.draw();
    requestAnimationFrame(loop)
}
function init() {
    canvas.addEventListener('mousemove', mouse.updateMousePosition);
    keyboardInit();
    loop();
}
init();