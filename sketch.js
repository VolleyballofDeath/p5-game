let CANVAS_WIDTH = 1170;
var Pvar
var Mvar
var Cvar
var time_alive=0;
var timerText
var not_dead = true;
function setup() {
  randomSeed(99);
  setInterval(timer,10);
  setup2();
}
function setup2(){
  createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
  Pvar = new player(200,200);
  Mvar = [new missle(CANVAS_WIDTH,CANVAS_WIDTH,Pvar,3)];
  Cvar = [new missleCluster(12,Pvar)];
  time_alive = 0;
  setTimeout(setup3,6000);
}
function setup3(){
  not_dead = true;
  fire(5000);
}
function timer(){
  //time_alive=(Math.round((1000*(time_alive0+0.001))))/1000
  time_alive +=0.01

  if(localStorage.getItem("time")==null){
    localStorage.setItem("time",time_alive);
  }else if(localStorage.getItem("time")<time_alive){
    localStorage.setItem("time",time_alive);
  }
}
function draw() {
  background(220);
  Pvar.update();
  fill(color(0,0,255))
  rect(Pvar.x,Pvar.y,5,5)
  fill(color(255,0,0))
  for(let i = 0; i< Mvar.length;i++){
  Mvar[i].update();
  }
  if(Cvar.length > 0){
    for(let j = 0; j< Cvar.length;j++){
      if(Cvar[j].cluster.length >0){
        for(let i = 0; i< Cvar[0].cluster.length;i++){
          Cvar[j].cluster[i].update();
        }
      }
    }
  }
  fill(color(0,0,0));
  timerText = text(time_alive.toFixed(2), 50, 50);
  HighSocreText = text(Number(localStorage.getItem("time")).toFixed(2),50,70)
  fill(color(255,0,0));
}
class player{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  update(){
  if(keyIsDown(87)){
    this.y-=4
    //w
  }
  if(keyIsDown(65)){
    this.x-=4
    //a
  }
  if(keyIsDown(83)){
    this.y+=4
    //s
  }
  if(keyIsDown(68)){
    this.x+=4
    //d
  }
  if(keyIsDown(87)&&(keyIsDown(65))){
    this.y+=(1-sin(PI/4))*4
    this.x+=(1-cos(PI/4))*4
  }
  if(keyIsDown(87)&&(keyIsDown(68))){
    this.y+=(1-sin(3*PI/4))*4
    this.x-=(1-cos(PI/4))*4
  }
  if(keyIsDown(83)&&(keyIsDown(65))){
    this.y-=(1-sin(PI/4))*4
    this.x+=(1-cos(PI/4))*4
  }
  if(keyIsDown(83)&&(keyIsDown(68))){
    this.y-=(1-sin(3*PI/4))*4
    this.x-=(1-cos(PI/4))*4
  }
  this.x = constrain(this.x,0,CANVAS_WIDTH-5);
  this.y = constrain(this.y,0,CANVAS_WIDTH-5);
}
}
class missle{
  constructor(x,y,target,speed){ 
    this.x=x+random(-30,30);
    this.y=y+random(-30,30);
    this.target = target;
    this.speed = speed;
  }
  update(){
    let angle = atan2((this.target.y-this.y),(this.target.x-this.x))
    this.x+=this.speed*cos(angle);
    this.y+=this.speed*sin(angle);
    rect(this.x,this.y,5,5);
    if((dist(this.x, this.y, Pvar.x, Pvar.y)<=5)){
      decease();
    }
  }
}
class missleCluster{
constructor(num,target){
  this.cluster = [];
  let angle = atan2((target.y-0),(target.x-0));
  this.x = CANVAS_WIDTH*1.5*cos(angle);
  this.y = CANVAS_WIDTH*1.5*sin(angle);
  for(let i = 0; i<num;i++){
    this.cluster.push(new missle(0,0,this,5))
  }
}
}
class enemy{
  constructor(x,y,foe){
    this.x = x;
    this.y = y;
    this.foe = foe;
    this.mode = 0;
  }
  update(){
    let angle = atan2((this.foe.y-this.y),(this.foe.x-this.x))
  }
}
function fire(time){
  let newtime = time*0.95;
  if(newtime<=150){
    newtime = 150;
  }
  Cvar.push(new missleCluster(12,Pvar));
  if(random()>0.6){
    Mvar.push(new missle(CANVAS_WIDTH,CANVAS_WIDTH,Pvar,3));
  }
  if(not_dead){
  setTimeout(() => fire(newtime), newtime)
  }
  if(Cvar.length > 100){
  Cvar.shift();
}
  if(Mvar.length>60){
      Mvar.shift();
  }
}
function decease(){
  Mvar = [];
  Cvar = [Cvar.shift()];
  not_dead = false;
  setup2();
}//TODO handle difficulty reset
