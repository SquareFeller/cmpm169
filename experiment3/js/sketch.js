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
var mouse;
let pos = [];
let mic;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

//using Andrew Aaron's "Cute Bubbles" from open processing https://openprocessing.org/sketch/868184 as a starting point


// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
  //createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);

  //also using the p5.js sketch "microphone" by amcc https://editor.p5js.org/amcc/sketches/Jtg4GaAG0 as a resource for microphone input

  mic = new p5.AudioIn();
  mic.stop();
  mouse = createVector(1, 1);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(0, 0, 75);
  /*mouse trail code adapted from "Simple Trailing Animation (push and shift) copy" by melodyloveless https://editor.p5js.org/melodyloveless/sketches/l5GR7rWbF 
  as well as asking chatGPT the question "can you make a p5js sketch that creates a mouse trail of ellipses, but then sends each ellipse to the top of the screen?" for the code to send bubbles up to the screen. 
  */

  pos.push(createVector(mouseX, mouseY));
  for (let i = 0; i < pos.length; i++) {
    let bubble = pos[i]; 
    let bubble_size = random(50, 55);
    let x_disp = random(100);

    strokeWeight(map(bubble_size, 50, 55, 1, 6));
    stroke(color(random(50, 100), random(150, 250), 255));
    fill(color(random(100), random(250), 255, 50));
    if (keyIsDown(16) === true) { //hold left shift down to turn on mic
      mic.start();
      bubble.y -= 1;
      if (mic.getLevel() * 1000 > 200) {
        bubble.y -= random(15, 30);
      }
    } else {
      mic.stop();
      bubble.y -= random(1, 3);
    }
    ellipse(bubble.x, bubble.y, bubble_size, bubble_size); //bubble

    let buffer_x = (0.2 * bubble_size) + ((cos(x_disp * 20) * 5) / 2);
    let buffer_y = (0.2 * bubble_size) + ((sin(x_disp * 17) * 5) / 2);

    stroke(255);
    arc(bubble.x + buffer_x, bubble.y - buffer_y, bubble_size / 5, bubble_size / 5, TWO_PI - (PI / 2), TWO_PI);
    if (bubble.y < 0) {
      pos.splice(i, 1);
      i--;
    }
  }
}