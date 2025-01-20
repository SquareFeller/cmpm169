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
let c;
let pupil;
let eye_background;
let pupil_background; 
let iris;
let iris_width;
let iris_height;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
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
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
   });
   resizeScreen();  

  c = color(0, 71, 240); // color of lighthouse's light
  iris_width = 360;
  iris_height = 300;
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(0);

  //scale code came from ChatGPT's answer to "can you help me rotate an ellipse in p5js but make it so that it scales well whenever the canvas size is changed?"
  let scaleX = canvasContainer.width() / 1431;
  let scaleY = canvasContainer.height() / 600;

  //making the eye
  push();
  translate(centerHorz, centerVert);
  scale(scaleX, scaleY);
  rotate(-PI/8);
  strokeWeight(18);
  fill(255);
  stroke(210, 153, 108);
  eye_background = ellipse(0, 0, 620, 450); // eye background
  fill(0); 
  pupil_background = ellipse(0, 0, 360, 300);
  // eye is over
  pop();

  noStroke();
  fill(c); 
  dying_light = triangle(canvasContainer.width()/1.65, 600/1.9, canvasContainer.width()/1.65, 600/2.6, canvasContainer.width()/2.3, 600/2.3); // lighthouse's light
  
  strokeWeight(0);
  fill(180);
  rect(canvasContainer.width()/2.4, 600/2, canvasContainer.width()/24, 600/4.5); //lighthouse base
  rect(canvasContainer.width()/2.3625, 600/2.4, canvasContainer.width()/36, 600/12); //lighthouse head
  fill(110, 0, 0);
  triangle(canvasContainer.width()/2.3625, 600/2.4, canvasContainer.width()/2.22, 600/2.4, canvasContainer.width()/2.28, 600/2.8); //lighthouse top

  drawWaves(rows);
  colorMode(RGB);
  
  push();
  translate(centerHorz, centerVert);
  scale(scaleX, scaleY);
  rotate(-PI/8);
  noFill();
  strokeWeight(80);
  stroke(180, 200, 190);
  iris = ellipse(0, 0, iris_width, iris_height); //iris
  pop();

}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    dying_light.erase();
    noErase();
    if(blue(c) == 0){
        c = color(0, 71, 240);
        noStroke();
        fill(c);
        dying_light = triangle(canvasContainer.width()/1.65, 600/1.9, canvasContainer.width()/1.65, 600/2.6, canvasContainer.width()/2.3, 600/2.3);
    }else{
      c.setBlue(blue(c) - 40);
      c.setGreen(green(c) - 25);
      noStroke();
      fill(c);
      dying_light = triangle(canvasContainer.width()/1.65, 600/1.9, canvasContainer.width()/1.65, 600/2.6, canvasContainer.width()/2.3, 600/2.3);
    }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


// using "wave motion" by pippinbarr  (https://editor.p5js.org/pippinbarr/sketches/bgKTIXoir) for the waves in the eye


// How many rows of waves to display
let rows = 1;

// What is the range of motion for a single wave (vertically)
// A base time value for our noise() function which we'll
// use to move the waves overall
let baseT = 0;
/**
Draws the specified number of waves on the canvas!
*/
function drawWaves(number) {
  // Loop through all our rows and draw each wave
  // We loop "backwards" to draw them one on top of the other
  // nicely
  for (let i = number; i >= 0; i--) {
    drawWave(i, number);
  }
  // Increment the base time parameter so that the waves move
  baseT += 0.01;
}

/**
Draws the nth wave.

Paramters are
* n - the number of the wave
* rows - the total number of waves
*/
function drawWave(n, rows) {
  // Calculate the base y for this wave based on an offset from the
  // bottom of the canvas and subtracting the number of waves
  // to move up. We're dividing the wave height in order to make the
  // waves overlap
  let baseY = 425;
  // Get the starting time parameter for this wave based on the
  // base time and an offset based on the wave number
  let t = baseT + n*100;
  // We'll start each wave at 250 on the x axis
  let startX = canvasContainer.width()/2.49;
  
  // must clamp the wave within the pupil
  let endX = canvasContainer.width()/1.65;

  // Let's start drawing
  push();
  // We'll use the HSB model to vary their color more easily
  colorMode(HSB);
  // Calculate the hue (0 - 360) based on the wave number, mapping
  // it to an HSB hue value
  let hue = map(n, 0, rows, 249, 250);
  fill(hue, 255, 50);
  noStroke();
  // We're using vertex-based drawing
  beginShape();
  // Starting vertex!
  vertex(startX, baseY);
  // Loop along the x axis drawing vertices for each point
  // along the noise() function in increments of 10
  for (let x = startX; x <= endX; x += 10) {
    // Calculate the wave's y based on the noise() function
    // and the baseY
    let y = baseY - map(noise(t), 0, 1, 10, canvasContainer.height()/4);//waveMaxHeight);
    // Draw our vertex
    vertex(x, y);
    // Increment our time parameter so the wave varies on y
    t += 0.01;
  }
  // Draw the final three vertices to close the shape around
  // the edges of the canvas 
  
  //change the final three vertices to match the pupil shape (kinda, hopefully)
  vertex(endX, baseY/1.05);
  // Done!
  endShape();
}