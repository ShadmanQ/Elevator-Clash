var elevators = [];
var people = [];
var obstacles = [];
var winText = ["Wahoo, next Level!","You got to class!","You made it on time!","Nice you defeated the elevators"]
var lostText = ["You lose! Sorry :(","Great job, \neveryone hates you now","Oh no, you're late!","Womp womp"];
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

var CrowdImg;
var SignImg;

var PlayerStatus = "blank";

function preload(){
	CrowdImg = loadImage("assets/crowd.png");
	SignImg = loadImage("assets/maintenance.png")
    ding = loadSound("assets/ding.mp3")
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
    floorY = height/3 *2; //floor height
    elevators.push(new Elevator(width/3-100,floorY));
    elevators.push(new Elevator(width/2-100, floorY));
    elevators.push(new Elevator(width - width/3-100, floorY));
    obstacles.push(new Obstacle(CrowdImg));
    obstacles.push(new Obstacle(SignImg));
 	theGuy = new Person;
    elevImg = loadImage("assets/v.png")
    problemElevator = int(random(elevators.length));  //variable to choose which elevator has an obstacle
    elevators[problemElevator].hasObstacle = true;
    winMessage = winText[int(random(winText.length))];
    loseMessage = lostText[int(random(lostText.length))];
    thisObstacle = int(random(0,2));// variable to choose which obstacle to have in the elevator
    fill(255,0,0);
    
}

function draw() {
	background(255);
  
    //game over condition for the user
    if (!gameOver){
   	textSize(20);
    fill(55)
    textAlign(LEFT);
    text("Choose the right elevator \nand avoid the obstacles \nto get to class!\nYou have to go " + theGuy.direction,20,50);

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
         if(elevators[problemElevator].isOpen){
         	obstacles[thisObstacle].display(elevators[problemElevator].x1,elevators[problemElevator].y1-200);
       	}
    }

    //display perosn  
    theGuy.display();
    //update person 
    theGuy.update();
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
        		elevators[randElevator].direction = random(["up","down"]);
        		//closing time of each elevator
        		oldTime = millis();
        		// the open time then gets reset to some between approx 5-10 seconds after closing time
        		elevators[randElevator].openTime = int(oldTime+5000,(oldTime+10000));
        		}
        	}

        //determine win or lose  
       	for (var i = 0; i < elevators.length; i++){
       		playerDist=dist(theGuy.x,theGuy.y,elevators[i].x1+150,elevators[i].y1);
       		if (playerDist<100&&elevators[i].isOpen && !elevators[i].hasObstacle &&elevators[i].direction==theGuy.direction ){
       			gameOver = true;
       			PlayerStatus = "win";
       			}
       		if (playerDist<100&&elevators[i].isOpen && elevators[i].hasObstacle ){
       			gameOver = true;
       			PlayerStatus = "loss";
       			}
    		}
    }
    //if timer runs out
	if (millis() > timerDuration){
    	gameOver = true;
    	PlayerStatus = "loss";
	}

	if (gameOver && PlayerStatus == "loss"){
		textSize(120);
		text(loseMessage, width/2,height/2);
	}
	if (gameOver && PlayerStatus == "win"){
		textSize(100);
		text(winMessage, width/2,height/2);
		elevators[problemElevator].hasObstacle = false;
		problemElevator = int(random(elevators.length));
		//NOTE: Trying to figure out how to reset the level and the timer	
	}

}

//elevator object
function Elevator(x,y){
    rectMode(CORNERS);
    this.x1 = x;
    this.y1= y;
    this.xDistance = this.x1+200;
    this.yDistance = this.y1 - 350;
    this.direction = random(["up","down"]);
    this.floorY = height/3 * 2;
    this.col = color(200);
    this.isOpen = false;
    this.hasObstacle = false;
    this.openTime = random(4000,8000); // selects randomly beforehand at what time to open the elevator
    this.duration = random(500,1500); // selects randomly beforehand how long the elevator should stay open
    this.display = function(){
    	//starting from the top, drawing the up and down lights for the elevator
		strokeWeight(3);
		//upper light

		if (this.direction == "up" && this.isOpen == true){
			fill(0,200,0);
            ding.play();
               
		}
		triangle(this.x1+100,this.y1-480,this.x1+120, this.y1-450, this.x1+80,this.y1-450);
		fill(this.col)
		//lower
		if (this.direction == "down" && this.isOpen == true){
			fill(255,0,0);
            ding.play()
			}
		triangle(this.x1+100,this.y1-405,this.x1+120,this.y1-435,this.x1+80,this.y1-435);
        fill(this.col)
        
        // draws the elevator in its closed state if the isOpen variable is false
        if (this.isOpen == false){
            stroke(55);
            strokeWeight(10)
            rect(this.x1, this.y1,this.xDistance, this.yDistance);
            strokeWeight(7);
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
}

//person object
function Person(){
    this.x = mouseX;
    this.y = height/3 * 2;
    this.headY = this.y;
    this.feetY = this.y+100;
    this.armsY = this.y +50;
    this.direction = random(["up","down"]);

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

        this.update = function(){
        	this.x = mouseX;
        }
    }

}

//obstacle class
function Obstacle(img){
	this.x;
	this.y;
	this.graphic = img;

	this.display = function(x1,y1){
		this.x = x1;
		this.y = y1;
		this.graphic = img;
		image(this.graphic,this.x,this.y,200,200);
	}

}
