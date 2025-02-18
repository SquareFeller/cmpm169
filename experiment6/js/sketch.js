// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
//global variables

let words = [];
let parts = ["bb", "dd", "ed", "ff", "ph", "gh", "lf", "ft", "gg", "gh", 
  "gu", "gue", "wh", "ge", "g", "dge", "di", "gg", "c", "ch", "cc", "lk", "qu", "ck", "x",
  "ll", "mm", "mb", "mn", "lm", "nn", "kn", "gn", "pn", "n", "ngue",
  "pp", "rr", "wr", "rh", "ss", "c", "sc", "ps", "st", "ce", "se", "tt", "th", "ed", "f", "ph",
  "ve", "wh", "u", "o", "i", "j", "zz", "s", "x", "ze", "si", "z", "tch", "tu", "ti", "te", "ce",
  "sci", "ai", "ea", "ie", "eo", "ei", "ae", "ay", "ui", "y", "a", "ho", "oo", "ou", "eigh", "aigh", 
  "et", "ey", "ye", "igh", "ough", "eau", "ow", "ew", "ue", "oeu", "iew", "uoy", "ar", "our", "eur", "are",
  "ayer", "eir", "eer"
]

let max_bubbles = 15;
let bubbles = [];
let bubble_diameter = 50;

//https://editor.p5js.org/hao/sketches/8OhA3cn1J
let speech; 



function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}



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
    for(let i = 0; i < max_bubbles; i++){
    let b = new wordBubble(random(width - 20), random(height - 20), random(parts), bubble_diameter);
    bubbles.push(b);
  }
  speech = new p5.Speech();
  speech.onEnd = resumeloop;
  speech.listVoices();
    let all_words = "";
    console.log(words);
    speech.setVoice('Google UK English Male', speech.speak("yahoo!"));
    speech.setRate(0.8);
    speech.stop();
}

function draw() {
  background(220);
  for(let i = 0; i < bubbles.length; i++){
    bubbles[i].move();
    bubbles[i].draw();
    
    /**
     * When bubbles collide:
     *  create new string
     *  pause movement
     *  text-to-speech string
     *  delete bubbles
     *  resume movement 
     **/

    for(let j = 0; j < bubbles.length; j++){
      if (bubbles[i].colliding(bubbles[j]) && i != j){
        bubbles[j].draw();
       let top;
       let bot;
        if(bubbles[i].pos.y < bubbles[j].pos.y && bubbles[j].pos.y - bubbles[i].pos.y > bubble_diameter/3){
           top = bubbles[i].txt;
           bot = bubbles[j].txt;
           console.log("i is top, j is bot " + top + " " + bot);
        } else if (bubbles[i].pos.y > bubbles[j].pos.y && bubbles[i].pos.y - bubbles[j].pos.y > bubble_diameter/3){
           top = bubbles[j].txt;
           bot = bubbles[i].txt;
           console.log('j is top, i is bot ' + top + " " + bot);
        } else if(bubbles[i].pos.x < bubbles[j].pos.x){
           top = bubbles[i].txt;
           bot = bubbles[j].txt;
           console.log('i is left, j is right' + top  + " " + bot)
        } else{
          console.log('else');
            top = bubbles[j].txt;
            bot = bubbles[i].txt;
        }
        console.log("bubble's x:" + bubbles[i].pos.x + "bubble j's x: " + bubbles[j].pos.x + "bubble i's y: " + bubbles[i].pos.y + "bubble j's y: " + bubbles[j].pos.y);
        let new_string = top + bot;
        speech.speak(new_string);
        bubbles[i].change_color();
        bubbles[i].draw();
        noLoop();
        bubbles[i].pos.x = random(width);
        bubbles[i].pos.y = random(height);
        bubbles[j].pos.x = random(width);
        bubbles[j].pos.y = random(height);
        if(!words.includes(new_string)){
          words.push(new_string);
        }
      }
    }
  }
  textSize(20)
  // text('bogos', width/2 + 50, height/2)
  // text('binted', width/2, height/2)

}

function resumeloop(){
  loop();
}

function mousePressed(){
  let b = new wordBubble(mouseX, mouseY, random(parts), bubble_diameter);
  bubbles.push(b);
}

class wordBubble{
  constructor(x, y, txt, diameter){
    this.txt = txt;
    this.x = x;
    this.y = y;
    this.pos = createVector(x, y);
    this.diameter = diameter;
    this.speed = random(3, 5);
    this.vel = p5.Vector.random2D();
    this.vel.setMag(this.speed);
    this.col = 255;
  }

  draw = function(){
    fill(this.col);
    circle(this.pos.x, this.pos.y, this.diameter);
    fill(0);
    textSize(15);
    textAlign(CENTER, CENTER);
    text(this.txt, this.pos.x, this.pos.y);
  }

  move = function(){
    
    // updating position
    this.pos.add(this.vel);

    // bouncing on border
    if (this.pos.x > width - this.diameter/2 && this.vel.x > 0 || this.pos.x < this.diameter/2 && this.vel.x < 0){
      this.vel.x *= -1;
    } 
    if (this.pos.y > height - this.diameter/2 && this.vel.y > 0 || this.pos.y < this.diameter/2 && this.vel.y < 0){
      this.vel.y *= -1;
    }
  }

  //function guided by https://www.youtube.com/watch?v=uAfw-ko3kB8
  colliding(obj2) {
    let d = dist(this.pos.x, this.pos.y, obj2.pos.x, obj2.pos.y);
    if(d <= this.diameter/2 + obj2.diameter/2){
        return true;
      }
    }

  change_color(){
    this.col = (0, 0, 255);
  }

}