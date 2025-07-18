// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

//FOUND CODE FROM https://editor.p5js.org/codingtrain/sketches/zUKp9n4MW & https://editor.p5js.org/codingtrain/sketches/0_qPHtsF_

// Face Mesh Texture Mapping
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/facemesh
// https://youtu.be/R5UZsIwPbJA

let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };

let uvMapImage;

let triangulation;
let uvCoords;

let img1;
let img2;
let img3;
let img4;
let handPose;
let hands = [];

function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
  handPose = ml5.handPose({ flipped: true});
  img1 = loadImage("wukong.png");
  img2 = loadImage("Wes.jpg");
  img3 = loadImage("pirate_wes.jpg");
  //img4 goes here
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
  let canvas = createCanvas(640, 480, WEBGL);
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  $(window).resize(function() {
    resizeScreen();
   });
   resizeScreen();  
  // Create the webcam video and hide it
  video = createCapture(VIDEO, {flipped: false});
  video.size();
   video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  handPose.detectStart(video, gotHands);
  // Get the Coordinates for the uv mapping
  triangulation = faceMesh.getTriangles();
  uvCoords = faceMesh.getUVCoords();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  translate(-width / 2, -height / 2);
  image(video, 0, 0);
  
  image(video, 0, 0)
  if (hands.length > 0) {
    let hand = hands[0];
    let index = hand.index_finger_tip;
    let thumb = hand.thumb_tip;
    let middle = hand.middle_finger_tip;
    let ring = hand.ring_finger_tip;
    let pinky = hand.pinky_finger_tip;
    
    if (index.y < thumb.y && middle.y > index.y) {
     // text("#1", index.x, index.y);
         texture(img1);
    } else if(index.y < thumb.y && middle.y < thumb.y && ring.y > thumb.y){
      text("#2", middle.x, middle.y);
          texture(img2);
    } else if(index.y < thumb.y && middle.y < thumb.y && ring.y < thumb.y && pinky.y > thumb.y){
     // text('#3', ring.x, ring.y)
          texture(img3);
    } else if(index.y < thumb.y && middle.y < thumb.y && ring.y < thumb.y && pinky.y < thumb.y){
      //    texture(img4);
    }
    else{
       //text('#0', width/2, height/2);
    }
  }
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    // Draw all the triangles
    noStroke();
    textureMode(NORMAL);
    beginShape(TRIANGLES);
    for (let i = 0; i < triangulation.length; i++) {
      let indexA = triangulation[i][0];
      let indexB = triangulation[i][1];
      let indexC = triangulation[i][2];
      let a = face.keypoints[indexA];
      let b = face.keypoints[indexB];
      let c = face.keypoints[indexC];
      const uvA = { x: uvCoords[indexA][0], y: uvCoords[indexA][1] };
      const uvB = { x: uvCoords[indexB][0], y: uvCoords[indexB][1] };
      const uvC = { x: uvCoords[indexC][0], y: uvCoords[indexC][1] };
      vertex(a.x, a.y, uvA.x, uvA.y);
      vertex(b.x, b.y, uvB.x, uvB.y);
      vertex(c.x, c.y, uvC.x, uvC.y);
    }
    endShape();
  }
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

function gotHands(results) {
  hands = results;
}
