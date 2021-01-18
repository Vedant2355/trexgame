var trex,trex_running,trex_collided;
var clouds,score;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var groundImage,ground,falseground,edges;
var CloudGroup, ObstacleGroup;
var restart,restarti, gameover, gameoveri;
var gamestate = "play";
var checkpoints, dies, jumps;
var os, gs;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png")
  clouds = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restarti = loadImage("restart.png");
  gameoveri = loadImage("gameOver.png");
  
  checkpoints = loadSound("checkPoint.mp3");
  dies = loadSound("die.mp3");
  jumps = loadSound("jump.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  // creating trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  edges = createEdgeSprites();
  
  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50
  
  //creating ground
  ground = createSprite(width/2,height-50,width,20);
  ground.addImage(groundImage);
  
  //creating a ground to fool the computer
  falseground = createSprite(width/2,height-40,width,10);
  falseground.visible = false;
  
  //score is zero for people who dont study
  score = 0;
  
  //groups 
  CloudGroup = createGroup();
  ObstacleGroup = createGroup();
  
  trex.addAnimation("collided", trex_collided);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restarti);
  restart.scale = 0.4;
  
  gameover = createSprite(width/2,height/2 - 20);
  gameover.addImage(gameoveri);
  gameover.scale = 2.5;
  
  
  trex.setCollider("circle");

}


function draw(){
  //set background color 
  background("white");

  text("Score:"+score,width/50,height/50);
  if(gamestate === "play"){
  //jump when space key is pressed
 if(trex.y >= height-90 && keyDown("space") || touches.length > 0 ){
    jumps.play();
    trex.velocityY = -10;
  touches = [];
 }
  
  //velocity
  trex.velocityY = trex.velocityY + 0.7;
  ground.velocityX = -7;
  
  
  //infinite ground
  if(ground.x< width/2.5){
    ground.x = width/2;
  }
  
  cloudSpawn();
  obstacleSpawn();
  //stop trex from falling down
  
  
  //increasing score for people who subscribe to my channel!
  score = score+Math.round(getFrameRate()/60);
  
  //hiding the useless button
  restart.visible = false;
  gameover.visible = false;
    
  if(ObstacleGroup.isTouching(trex)){
    
    dies.play();
    gamestate = "end";
  }
    if(score%100 === 0 && score > 0){
      checkpoints.play();
      ground.velocityX = ground.velocityX-2;
      obstacle.velocityX = obstacle.velocityX-2;
    }
  }
  else if(gamestate === "end"){
    
    ground.velocityX = 0;
    CloudGroup.setVelocityXEach(0);
    ObstacleGroup.setVelocityXEach(0);
    CloudGroup.setLifetimeEach(frameCount+1);
    ObstacleGroup.setLifetimeEach(frameCount+1);
    trex.changeAnimation("collided", trex_collided);
    
    restart.visible = true;
    gameover.visible = true;
    
    
    
  }
  trex.collide(falseground);
    if(mousePressedOver(restart) || touches.length > 0){
      ObstacleGroup.destroyEach();
      CloudGroup.destroyEach();
      trex.changeAnimation("running",trex_running);
      score = 0;
      touches = [];
      gamestate = "play";
    }
  if(trex.y <height-160){
    trex.y = height-70;
    trex.velocityY = 0;
  }
  drawSprites();

}

function cloudSpawn(){
  if(frameCount%100 === 0){
  var Cy = random(height/2 + 150 ,height/2 - 120);
  var Cs = random(0.1,0.2); 
  cloud = createSprite(width,Cy,10,10);
  cloud.addImage(clouds);
  cloud.scale = Cs;
  cloud.lifetime = width/cloud.velocityX;
  }
  else{
    return;
  }
  trex.depth = cloud.depth+1;
  cloud.velocityX = -3;
  CloudGroup.add(cloud);
}

function obstacleSpawn(){
  if(frameCount%150 === 0){
    obstacle = createSprite(width,height-60,10,10);
    obstacle.scale = 0.1;
    var On = Math.round(random(1,6));
    
    switch(On){
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        obstacle.scale = 0.05;
        break;
      case 5:
        obstacle.addImage(obstacle5);
        obstacle.scale = 0.05;
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }
    obstacle.velocityX = -7
    obstacle.lifetime = width/obstacle.velocityX;
    ObstacleGroup.add(obstacle);
    
  }
}
