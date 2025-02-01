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
const model_url =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";
let pitch;
let audioContext;
let mic;
const scale = ["e", "A", "D", "G", "B", "E"];
let current_Note = "";
let reverb;
let instructions;

let rectangles = [];
let rainbowColors = [
  "rgba(255, 0, 0, 0.5)",
  "rgba(255, 127, 0, 0.5)",
  "rgba(255, 255, 0, 0.5)",
  "rgba(0, 255, 0, 0.5)",
  "rgba(0, 0, 255, 0.5)",
  "rgba(204, 153, 255, 0.5)",
];
let sounds = [];
let max_played = 20;
let times_played = 0;

/*
Using the project "Little Guitar" https://openprocessing.org/sketch/2306856 as the foundation for this sketch. It was created by Syed Umer Ahmed with the help of ChatGPT 4.o in the context of the week long workshop "Creative Coding with the help of AI tools" 
at the Design Department Dessau at Anhalt University of Applied Sciences
in May 2024, taught by Karsten Schuhl

I am also using code from the "pitch detection" sketch by Jenny-yw https://editor.p5js.org/Jenny-yw/sketches/J1GteCrzt & "PitchDetection_Piano"
 by ml5 https://editor.p5js.org/ml5/sketches/kpWGN573Ij
*/

function preload() {
  for (let i = 0; i < 6; i++) {
    sounds[i] = loadSound(`sound${i + 1}.wav`);
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
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
  instructions = createP('STRUM TO KEEP SINGING');
  instructions.size(400, 400);
  instructions.position(centerHorz, canvasContainer.height()/4);
  instructions.style('color', 'white');
  instructions.hide();
  
  reverb = new p5.Reverb();
  let rectWidth = 15;
  let numRectangles = 6;
  let gap =
    (width - 2 * 100 - numRectangles * rectWidth - 20 * (numRectangles - 1)) /
    (numRectangles - 1);

  for (let i = 0; i < numRectangles; i++) {
    let xPosition = 100 + i * (rectWidth + gap + 20);
    rectangles.push(
      new Rectangle(
        xPosition,
        0,
        rectWidth,
        canvasContainer.height() - 20,
        rainbowColors[i],
        sounds[i],
        scale[i]
      )
    );
    reverb.process(sounds[i], 1, 0.3);
  }
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(listening); 
}

function listening() {
  console.log("listening");
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function gotPitch(error, frequency) {
  if (error) {
    console.error(error);
  } else {
    const midiNum = freqToMidi(frequency);
    current_Note = scale[midiNum % 12];
  }
  pitch.getPitch(gotPitch);
}

function modelLoaded() {
  console.log("model loaded!");
  pitch.getPitch(gotPitch);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(50);
  for (let rect of rectangles) {
    rect.checkHover();
    rect.update();
  }

  fill(50);
  rect(0, canvasContainer.height() - 65, width, height);
  fill(255);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text(
    "Created by Syed Umer Ahmed with the help of ChatGPT 4.o, at Anhalt University of Applied Sciences, May | June 2024",
    100,
    canvasContainer.height() - 70,
    width - 160,
    80
  ); // for textbox add the following after widnowHeight-80: ,180, 80
}

class Rectangle {
  constructor(x, y, w, h, originalColor, sound, note) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.originalColor = originalColor;
    this.currentColor = originalColor;
    this.sound = sound;
    this.isHovered = false;
    this.wasHovered = false;
    this.isKeyTriggered = false;
    this.targetSize = w;
    this.currentSize = w;
    this.hoverStartTime = 0;
    this.particles = new ParticleSystem(x + w / 2, h / 2, this.originalColor);
    this.note = note;
  }

  update() {
    if (this.isHovered && current_Note === undefined) {
      this.hoverStartTime = millis();
      this.currentColor = color(255);
      if (this.isHovered && !this.wasHovered) {
        times_played = 0;
        instructions.hide();
        reverb.amp(2);
        this.sound.play();
        this.particles.emit(mouseX, mouseY);
        //background(this.originalColor); //<- interesting idea, but it hurts my eyes
      }
    } else if (!this.isHovered && current_Note != undefined) {
      if (this.note === current_Note){
        if(times_played < max_played) {
          reverb.amp(0.5);
          this.sound.play();
         // background(this.originalColor);
          times_played++;
          this.particles.emit(this.x, random(this.y, windowHeight));
        }else{
          instructions.show();
        }
      }
    } else {
      let elapsedTime = millis() - this.hoverStartTime;
      let fadeAmount = constrain(elapsedTime / 300.0, 0, 1);
      this.currentColor = lerpColor(
        color(255),
        color(this.originalColor),
        fadeAmount
      );
    }
    if (this.isHovered || this.correct_note) {
      this.currentSize = lerp(this.currentSize, this.w + 15, 0.5);
    } else {
      this.currentSize = lerp(this.currentSize, this.w, 0.3);
    }

    fill(this.currentColor);
    noStroke();
    rect(
      this.x - (this.currentSize - this.w) / 2,
      this.y,
      this.currentSize,
      this.h
    );
    this.particles.update();
    this.particles.display();
    this.wasHovered = this.isHovered;
    this.wasSung = true;
    this.isKeyTriggered = false;
  }

  checkHover() {
    if (
      mouseX >= this.x &&
      mouseX < this.x + this.w &&
      mouseY >= this.y &&
      mouseY < this.y + this.h
    ) {
      this.isHovered = true;
    } else {
      this.isHovered = false;
    }
  }

  trigger() {
    this.isKeyTriggered = true;
  }
}

class Particle {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.vx = random(-1.5, 1.5);
    this.vy = random(-1.5, 1.5);
    this.lifespan = 125;
    this.col = col;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.lifespan -= 2;
  }

  display() {
    noStroke();
    fill(255, this.lifespan);
    ellipse(this.x, this.y, 25, 25);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

class ParticleSystem {
  constructor(originX, originY, col) {
    this.particles = [];
    this.originX = originX;
    this.originY = originY;
    this.col = col;
  }

  emit(x, y) {
    for (let i = 0; i < 5; i++) {
      this.particles.push(new Particle(x, y, this.col));
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  display() {
    for (let particle of this.particles) {
      particle.display();
    }
  }
}