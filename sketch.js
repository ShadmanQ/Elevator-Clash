var elevators = [];
var people = [];
var obstacles = [];
var winText = ["Wahoo, you won!","You got to class!","You made it on time!","Nice! You defeated the elevators","You made it, \nbut just barely!","4.0 Here I come!", "Good job! Did you remember \nto study for the test?"];
var lostText = ["You lose! Sorry :(","Great job, \neveryone hates you now","Oh no, you're late!","Womp womp","You're late, \nwhat else is new?", "Guess you'll walk...", "Just blame the MTA"];
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

var winTime = 0;
var losetime = 0;
var timerOffset = 0;

var CrowdImg;
var SignImg;
var ding;
var PlayerStatus = "blank";

var applause;
var womp;

var onTimecount = 0;
var theFont;
var theFont2;


function preload(){
	CrowdImg = loadImage("assets/crowd.png");
	SignImg = loadImage("assets/maintenance.png")
    ding = loadSound("assets/ding.mp3")
    applause = loadSound("assets/applause.mp3");
    womp = loadSound("assets/womp.mp3");
    theFont = loadFont("assets/AvenirNextLTPro-BoldCn.otf");
    theFont2 = loadFont("assets/AvenirNextLTPro-HeavyCn.otf");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(230 );
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
    var timer = timerDuration
    fill(255,0,0);
    textFont(theFont);
    
}

function draw() {
	background(255);
  
    //game over condition for the user
    if (!gameOver){
   	textSize(25);
    fill(55)
    textAlign(LEFT);
    text("Choose the right elevator \nand avoid the obstacles \nto get to class!",20,50);
    text("You've been to " + onTimecount + " classes on time.",20,110);
    //change color of game directions depending on elevator direction
    if (theGuy.direction == 'down'){
        fill(255,0,0)
    }
    if (theGuy.direction == 'up'){
        fill(0,200,0)
    }
    text('You have to go ' + theGuy.direction, 20,130)

	// sets up timer in top right corner
	timer = timerDuration - (millis()-timerOffset);
    fill(55)
	timer = int(timer/1000);
	textAlign(CENTER,CENTER);
	textSize(50);
	text(timer, width-50, 50);

    //floor for person to step on and elevators to sit on 
    fill('#67B2B2')
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
   			frameRate(1);
            gameOver = true;
   			PlayerStatus = "win";
   			winTime = millis();
    	}
   		if (playerDist<100&&elevators[i].isOpen && elevators[i].hasObstacle){
   			frameRate(1)
            gameOver = true;
   			PlayerStatus = "loss";
   			losetime = millis();
            
   			}
		}
    }
    //if timer runs out
	if (timer < 0){
    	fill(255,0,0)
        gameOver = true;
    	PlayerStatus = "loss";
    	losetime = millis()
	}

	if (gameOver && PlayerStatus == "loss"){

		 if (!womp.isPlaying()){
                womp.play();
            }
        if (millis() > losetime + 4000){
        	location.reload();
    	}	
        fill(255,0,0)
		textSize(120);
		textFont(theFont2);
		text(loseMessage, width/2,height/2);
		
	}
	if (gameOver && PlayerStatus == "win"){
		
        fill(0,255,0)
		textSize(120);
		textFont(theFont2);
		text(winMessage, width/2,height/2);
		if (!applause.isPlaying()){
			applause.play();
		}
		var displayTime = winTime + 4000;
		if (millis() > displayTime){
			Reset();
		}
		//NOTE: Trying to figure out how to reset the level and the timer	
	}

}

function Reset(){
	onTimecount +=1;
	elevators[problemElevator].hasObstacle = false;
	problemElevator = int(random(elevators.length));
	elevators[problemElevator].hasObstacle = true;
	for (var i = 0; i < elevators.length; i++)
		{
			elevators[i].isOpen = false;
			if (onTimecount > 3){
				elevators[i].openTime = int(random(2000,4000));
				elevators[i].duration = int(random(750,900));
			}
		}

	if (onTimecount == 3){
		for  (var i = 0; i < elevators.length; i++){
			elevators[i].x1 -= 150;
			elevators[i].xDistance -= 150;
		}
	elevators.push (new Elevator((elevators[2].x1+280), floorY));
	}

	PlayerStatus = "blank";
	theGuy.direction = random(["up","down"]);
	gameOver = false;
	timerDuration -= 5000;
	timerOffset = millis();
	timer = timerDuration;
	winMessage = winText[int(random(winText.length))];
	frameRate(30);

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
    this.duration = random(500, 1000); // selects randomly beforehand how long the elevator should stay open
    this.display = function(){
    	//starting from the top, drawing the up and down lights for the elevator
		strokeWeight(3);
		//upper light
        fill(this.col)
		if (this.direction == "up" && this.isOpen == true){
			fill(0,200,0);
            console.log(ding.isPlaying())
            console.log('duration is ' +this.openTime)
            if (!ding.isPlaying()){
                ding.play();
            }
               
		}
		triangle(this.x1+100,this.y1-480,this.x1+120, this.y1-450, this.x1+80,this.y1-450);
		fill(this.col)
		//lower
		if (this.direction == "down" && this.isOpen == true){
			fill(255,0,0);
            if (!ding.isPlaying()){
                ding.play();
			}
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
            fill(220)
            stroke(55);
            strokeWeight(10)
            rect(this.x1, this.y1,this.xDistance, this.yDistance)  
            image(elevImg,this.x1,this.y1-350);
            fill(200)
    	}
     
    }   
}

//person object
function Person(){
    this.x = mouseX;
    this.y = height/3 * 2-50;
    this.headY = this.y;
    this.feetY = this.y+100;
    this.armsY = this.y +50;
    this.direction = random(["up","down"]);

    //drawing out person 
    this.display = function(){
        //body
        strokeWeight(4)
        stroke(0)
        line(mouseX ,this.feetY ,mouseX,this.headY)
        //feet
        line(mouseX, this.feetY, mouseX-20, this.feetY+20)
        line(mouseX, this.feetY, mouseX+20, this.feetY+20)
        //arms
        line(mouseX, this.armsY, mouseX+20, this.armsY -15)
        line(mouseX, this.armsY, mouseX-20, this.armsY -15)
        //head
        noStroke();
        fill('#080F33')
        ellipse(mouseX, this.headY, 50)
        fill(255,0,0)

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