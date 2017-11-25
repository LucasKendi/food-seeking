var mr = .1;
var skfd = 0;
var skps = 1;
var skpt = 2;
var sefd = 3;
var seps = 4;
var sept = 5;
var maxs = 6;
var maxf = 7;
var nutd = 8;
var sze = 9;

function Creature(x, y, dna){
	this.pos = createVector(x, y);
	this.vel = createVector();
	this.acc = createVector();
	this.history = [];
	this.life = 1;
	this.dna = [];
	this.lifeSpan = 0;
	this.canMate = false;
	this.type = "creature";
	this.childrens = 0;

	if(!dna){
	//seek food = 0
	this.dna[skfd] = random(-1,1);

	//seek poison = 1
	this.dna[skps] = random(-1,1);

	//seek partner = 2
	this.dna[skpt] = random(-1,1);

	//see food = 3
	this.dna[sefd] = random(10,100);

	//see poison = 4
	this.dna[seps] = random(10,100);

	//see partner = 5
	this.dna[sept] = random(10,100);

	//maxSpeed = 6
	this.dna[maxs] = random(1,5);

	//maxForce = 7
	this.dna[maxf] = random(0.1,1);

	//nutritDeath = 8
	this.dna[nutd] = random(-2,2);

	//size = 9
	this.dna[sze] = random(3, 15);

	} else{
		for(var i = 0; i < dna.length; i++){
			this.dna[i] = dna[i];
		}
	}

	this.goBack = function(){
		if(this.pos.x < 0){
			this.applyForce(createVector(1,0));			
		}
		if(this.pos.x > width){
			this.applyForce(createVector(-1,0));			
		}
		if(this.pos.y < 0){
			this.applyForce(createVector(0,1));			
		}
		if(this.pos.y > height){
			this.applyForce(createVector(0,-1));
		}
	}

	this.mutate = function(mr){
		this.dna = this.dna.map(x => x+=random(-mr, mr) * x);
	}


	this.applyForce = function(force){
		this.acc.add(force);
	}
	this.applyPhysics = function(){
		this.pos.add(this.vel);
		this.vel.add(this.acc);
		this.vel.limit(this.dna[maxs]);
		this.acc.mult(0);
	}
	this.update = function(){
		this.life -= 0.01;
		this.behavior();
		this.applyPhysics();
		this.goBack();
		this.show();
		//this.trail();
		this.lifeSpan++;
	}

	this.show = function(){
		push();
		if(debug){				
			translate(this.pos.x, this.pos.y);
			rotate(this.vel.heading());
			rectMode(CENTER);			
			var rd = color(255,0,0);
			var gr = color(0,255,0);
			var lifeColor = lerpColor(rd, gr, this.life);
			fill(lifeColor,50);
			ellipse(0, 0, 15/this.dna[maxs], 15/this.dna[maxs]);
			strokeWeight(.5);
			stroke(0, 255, 0);
			noFill();
			strokeWeight(.5);
			ellipse(0, 0, this.dna[sefd],this.dna[sefd]);
			strokeWeight(1);
			stroke(255, 0, 0);
			ellipse(0, 0, this.dna[seps], this.dna[seps]);
			strokeWeight(1.5);
			stroke(0, 0, 255);
			ellipse(0, 0, this.dna[sept], this.dna[sept])
		}
		pop();		
	}

	this.behavior = function(){
		this.chase(food, 0, 3);
		this.chase(poison, 1, 4);
		this.chase(population.creatures, 2, 5);
	}

	this.chase = function(target, seekIndex, seeIndex){
		var steer = this.eat(target, this.dna[seeIndex]);
		steer.mult(this.dna[seekIndex]);
		this.applyForce(steer);
	}

	this.seek = function(target, perception){
		var desired = p5.Vector.sub(target.pos, this.pos);
		if(perception > desired.mag()){
			desired.setMag(this.dna[maxs]);
		}
		else{
			desired = this.vel;
		}
		var steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.dna[maxf]);
		return steer;
	}

	this.eat = function(list, perception){
		var record = Infinity;
		var closest = null;
		this.canMate = false;
		for(var i =  list.length-1; i >= 0; i--){
			var d = this.pos.dist(list[i].pos);
			if(d - 15/this.dna[maxs] < this.dna[maxs]){
				if(list[i].type == "edible"){
					if(this.life < 1){
						this.life += list[i].nutrit;
						console.log("eat")
					}
					list.splice(i, 1);
				}
				else{
					this.canMate = true;
				}
			}else{
				if(d < record && list[i] != this){
					record = d;
					closest = list[i];
				}
			}
		}
		if(closest){
			return this.seek(closest, perception);
		} else{
			return createVector(0, 0);
		}
	}

	this.clone = function(){
		if(random(1) < 0.03 && this.canMate == true){
			var clone = new Creature(this.pos.x, this.pos.y, this.dna);
			clone.vel.x += random(-this.dna[maxs], this.dna[maxs]);
			clone.vel.y += random(-this.dna[maxs], this.dna[maxs]);
			clone.mutate(mr);
			return clone;
		}
	}

	this.trail = function(){
		this.history.push(createVector(this.pos.x,this.pos.y));
		stroke(255,50);
		strokeWeight(1);
		noFill();
		beginShape();
		for(i = 0; i < this.history.length; i++){
			vertex(this.history[i].x,this.history[i].y);
		}
		endShape();

		if(this.history.length > 2){
			this.history.splice(0,1);

		}
	}

	this.isDead = function(){
		if(this.life <= 0){
			var remains = new edible (this.dna[8]);
			remains.pos = this.pos;
			if(remains.nutrit > 0){
				food.push(remains);
			}
			else{
				poison.push(remains);
			}
			return true;
		}
		return false;
	}
}