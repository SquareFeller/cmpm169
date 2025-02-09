// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

let trainSound;
let crowdSound;
let mouseScroll = 0;
let hasplayed = false;
let train;
let cam; 
//let mouse_down = 0;

function preload(){
  soundFormats('mp3');
  
  /* Train_arrive.mp3 by Defaultv -- https://freesound.org/s/534361/ -- License: Creative Commons 0 */
  trainSound = loadSound('534361__defaultv__train_arrive.mp3'); 
  
  /* CrowdPanic.mp3 by belthazarus -- https://freesound.org/s/435716/ -- License: Creative Commons 0
  */
  crowdSound = loadSound('435716__belthazarus__crowdpanic.mp3');

  //train model by z-lengyel -- https://www.cgtrader.com/products/mav-40-steam-locomotive-tank-engine
  train = loadModel('mav_40.obj','.obj');
}



function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}



// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
  cam = createCamera();
 cam.setPosition(683.2680712547467, 183.8614227989123, 7289.548672281939);
 //cam.setPosition(-291.6911247929137, 160.60902220871282, 6420.088523244931);

  cam.lookAt(200.37541618027217, -137.3225618638527, 359.57758027678346);
  //cam.lookAt(-76.13160623632469, 94.93953006125913, 460.162139298443);
  //cam.roll(0.5);

  trainSound.loop();
  trainSound.amp(10);
  trainSound.setVolume(0);
  crowdSound.amp(25);
  crowdSound.setVolume(0);
  trainSound.play();
}

function draw() {
  background(220);
  //cam.roll(0.01);
  orbitControl();
  //let b = box(30, 10, 10);
  //normalMaterial();
  let t = model(train);
  //cam.roll(190);
  if(trainSound.getVolume() > 0.95 && !hasplayed){
    hasplayed = true;
    crowdSound.setVolume(1);
    crowdSound.play();
  }
  // cam x: -291.6911247929137 cam y: 160.60902220871282 cam z: 6420.088523244931
//sketch.js:88 look at x: -76.13160623632469 look at y: 94.93953006125913 look at z: 460.162139298443
/*
cam x: 683.2680712547467 cam y: 183.8614227989123 cam z: 7289.548672281939
sketch.js:93 look at x: 200.37541618027217 look at y: -137.3225618638527 look at z: 359.57758027678346
*/ 
//furthest z:  cam z: 7289.54867228193
// closest z: 439.2988991833581
 // console.log(" cam z: " + cam.eyeZ);
//  console.log(" look at z: " + cam.centerZ);
}

function mousePressed() {
  userStartAudio();
}

function mouseWheel(event){
  console.log("event delta: " + event.delta);
  if(event.delta < 0){ //scroll up 
    if(mouseScroll <= 0){
      mouseScroll = 0.01;
      trainSound.setVolume(mouseScroll);
    }else{
      if(trainSound.getVolume()>=1){
        trainSound.setVolume(1);
      //  crowdSound.play();
        //trainSound.amp(15);
      }else{
        trainSound.setVolume(mouseScroll+=0.05);
      }
    }
    console.log(mouseScroll);
    //audio file vol go up
  }else{
    if(mouseScroll > 0.099){
      // if(cam.eyeZ > 439.2988991833581){
         trainSound.setVolume(mouseScroll-=0.04);
    }else{
          mouseScroll = 0;
          trainSound.setVolume(mouseScroll);
         }
         console.log(mouseScroll);
         
         //audio file vol go down
    //if(trainSound.getVolume() < 0){
  }
}