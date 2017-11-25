function Population(popSize){
	this.creatures = [];
	this.popSize = popSize;
	this.lifeRecord = 0;
	this.newRecord;

	for(var i = 0; i < popSize; i++){
		this.creatures[i] = new Creature(random(0, width),random(0, height));
	}

	this.repopulate = function(i){
		if(this.creatures.length < this.popSize){
			this.breed(i);
			if(this.creatures.length < this.popSize*3/4){
				this.replicate();
			}
		}
	}

	this.breed = function(i){
		var clone = this.creatures[i].clone();
		if(clone){
			clone.mutate(mr);
			this.creatures.push(clone);
			this.creatures[i].childrens ++;
		}
	}

	this.replicate = function(){
		var refil = new Creature(random(0, width),random(0, height));
		refil.vel.x += random(-2,2);
		refil.vel.y += random(-2,2);
		this.creatures.push(refil);
	}

	this.calcRecord = function(i){
		if(this.creatures[i].lifeSpan > this.lifeRecord){
			lifeRecord = this.creatures[i].lifeSpan;
			newRecord = this.creatures[i];
		}
	}
	this.explode = function(i){
		if(this.creatures[i].lifeSpan > 1000){
			for(var j = 0; j < 100; j++){
				this.breed(i);
			}
			this.creatures[i].life = -1;
		}
	}

	this.run = function(){
		var lifeRecord = 0;
		for(var i = this.creatures.length-1; i >= 0; i--){
			this.creatures[i].update();
			this.repopulate(i);
			this.calcRecord(i);
			this.explode(i);
			if(this.creatures[i].isDead()){
				this.creatures.splice(i,1);	
			}
		}
	}
}