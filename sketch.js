var elevators = [];
var people = [];
//global floor variable
var floorY; 
var open;
var elevImg;
var lastOpen = 0;
var openInterval = 500;
var lastClose = 0;
var closeInterval = 400;
var timerDuration = 30 * 1000;
var gameOver = false;
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
    floorY = height/3 *2; //floor variable
    elevators.push(new Elevator(width/3-100,floorY));
    elevators.push(new Elevator(width/2-100, floorY));
    elevators.push(new Elevator(width - width/3-100, floorY));
    people.push(new Person());
    elevImg = loadImage("assets/v.png")

}

function draw() {
	background(255);
    
    //game over condition for the user
    if (!gameOver){

	// sets up timer in top right corner
	var timer = timerDuration - millis();
	timer = int(timer/1000);
	textAlign(CENTER,CENTER);
	textSize(50);
	text(timer, width-50, height/10);
	timer -=1;

    //floor for person to step on and elevators to sit on 
    fill(200,200)
    floorY = height/3 *2;
    strokeWeight(10)
    stroke(55)
    rect(0, floorY , width, height)


    //update elevators
    for(var i = 0; i < elevators.length; i++) {
        elevators[i].display();
        var midX = elevators[2].x1+(elevators[i].xDistance/2);
        var midY = elevators[2].y1-(elevators[i].yDistance/2);
        var PlayerDist = dist(midX,midY,people[0].x,people[0].y);
       console.log(PlayerDist);
    }

        randElevator = int(random(0,3)); // selects random elevator
        //first checks if elevator is closed
        if (elevators[randElevator].isOpen == false){
        	//checks if current time is greater than the randomly generated
        	//if that's the case, open the elevaotr
        	if (millis() > elevators[randElevator].openTime){
        	elevators[randElevator].isOpen = true;
        	//console.log(elevators[randElevator].openTime);
        	}
        }
        // checks if elevator is open
        if (elevators[randElevator].isOpen == true){
        	// if the current time goes over the randomly selected open duration for each elevator
        	// the elevator closes back up
        	if (millis() >(elevators[randElevator].openTime + elevators[randElevator].duration) ){
        		elevators[randElevator].isOpen = false;
        		//closing time of each elevator
        		oldTime = millis();
        		//console.log(oldTime);
        		// the open time then gets reset to some between approx 5-10 seconds after closing time
        		elevators[randElevator].openTime = int(oldTime+5000,(oldTime+10000));
        		}
        	}

    }

    //update person 
    for(var i=0;i<people.length; i++){
        people[i].display();
    }

if (millis() > timerDuration){
	gameOver = true;
	textSize(150);
	text("You lose! Sorry :(", width/2,height/2);
}
}


//elevator object
function Elevator(x,y){
    rectMode(CORNERS);
    this.x1 = x;
    this.y1= y;
    this.xDistance = this.x1+200;
    this.yDistance = this.y1 - 350;
    this.floorY = height/3 * 2;
    this.col = color(200);
    this.isOpen = false;
    this.openTime = random(4000,6000); // selects randomly beforehand at what time to open the elevator
    this.duration = random(1000,2000); // selects randomly beforehand how long the elevator should stay open
    this.display = function(){
    	//starting from the top, drawing the up and down lights for the elevator
		strokeWeight(5);
		triangle(this.x1+100,this.y1-480,this.x1+140, this.y1-450, this.x1+60,this.y1-450);
        //drawing out the elevator
        fill(this.col)
        

        // draws the elevator in its closed state if the isOpen variable is false
        if (this.isOpen == false){
        stroke(55);
        strokeWeight(10)
        rect(this.x1, this.y1,this.xDistance, this.yDistance);
        
        // this.isOpen = false;
        strokeWeight(7)
        line(this.x1+100, this.y1-350, this.x1+100, this.y1);
    }
    	//draws the elevator in its open state if the isOpen variable is true
    	if (this.isOpen == true){
    	stroke(0);
        strokeWeight(1)
        fill(200)
        stroke(55);
        strokeWeight(10)
        rect(this.x1, this.y1,this.xDistance, this.yDistance)  
        image(elevImg,this.x1,this.y1-350);
    	}
     
    }   


// NOTE
    this.open = function(){
        // image of open elevator 
        this.isOpen = true;
        stroke(0);
        strokeWeight(1)
        fill(200)
        stroke(55);
        strokeWeight(10)
        rect(this.x1, this.y1,this.xDistance, this.yDistance)  
        image(elevImg,this.x1,this.y1-350);
    }
}

function mousePressed(){
    //update elevators

    for(var i = 0; i < elevators.length; i++) {
        //detect mouse click on elevator
        if (mouseX < elevators[i].xDistance && mouseX>elevators[i].x1 && mouseY>elevators[i].yDistance){
            console.log('here')
            //need to keep track of which elevator is open 
            elevators[i].isOpen = true;

        }
        
    }
}

//person object
function Person(){
    this.x = mouseX;
    this.y = height/3 * 2;
    this.headY = this.y;
    this.feetY = this.y+100;
    this.armsY = this.y +50;

    //drawing out person 
    this.display = function(){
        //body
        strokeWeight(4)
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


   //maintenance cart obstacle
   function Maintenance(){
   this.x = x1;
   this.y = y1;


   this.display = function(){

   }


   }
}

