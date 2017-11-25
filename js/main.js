var food = [];
var poison = [];
var population;

var foodAmount = 40;
var poisonAmount = 20;
var foodNut = 0.3;
var poiosnNut = -0.5;

var newRecord = null;
var debug = false;
var show = true;

function setup(){
	createCanvas(600, 400);
	population = new Population(200);
	for(var i = 0; i < foodAmount; i++){
		food.push(new edible(foodNut));
	}
	for(var i = 0; i < poisonAmount; i++){
		poison.push((new edible(poiosnNut)));
	}
	frameRate(180);
}

function draw(){
	background(0,10,20);
	if(debug){
		noStroke();
		fill(0,255,0);
		for(var i = 0; i < food.length; i++){
			ellipse(food[i].pos.x,food[i].pos.y, 3, 3);	
		}
		fill(255,0,0);
		for(var i = 0; i < poison.length; i++){
			ellipse(poison[i].pos.x,poison[i].pos.y, 3, 3);	
		}
	}
	if(food.length < foodAmount){
		food.push(new edible(foodNut));
	}
	if(poison.length < poisonAmount){
		poison.push(new edible(poiosnNut));
	}
	frameRate(-1);
	population.run();
}

function keyTyped(){
	if(key === 'd'){
		debug = !debug;
	}
	if(key === 'r'){
		console.log("life",newRecord.life.toFixed(2));
		console.log("lifeSpan",newRecord.lifeSpan.toFixed(0));
		console.log("childrens",newRecord.childrens.toFixed(0));
		console.log("see food",newRecord.dna[3].toFixed(2));
		console.log("see poison",newRecord.dna[4].toFixed(2));
		console.log("see partner",newRecord.dna[5].toFixed(2));
		console.log("seek food",newRecord.dna[0].toFixed(2));
		console.log("seek poison",newRecord.dna[1].toFixed(2));
		console.log("seek partner",newRecord.dna[2].toFixed(2));
		console.log("nutritDeath",newRecord.dna[8].toFixed(2))
		console.log("maxSpeed",newRecord.dna[6].toFixed(2));
		console.log("maxForce",newRecord.dna[7].toFixed(2));
		console.log("size",newRecord.dna[9].toFixed(2));
		console.log("");
	}
	if(key == 's'){
		show = !show;
	}
}

function edible(nutrit){
	var dna = [];
	this.pos = createVector(random(width), random(height));
	this.type = "edible";
	this.nutrit = nutrit;
}

