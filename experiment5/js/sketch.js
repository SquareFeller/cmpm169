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

/*
Using texture image example code from the p5.grain library by user meezwhite -- https://github.com/meezwhite/p5.grain/blob/main/examples/texture-overlay-outside/sketch.js
*/

let textureImage;
let tW, tH;
let textureElement;


function preload(){
  soundFormats('mp3');
  
  /* Train_arrive.mp3 by Defaultv -- https://freesound.org/s/534361/ -- License: Creative Commons 0 */
  trainSound = loadSound('534361__defaultv__train_arrive.mp3'); 
  
  /* CrowdPanic.mp3 by belthazarus -- https://freesound.org/s/435716/ -- License: Creative Commons 0
  */
  crowdSound = loadSound('435716__belthazarus__crowdpanic.mp3');

  //train model by z-lengyel -- https://www.cgtrader.com/products/mav-40-steam-locomotive-tank-engine
  train = loadModel('mav_40.obj','.obj');

  //texture image by luis_molinero -- https://www.freepik.com/free-photo/rough-textured-wall_1198446.htm#fromView=image_search_similar&page=1&position=9&uuid=a87639a7-b31b-4b39-b572-de775eebb5c2&query=Film+Grain+Texture
  textureImage = loadImage('./js/texture.jpg');
}



function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());  
  p5grain.setup();
  tW = textureImage.width;
  tH = textureImage.height;
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

  textureElement = document.querySelector('#texture');

  //cam setup 
  cam = createCamera();
  cam.setPosition(683.2680712547467, 183.8614227989123, 7289.548672281939);
  cam.lookAt(200.37541618027217, -137.3225618638527, 359.57758027678346);

  //sound setup
  trainSound.loop();
  trainSound.amp(10);
  trainSound.setVolume(0);
  crowdSound.amp(45);
  crowdSound.setVolume(0);
  trainSound.play();
}

function draw() {
  console.log(displayWidth * pixelDensity() + "," + displayHeight * pixelDensity());
  background(65);
  
  orbitControl();
  let t = model(train);
  if(trainSound.getVolume() > 0.95 && !hasplayed){
    hasplayed = true;
    crowdSound.setVolume(1);
    crowdSound.play();
  }

  textureAnimate(textureElement);
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
      }else{
        trainSound.setVolume(mouseScroll+=0.05);
      }
    }
  }else{
    if(mouseScroll > 0.099){
         trainSound.setVolume(mouseScroll-=0.04);
    }else{
          mouseScroll = 0;
          trainSound.setVolume(mouseScroll);
         }
  }
}