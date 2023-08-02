export class ParticleSource {
    constructor() {
        this.parts = [];
        this.particles_enabled = true;
    }
    start_particles(x, y) {
        if (!this.particles_enabled) return;
        this.parts = [];
        for (let i = 0; i < 30; i++) {
            this.parts.push({
                pos: {
                    x: x,
                    y: y,
                },
                vel: {
                    x: (Math.random() - 0.5) * 5,
                    y: (Math.random() - 0.5) * 5,
                },
                alive: true,
                age: 0,
            });
        }
    }
    draw_particles(ctx,color) {
        for (let i = 0; i < this.parts.length; i++) {
            let part = this.parts[i];
            if (part.alive) {
                let a = Math.floor(100 - part.age * 2);
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = "red"
                ctx.fillStyle = `rgba(238,134,149,${a}%)`;
                ctx.fillRect(part.pos.x, part.pos.y, 10,10);
                ctx.restore();
            }
        }
    }
    update_particles() {
        this.parts.forEach((part) => {
            part.pos.x += part.vel.x;
            part.pos.y += part.vel.y;
            part.age += 1;
            if (part.age > 40) {
                part.alive = false;
            }
        });
    }
}
export class Point {
	constructor(x,y) {
		this.x = x
		this.y = y
	}
}
export class Rect {
	constructor(x,y,w,h) {
		this.w = w
		this.h = h
		this.x = x
		this.y = y
	}
	intersects(rect2) {
		let TL = new Point(this.x,this.y);
		let TR = new Point(this.x + this.w, this.y);
		let BL = new Point(this.x,this.y + this.h);
		let BR = new Point(this.x + this.w, this.y + this.h);
		if (rect2.contains(TL)) {
			return true
		} else if(rect2.contains(TR)) {
			return true
		} else if(rect2.contains(BL)) {
			return true
		} else if (rect2.contains(BR)) {
			return true
		} else {
			return false
		}
        
	}
	contains(pt) {
        if (pt.x < this.x)
        return false;
        if (pt.y < this.y)
        return false;
        if (pt.x > this.x + this.w)
        return false;
        if (pt.y > this.y + this.h)
        return false;
    return true;
	}
}

export function log(s) {
    console.log(s)

}
export function fillRect(x,y,w,h,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}