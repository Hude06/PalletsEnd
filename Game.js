import { Rect } from "./RectUtils.js";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d")
let currentKey = new Map()
let navKey = new Map();
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
class Bucket {
    constructor(x,y) {
        this.bounds = new Rect(x-2,y-5,32,32)
        this.sprite = new Image();
        this.sprite.src = "./Assets/Bucket.png"
    }
    draw() {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.sprite,this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
}
class GameMap {
    constructor() {
        this.visable = false;
        this.clicked = false;
        this.bounds = new Rect(50,50,canvas.width-100,canvas.height-85)
    }
    draw() {
        if (this.visable) {
            ctx.fillStyle = "white"
            const cameraX = canvas.width / 2 - player.bounds.x;
            const cameraY = canvas.height / 2 - player.bounds.y;
            ctx.fillRect(this.bounds.x-cameraX,this.bounds.y-cameraY,this.bounds.w,this.bounds.h)
        }
    }
    update() {
        if (navKey.get("e")) {
            this.clicked = true
        }
        if (this.clicked) {
            this.visable =! this.visable
            this.clicked = false;
        }
        if (this.visable) {
            player.moveAble = false
        } else {
            player.moveAble = true
        }
    }
}
class Player {
    constructor() {
        this.Colored = 0;
        //X Y WIDTH and HEIGHT
        this.bounds = new Rect(1,1,32,32)
        this.ShadowBounds = new Rect(10,this.bounds.y,10,10);
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
        this.jumpingSpeed = 1;
        this.Bucket = null
        this.grounded = true;
        this.gravity = 1;
        this.velocity = 1;
        this.moveAble = true;
    }
    draw() {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.sprite,Math.round(player.bounds.x*divider)-3,Math.round(player.bounds.y*divider),this.bounds.w,this.bounds.h)
        ctx.drawImage(this.Shadow,Math.round(player.bounds.x*divider)-3,this.ShadowBounds.y*divider+this.bounds.h-10,this.bounds.w,this.bounds.h)
    }
    update() {
        if (this.ShadowBounds.y === this.bounds.y) {
            this.grounded = true;
        }
            if (currentKey.get("w") || currentKey.get("ArrowUp")) {
                if (grid.canMove(this,"forward")) {
                    this.bounds.y -= this.speed
                }
                this.sprite.src = "./Assets/PlayerBack.png"
                this.ShadowBounds.y = this.bounds.y
            }
            if (currentKey.get("s") || currentKey.get("ArrowDown")) {
                if (grid.canMove(this,"down")) {
                    this.bounds.y += this.speed
                }                    
                this.sprite.src = "./Assets/Player.png"
                this.ShadowBounds.y = this.bounds.y
            }
            if (currentKey.get("a") || currentKey.get("ArrowLeft")) {
                if (grid.canMove(this,"left")) {
                    this.bounds.x -= this.speed
                }  
                this.sprite.src = "./Assets/PlayerLEFT.png"
                this.ShadowBounds.x = this.bounds.x
            }
            if (currentKey.get("d") || currentKey.get("ArrowRight")) {
                if (grid.canMove(this,"right")) {
                    this.bounds.x += this.speed
                }                      
                this.sprite.src = "./Assets/Player.png"
                this.ShadowBounds.x  = this.bounds.x
            }
    }
}
class Grid {
    constructor(w,h) {
        this.width = w
        this.height = h
        this.array = []
        this.tileSize = 30
        for(let j = 0; j<this.height; j++) {
            let row = []
            for(let i = 0; i<this.width; i++) {
                row[i] = 0
            }
            this.array[j] = row
        }
    }
    getAt(x,y) {
        return this.array[y][x]
    }
    setAt(x,y,v) {
        this.array[y][x] = v
    }
    fill(color) {
        for (let j=0; j<this.height; j++) {
            for (let i=0; i<this.width; i++) {
                this.setAt(i,j,color)
            }
        }
    }
    draw() {
        for (let h = 0; h < this.height; h++) {
            for (let w = 0; w < this.width; w++) {
                if (grid.getAt(w,h).toLowerCase() === 'black') {
                    ctx.fillStyle = "black"
                    ctx.fillRect(w*(this.tileSize),h*(this.tileSize),this.tileSize,this.tileSize)
                }
                if (grid.getAt(w,h).toLowerCase() === 'red') {
                    ctx.fillStyle = "red"
                    ctx.fillRect(w*(this.tileSize),h*(this.tileSize),this.tileSize,this.tileSize)
                }
                if (grid.getAt(w,h).toLowerCase() === 'white') {
                    ctx.fillStyle = "white"
                    ctx.fillRect(w*(this.tileSize),h*(this.tileSize),this.tileSize,this.tileSize)
                }
                if (grid.getAt(w,h).toLowerCase() === 'bucket') {
                    ctx.fillStyle = "black"
                    ctx.fillRect(w*(this.tileSize),h*(this.tileSize),this.tileSize,this.tileSize)
                    buckets.push(new Bucket(w*this.tileSize,h*this.tileSize))
                }

            }
        } 
    }
    canMove(player,direction) {
        if (direction.toLowerCase() === "forward") {
            if (this.getAt((player.bounds.x),(player.bounds.y)-1) === "black") {
                return true;
            }
            if (this.getAt((player.bounds.x),(player.bounds.y)-1) === "bucket") {
            }
        }
        if (direction.toLowerCase() === "left") {
            if (this.getAt((player.bounds.x)-1,(player.bounds.y)) === "black") {
                return true;
            }
            if (this.getAt((player.bounds.x)-1,(player.bounds.y)) === "bucket") {
            }
        }
        if (direction.toLowerCase() === "down") {
            if (this.getAt((player.bounds.x),(player.bounds.y)+1) === "black") {
                return true;
            }
            if (this.getAt((player.bounds.x),(player.bounds.y)+1) === "bucket") {
            }
        }
        if (direction.toLowerCase() === "right") {
            if (this.getAt((player.bounds.x)+1,(player.bounds.y)) === "black") {
                return true;
            }
            if (this.getAt((player.bounds.x)+1,(player.bounds.y)) === "bucket") {
            }
        }
    }
}
let buckets = []
let grid = new Grid(50,30);
const divider = grid.tileSize
let player = new Player();
let mouse = new MousePositionManager();
let map = new GameMap();
function keyboardInit() {
    window.addEventListener("keydown", function (event) {
        currentKey.set(event.key, true);
        navKey.set(event.key, true);

    });
    window.addEventListener("keyup", function (event) {
        currentKey.set(event.key, false);
        navKey.set(event.key, false);

    });
}
function draw() {
    ctx.imageSmoothingEnabled = false;
    player.draw();
    for (let i = 0; i < buckets.length; i++) {
        buckets[i].draw();
    }
}
function Camera() {
    const cameraX = canvas.width / 2 - player.bounds.x;
    const cameraY = canvas.height / 2 - player.bounds.y;
    ctx.save();
    ctx.translate(cameraX, cameraY);
}
function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    grid.fill('black')
    grid.setAt(2,2,"red")
    grid.setAt(5,5,"bucket")

    grid.setAt(5,2,"white")
    grid.draw();
    player.update();
    map.update();
    // Camera();
    draw();

    ctx.restore(); 
    navKey.clear();
    currentKey.clear();
    requestAnimationFrame(loop)
}
function init() {
    canvas.addEventListener('mousemove', mouse.updateMousePosition);
    keyboardInit();
    loop();
}
init();