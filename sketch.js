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
  createCanvas(600,200);
  
  // creating trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  edges = createEdgeSprites();
  
  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50
  
  //creating ground
  ground = createSprite(300,190,600,20);
  ground.addImage(groundImage);
  
  //creating a ground to fool the computer
  falseground = createSprite(300,200,600,10);
  falseground.visible = false;
  
  //score is zero for people who dont study
  score = 0;
  
  //groups 
  CloudGroup = createGroup();
  ObstacleGroup = createGroup();
  
  trex.addAnimation("collided", trex_collided);
  
  restart = createSprite(300,120);
  restart.addImage(restarti);
  restart.scale = 0.4;
  
  gameover = createSprite(300,90);
  gameover.addImage(gameoveri);
  gameover.scale = 2.5;
  
  
  trex.setCollider("circle");

}


function draw(){
  //set background color 
  background("white");

  text("Score:"+score,10,15);
  if(gamestate === "play"){
  //jump when space key is pressed
 if(trex.y >= 170 && keyDown("space")){
    jumps.play();
    trex.velocityY = -10;
  
 }
  
  //velocity
  trex.velocityY = trex.velocityY + 0.7;
  ground.velocityX = -7;
  
  
  //infinite ground
  if(ground.x <0){
    ground.x = 300;
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
    if(mousePressedOver(restart)){
      ObstacleGroup.destroyEach();
      CloudGroup.destroyEach();
      trex.changeAnimation("running",trex_running);
      score = 0;
      gamestate = "play";
    }
  if(trex.y <105){
    trex.y = 170;
    trex.velocityY = 0;
  }
  drawSprites();

}

function cloudSpawn(){
  if(frameCount%100 === 0){
  var Cy = random(30,90);
  var Cs = random(0.1,0.2); 
  cloud = createSprite(600,Cy,10,10);
  cloud.addImage(clouds);
  cloud.scale = Cs;
  cloud.lifetime = 200;
  }
  else{
    return;
  }
  trex.depth = cloud.depth+1;
  cloud.velocityX = -3;
  CloudGroup.add(cloud);
}

function obstacleSpawn(){
  if(frameCount%75 === 0){
    obstacle = createSprite(600,180,10,10);
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
    obstacle.lifetime = 87;
    ObstacleGroup.add(obstacle);
    
  }
}
