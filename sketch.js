var elevators = [];
var people = [];
//global floor variable
var floorY; 
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
    floorY = height/3 *2;
    elevators.push(new Elevator(width/2-width/3,floorY));
    elevators.push(new Elevator(width/2-100, floorY));
    elevators.push(new Elevator(width - width/3, floorY));
    people.push(new Person());

}


function draw() {
	background(255);
    
    //floor for person to step on 
    fill(200,200)
    floorY = height/3 *2;
    noStroke();
    rect(0, floorY , width, height)

    //update elevators
    for(var i = 0; i < elevators.length; i++) {
        elevators[i].display();
    }

    for(var i=0;i<people.length; i++){
        people[i].display();
    }
}


//elevator object
function Elevator(x,y){
    rectMode(CORNERS)
    this.x = x;
    this.y= y;
    this.floorY = height/3 * 2;
  
    this.update= function(){

    }
    this.display = function(){
        //drawing out the elevator
        fill('#78615c')
        stroke('#2e2523');
        strokeWeight(8)
        rect(this.x+200, this.y-350, this.x, this.y)
        stroke(255)
        strokeWeight(2)
        line(this.x+100, this.y-340, this.x+100, this.y-10)
        
    }
}

//person object
function Person(){
    this.x = mouseX;
    this.y = height/3 * 2;
    this.headY = this.y;
    this.feetY = this.y+100;
    this.armsY = this.y +50;

    this.display = function(){
        //body
        stroke(55,0,0)
        line(mouseX ,this.feetY ,mouseX,this.headY)
        
        //feet
        line(mouseX, this.feetY, mouseX-20, this.feetY+20)
        line(mouseX, this.feetY, mouseX+20, this.feetY+20)

        //arms
        line(mouseX, this.armsY, mouseX+20, this.armsY -15)
        line(mouseX, this.armsY, mouseX-20, this.armsY -15)
        //head
        noStroke();
        fill(255,0,0)
        ellipse(mouseX, this.headY, 50)

    }
}