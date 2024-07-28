let pg, textures;
let alphabet;
let rotating = 1;
let m = 0;
let font;
let numwords = 0;
let dim = 60;
let spacing = 130;
let randomvalues = []
let bgtexture;
let features
let wpal // working palette
let colors
let img, canvas, bgimg;
let fb; // framebuffers
let col, row;
let maxsize;
let bgphoto
let seed;
let FIRSTTIME = true;
let lastmousex, lastmousey;
let timer = 0;



function keyPressed() {
  if (key == 's' || key=='S') {
    r = int(random(99999));
    fname = "cube_" + seed+'_'+r;
    saveCanvas(fname, 'png')
  }
  if (key == ' ') {
    rotating = 1 - rotating

  }

  if (key == 'e') {
    gl = this._renderer.GL;
    gl.enable(gl.DEPTH_TEST);
    console.log('depth enabled')
  }

  if (key == 'd') {
    gl = this._renderer.GL;
    gl.disable(gl.DEPTH_TEST);
    console.log('depth disabled')
  }


  

  
}

function initcolors() {
  //a = 0.1 // alpha
  colors = {
    bgcolors: [], bxwhitebg: [], bxblackbg: [],
    combocolors: [], comboblackbg: []
  }
  colors.combocolors = [ // 1 bgcolor + combox txt / boxes
    [color(300, 82, 22), [[color(0, 100, 100), color(40, 0, 100)],
    [color(165, 80, 100), color(40, 0, 100)],
    [color(240, 80, 100), color(240, 80, 100)]]],
    [color(240, 82, 22), [[color(55, 60, 100), color(220, 40, 100)],
    [color(160, 100, 100), color(35, 70, 100)]]],
    [color(60, 67, 12), [[color(40, 100, 100), color(345, 60, 100)],
    [color(210, 70, 70), color(265, 60, 70)]]],
    [color(60, 67, 10), [[color(60, 100, 90), color(180, 70, 100)]]],
    [color(240, 82, 20), [[color(55, 90, 90), color(225, 80, 100)]]]
  ]

  colors.bxwhitebg = [color(30, 90, 100), color(335, 60, 100),
  color(60, 100, 100), color(255, 60, 100),
  color(220, 100, 80), color(175, 100, 80),
  color(20, 80, 100), color(0, 70, 100),
  color(105, 100, 40)]

  colors.bxblackbg = [color(335, 60, 100), color(310, 80, 100), color(220, 90, 70),
  color(180, 100, 100), color(5, 100, 100), color(135, 100, 100), color(45, 100, 100),
  color(80, 40, 100)]

  colors.comboblackbg = [
    [color(0, 90, 70), color(40, 0, 80)],
    [color(0, 100, 100), color(240, 0, 100)],
    [color(45, 50, 80), color(240, 40, 90)],
    [color(20, 50, 80), color(270, 40, 90)],
    [color(150, 30, 80), color(340, 40, 90)],
    [color(180, 100, 100), color(40, 0, 100)],
    [color(180, 100, 100), color(330, 70, 100)]
  ]

}

function createfeatures() {
  initcolors();
  features = {
    dim: 60, spacing: 130, bgfill: 25, bgcol: color(0, 0, 0), bxcolor: color(0, 0, 100), txcol: color(0, 0, 0),
    bkgd: 0, blurry: false, bgcolor: color(0, 0, 0, 1),
    variedtextcol: 'none', fullness: 1,
    palette: 'b&w', textcolor: color(0, 0, 100, 1),
    rotX: 0, rotY: 0, rotZ: 0, sent1: 0, sent2: 1, bgfontsize: 200, bgoffset: 0,
    metal: 0, lightson: 0, spots: 0, glaze: 0, light1:60, light2:220, light3:280
  }
 
  r1 = int(random(alphabet.length))
  r2 = int(random(alphabet.length))
  while (r2 == r1) { r2 = int(random(alphabet.length)) }
  features.sent1 = r1;
  features.sent2 = r2;
  // features.sent1 = 1 // FORCING A PARTICULAR MEMENTO

  r = random(-PI / 2, PI / 2)   // INITIAL ROTATIONS
  features.rotX = r;

  r = random(-PI / 4, PI / 4)
  features.rotY = r;

  r = random(-PI / 4, PI / 4)
  features.rotZ = r;

  r = random()  //  COLORS : background, boxes, texts
  //r = 0.89 /// DEBUG =======================================================
  if (r < 0.6) {
    features.bgcol = color(0, 0, 0); // BLACK BACKGROUND
    s = random();
    if (s < 0.60) {
      print("black bg, white text")
      features.txcol = color(1, 0, 100); // white text
      n = int(random(colors.bxblackbg.length));
      features.bxcol = colors.bxblackbg[n];
    }
    else {
      print("black bg, combo txt/box")
      n = int(random(colors.comboblackbg.length));
      features.txcol = colors.comboblackbg[n][0];
      features.bxcol = colors.comboblackbg[n][1];
    }
  }
  else {
    if (r < 0.90) {
      print("white bg, black/white text")
      features.bgcol = color(1, 0, 95); // WHITE BACKGROUND
      if (random() > 0.2) { features.txcol = color(0, 0, 0); } // black text
      else { features.txcol = color(1, 0, 100) } // white text

      n = int(random(colors.bxwhitebg.length));
      features.bxcol = colors.bxwhitebg[n];
     // features.bxcol = colors.bxwhitebg[2]; /// DEBUG :::::::::::::::::::::::::::::
    }
    else {                        // COLOR BACKGROUND
      print("color bkgd, combos txt/box")
      n = colors.combocolors.length;
      m = int(random(n));
      features.bgcol = colors.combocolors[m][0];
      combo = colors.combocolors[m][1];
      o = int(random(combo.length));
      features.txcol = combo[o][0];
      features.bxcol = combo[o][1];
    }
  }

  print(hue(features.bgcol), hue(features.txcol), hue(features.bxcol));




  r = random()                // DIM commands SIZE OF FONT
  if (r < 0.33) { features.dim = 140 } // 150
  else
    if (r < 0.66) { features.dim = 125 } // 150
    else
      if (r < 2) { features.dim = 105 } // 120



  r = random()                // SPACING
  if (r < 0.33) { features.spacing = features.dim + 10 } //very close
  else
    if (r < 0.66) { features.spacing = features.dim * 0.75 } // overlapping
    else { features.spacing = features.dim * 1.5 } // spaced


  r = random()          //        LIGHTS ON ??
  if (r < 0.3) {
    features.lightson = 1
    s = random()
    if (s < 0.5) { features.metal = 1 }
  }
  features.light1 = randomGaussian(60, 10);
  features.light2 = randomGaussian(220, 10);
  features.light3 = randomGaussian(280, 10);


  r = random()        //          SPOTS / GLAZE
  if (r < 0.09) { features.spots = 1 }
  else
    if (r < 0.16) { features.glaze = 1 }


  r = random()              //        VARIOUS FONT COLOR
  if (r < 0.05) { features.variedtextcol = 'rainbow' }
  else
    if (r < 0.12) { features.variedtextcol = 'varyhue' }
    else
      if (r < 0.20) { features.variedtextcol = 'varyalpha' }
      else
        if (r < 0.30) { features.variedtextcol = 'varyboxalpha' }
        else
          if (r < 0.38) { features.variedtextcol = 'varybox'}

  print(features.variedtextcol)


  r = random()              //        FULLNESS
  if (r < 0.10) { features.fullness = 0.3 }
  else
    if (r < 0.35) { features.fullness = 0.5 }
    else
      if (r < 0.65) { features.fullness = 0.8 }

  print('full:', features.fullness)

  for (i = 0; i <= 200; i++) {
    append(randomvalues, random())
  }

  // features.glaze=1
  // print(features)
}

function preload() {
  font = loadFont('assets/SalmaproMedium-yw9ad.otf');
}

function stringtowords(words, sentence) {
  // words = [];
  mot = '';
  for (i = 0; i <= sentence.length; i++) {
    if (sentence[i] != ' ') {
      mot = mot + sentence[i];
    }
    else {
      append(words, mot);
      mot = '';
    }
  }
  return words;
}

function blurtext(texte, posx, posy, intensity) {
  
  for (ii = 0; ii < 40; ii++) {
    xx = 1*intensity * cos(6.28 * ii/40);
    yy = 1*intensity * sin(6.28 * ii/40);
      text(texte, posx + xx, posy +  yy)
  }  
   text(texte, posx, posy)
  }


function blursentence(texte, posx, posy, intensity, bgcol) {
  for (i = 0; i < 20; i++) {
    text(texte, posx + intensity * cos(6.28 * i / 40), posy + intensity * sin(6.28 * i / 40))
  }
  //  textWrap(CHAR)
  text(texte, posx, posy)
}

function scrambleWords(inputString) {
  // Split the input string into words
  let words = inputString.split(' ');

  // Scramble the order of the words
  for (let i = words.length - 1; i > 0; i--) {
    let j = Math.floor(random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]]; // Swap elements
  }

  // Join the scrambled words back into a string
  let scrambledString = words.join(' ');

  return scrambledString;
}

function pickRandomFourWords(inputString) {
  // Split the input string into words
  let words = inputString.split(' ');

  // Handle case where there are fewer than 4 words
  let numberOfWordsToSelect = Math.min(3, words.length);

  let selectedWords = [];
  for (let i = 0; i < numberOfWordsToSelect; i++) {
    // Randomly select a word and ensure it's not already selected
    let wordIndex;
    do {
      wordIndex = Math.floor(random() * words.length);
    } while (selectedWords.includes(words[wordIndex]));

    selectedWords.push(words[wordIndex]);
  }

  // Join the selected words back into a string
  let resultString = selectedWords.join(' ');

  return resultString;
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  maxsize = max(windowHeight, windowWidth);
}

function setup() {

  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  maxsize = max(windowHeight, windowWidth);
  // $fx.rand.reset();
  // seed = int($fx.rand() * 9999999);
  seed = int(random(9999999));
  randomSeed(seed);
  timer = millis()/60;
  // gtime = millis();
  colorMode(HSB)
  frameRate(30);
  lastmousex = mouseX;
  lastmousey = mouseY;
  alphabet = ["cGFsbSB0cmVlIGhvdXNlIHNsZWVwcyBiZWxvdyBzZWEgYWJvdmUgc3RhcnM=",
    "dHdvIHRhaWxzIHBhd3MgbWlzc2luZyBzaWxlbmNlIGJpZyBibHVlIGhvdXNl",
    "ZnJpZW5kcyBwbGF5aW5nIG91dHNpZGUgd2luZG93cyBsZWZ0IG9wZW5lZCBhIHRydWUgaGVhbGluZyBzZWFzb24=",
    "d2hpY2ggc3RhdGUgd2FzIEkgeW91IG5ldmVyIHNhdyBtZSB3ZWFrIGJ1dCBwcm91ZCBteSBoZWFkIGFnYWluc3QgdGhvc2Ugd2FsbHM=",
    "cGluayBjcmVhbSBhbmQgc21va2UgZmxvd2VycyBkaW5pbmcgdGFibGUgd2lsdGluZyBzbyBzbG93bHkgd2hpbGUgbGlnaHQgZGlzYXBwZWFycw==",
    "dGltZXMgb2Ygd2FyIHN0b3JpZXMgdW50b2xkIGJyb3RoZXJzIGxvc3Qgc2VjcmV0cyBmb3JldmVyIG5ldw==",
    "cGxheWluZyB0aGUgZ2FtZSBiYXJlbHkgYmVpbmcgcGxheWVkIHNvbWV0aW1lcyBsb3NlcnMgd2lubmVycyBvciBib3Ro",
    "cmVtZW1iZXIgeW91IHdlcmUgYm9ybiBtb25zdGVyIGJlYXV0eSBzdGFydCBvZiBhbGwgdGhpbmdzIG5pZ2h0IGVjaG8=",
    "SSBjb3VsZCBub3QgZmVlbCBteSBvd24gc2tpbiBudW1ibmVzcyBmcm9tIHRoZSBwaWxscyBkYXkgYWZ0ZXIgZGF5IG9mIHN1cnZpdmFs",
    "c2NlbnQgb2YgcGluZSB0cmVlcyByb2Fkc2lkZSBhcmVhIGZpbGxlZCB3aXRoIHN1bmxpZ2h0IGVuZCBvZiBhIGxvbmcgam91cm5leQ==",
    "ZmVlbGluZyBsb3N0IHJlZCBicmVhdGhpbmcgc2xvd2x5IHRocm91Z2ggeWVsbG93IGJsdWUgaGFkIG1lIHN1cnJlbmRlcg==",
    "c3dlbHRlcmluZyBhcGFydG1lbnQgb3VyIGJvZGllcyBsaWtlIGNlbWVudCB1bnRpbCB0aGUgbmV4dCBodW5nZXIg",
    "YW4gb2NlYW4gdmlldyBleHBhbmRpbmcgZnJvbSBzdG9wIHRvIHN0b3AgYnJlYXRoaW5nIHNlYSBhbmQgc2FsdA==",
    "dW5yZWFkYWJsZSBpbWFnZSBibGFjayBhbmQgc2VwaWEgbGluZXMgb24gZmlsbSB5b3Ugc28gdW5zcGVha2FibHkgcmVhbA==",
    "YW1hemluZyB3ZWlnaHQgb2YgeW91ciBsaW1icyBhdG9wIG1lIGxpa2UgdGhlIHdheSBvZiBsb3Zl",
    "d2hpdGUgZHVzdCBhbmQgc3RhcnMgc2t5IGdsYXNzZXMgZW1wdHkgbmV4dCB1cyBmaXJld29ya3MgYmVhY2g=",
    "Z3JlZW4gZXllcyBwaW5rIG5vc2UgZ2hvc3QgYW5kIGNhdCBlYXRpbmcgcG9wY29ybiBmcm9tIHBsYXN0aWMgY3Vwcw==",
    "YW5jaWVudCBjb2ZmZWUgaG91c2UgcGFyayBncmVlbiBjaGFpcnMgc3Vycm91bmRlZCBieSB0cmVlcyBteSBmcmllbmQgZnJvbSBkZWNhZGVz",
    "eW91IHNpdHRpbmcgaW4gZnJvbnQgb2Ygc2NyZWVuIHdhdGNoaW5nIHlvZ2EgdmlkZW9zIHN1Y2ggdGltZXMgd2lsbCBuZXZlciByZXR1cm4=",
    "bG9zdCBpbiB3b29kcyBmb2xsb3dpbmcgcmh5dGhtIGdhdGhlcmluZyBvdXQgb2YgdGltZQ==",
    "YmV0d2VlbiB2aWxsYWdlIGFuZCBmb3Jlc3Qga2V5IG9wZW5pbmcgc2FjcmVkIGxhbmQgd2hlcmUgcGFzdCBsaXZlcyByZXN0",
    "ZW1wdHkgcGFya2luZyBsb3RzIGJvcmRlciB0aGUgb2NlYW4geWVsbG93IGxpbmVzIHJ1bm5pbmcgcGFyYWxsZWw=",
    "c2t5bGluZSBtb3ZpbmcgZmFzdCBtYW5kYXRvcnkgcGhvdG9ncmFwaCBqdXN0IGJlZm9yZSB0YWtlIC0gb2Zm",
    "eW91ciBzbWlsZSBvdmVyIHJhaW5ib3dzIHN0ZXBzIGludG8gYmx1ZSBwb29sIHJhZGlhbmNlIG9mIHN1bW1lciBhZnRlcm5vb25z",
    "bW9zdCBzb3V0aGVybiBwb2ludCBmYWtlIGlzbGFuZCB0cnVlIGxvdmUgem9vbSBhcm91bmQgb24gYmlrZXM=",
    "ZWFzdCBqb3VybmV5IHJpc2luZyByaXZlciBjdXJ2ZXMgZmxhc2hpbmcgbW9vbiBhc2xlZXAgYWNyb3NzIG5pZ2h0"
  ]
  // img = createGraphics(1600, 1000); // to store previews

  col = 0;
  row = 0;
  createfeatures();
  if (features.spacing < features.dim) {
    gl = this._renderer.GL;
    gl.disable(gl.DEPTH_TEST);
  }
  // testcolors();
  inittextures();
}

function cube(w, index) {
  push()
  texture(fb[index + 2])
  translate(0, 0, -w / 2)
  rotateY(PI)
  rect(-w / 2, -w / 2, w, w) //3.BACK
  rotateY(PI)
  translate(0, 0, w)
  texture(fb[index])
  rect(-w / 2, -w / 2, w, w)// 1.FRONT
  rotateX(PI / 2)
  translate(0, -w / 2, -w / 2)
  texture(fb[index + 1])
  rect(-w / 2, -w / 2, w, w)// 6. BOTTOM
  translate(0, 0, w)
  texture(fb[index])
  rect(-w / 2, -w / 2, w, w)// 5. TOP
  rotateY(PI / 2)
  translate(w / 2, 0, -w / 2)
  rotateX(PI)
  rotateZ(-PI / 2)
  texture(fb[index + 3])
  rect(-w / 2, -w / 2, w, w) //  4. LEFT
  rotateZ(PI / 2)
  rotateX(PI)
  translate(0, 0, w)
  rotateZ(-PI / 2)
  texture(fb[index + 1])
  rect(-w / 2, -w / 2, w, w)//  2.RIGHT
  pop()
}

function inittextures() {
  count = 0

  sentence1 = this.window.atob(alphabet[features.sent1])
  sentence2 = this.window.atob(alphabet[features.sent2])
  // pick 4 words out of sentence2
  fourwords = pickRandomFourWords(sentence2);
  sentence = sentence1 + ' ' + fourwords;
  //  words = stringtowords(sentence1) // sentence
  words = [];
 for (kk = 0; kk < 8; kk++) {
   stringtowords(words, scrambleWords(sentence));
 }

  numwords = words.length


  fb = []; // framebuffers

  textFont(font)
  fsize = features.dim * 0.5; // 0.7
  textSize(fsize) // 
  voffset = fsize / 4; // vertical offset

  for (z = 0; z < 4; z++) {
    for (y = 0; y < 4; y++) {
      for (x = 0; x < 4; x++) {

        index = x + (4 * y) + (16 * z); // index of word in sentence
        w = words[index % numwords] // current word
        wl = w.length;                 // number of characters in word

            
        tw = textWidth(w); // computes width of word in current size
        if (tw < 200) { // fits on one face
          textAlign(CENTER);
          hoffset = 0;
          repeat = 2;
        }
        else if (tw < 400) { //fits on two faces
          textAlign(LEFT);
          hoffset = -100 + 5;
          repeat = 1;
        }
        else {
          textAlign(LEFT)
          hoffset = -95;
          repeat = 0;
        }
        
        noshow = random();
        noshowtreshold = 0.143 * features.fullness + 0.457;
        tblur = int(min(4,max(0, randomGaussian(0, 2))));
        bxcol = features.bxcol;
        huevar = randomGaussian(hue(bxcol), 30);
        alphavar = randomGaussian(0.05, 0.08); // 0.05 0.08
        textalphavar = randomGaussian(0.05, 0.05);
        txcol = features.txcol;
        txalpha = 0.03;
        textcolor = color(hue(txcol), saturation(txcol), brightness(txcol), txalpha);
        textcolvar = randomGaussian(hue(txcol), 10);
          
        for (face = 0; face < 4; face++) { // doing all 4 sides first
          thisface = createFramebuffer({ width: 200, height: 200 });
          thisface.begin();
          colorMode(HSB);
          noStroke();
          
          boxcolor = color(hue(bxcol), saturation(bxcol), brightness(bxcol), 0.07);
          // boxcolor = color(huevar, saturation(bxcol), brightness(bxcol), 0.07);
          fill(boxcolor)

          if (features.variedtextcol == 'varyboxalpha') {
            boxcolor = color(hue(bxcol), saturation(bxcol), brightness(bxcol), alphavar);
            fill(boxcolor)
          }

          if (features.variedtextcol == 'varybox') {
            boxcolor = color(huevar, saturation(bxcol), brightness(bxcol), 0.07);
            fill(boxcolor)
          }
          rect(-100, -100, 200, 200); // background color of box

          // TEXT COLORS
          fill(255, 0.05)
          
          fill(textcolor)
          n = z * 64 + y * 8 + x
          if (features.variedtextcol == 'rainbow') {
            fill((x + y + z) * 15, 70, 80, txalpha)
          }
          if (features.variedtextcol == 'varyhue') { // varies TEXT COLOR on each side
            textcolor = color(textcolvar, saturation(txcol), brightness(txcol), txalpha);
            fill(textcolor)
          }
          if (features.variedtextcol == 'varyalpha') { // varies TEXT ALPHA (same on all sides)
            textcolor = color(hue(txcol), saturation(txcol), brightness(txcol), textalphavar);
            fill(textcolor)
          }
          if (features.variedtextcol == 'varyboxalpha') { // 
            textcolor = color(hue(txcol), saturation(txcol), brightness(txcol), alpha(boxcolor));
            fill(textcolor)
          }
          repeatoffset = 0;
          if (repeat == 1 && face >= 2) repeatoffset = 400;
          if (repeat == 2 && face >= 1) repeatoffset = 200*face;
          if (noshow > noshowtreshold) {
          
            blurtext(w, hoffset - 200 * face + repeatoffset,
              voffset, tblur);
          //   ctx = thisface;
          //   print(ctx)
          // ctx.filter = "blur(10px)";
          // text(w, hoffset - 200 * face + repeatoffset, voffset);
          }
         

          bxcol = features.txcol;



          //      fill(255,0.5)
          if (features.spots > 0) {
            boxcolor = color(hue(bxcol), saturation(bxcol), brightness(bxcol), 1);// 0.07
            fill(boxcolor)
            for (k = 0; k < 500; k++) {
              circle(random(-100, 100), random(-100, 100), 2) // dots
            }
          }
            if (features.glaze > 0) {
              boxcolor = color(hue(bxcol), saturation(bxcol), brightness(bxcol), 0.01);// 0.01
              fill(boxcolor)
              for (k = 0; k < 500; k++) {
                rect(random(-100, 100), random(-100, 100), random(60)) // good for white on black
              }
            }
          

          
          thisface.end();
          
          append(fb, thisface); // adds the face to fb[count]
          count++;


        }
      }

    }

  }

  // pg.rect(0,0,50,50)
}


function mousePressed() {
  lastmousex = mouseX - lastmousex;
  lastmousey = mouseY - lastmousey;
}

function mouseReleased() {
  lastmousex = mouseX-lastmousex;
  lastmousey = mouseY-lastmousey;
}

function draw() {

  background(features.bgcol);

  treshold = 1 - features.fullness;
 
  noStroke();
 
  translate(0, 0, (700 - windowWidth) / 1.5);
  count = 0;
  
  if (rotating) {
    m += 0.001;
  }
  rotateX(m)
  rotateY(m)
  rotateZ(0.9*m)
  if (mouseIsPressed === true) {
    rotateY((mouseX-lastmousex) / 200)
    rotateX((mouseY-lastmousey) / 200)
  }
  else {
    rotateY((lastmousex) / 200)
    rotateX((lastmousey) / 200)
  }
  
  rotateX(features.rotX)
  rotateY(features.rotY)
  rotateZ(features.rotZ)
  //  translate(0,0,-windowHeight)
  fc = int(frameCount / 10)
  fc = 0
  factor = windowWidth / 700; // accounts for deformation when screen is too big
  translate(-features.spacing * 1.5 * factor, -features.spacing * 1.5 * factor,
    -features.spacing * 1.5 * factor)


  noStroke()
 
  if (features.lightson > 0) {
    specularMaterial('white');
    pointLight(features.light1, 100, 70, -500, 500, -1000) // yellow
    pointLight(features.light2, 100, 70, 500, 500, -1000) // blue
    pointLight(features.light3, 100, 70, 500, -500, -1000) // red
    pointLight(0, 0, 10, 0, -200, -2000) // white
    ambientLight(50)
  }

 
  if (features.metal > 0) { // only works if lightson
    shininess(100);
  }
  
  for (z = 0; z < 4; z += 1) {
    for (y = 0; y < 4; y += 1) {
      for (x = 0; x < 4; x += 1) {
        push()
        translate(x * features.spacing * factor, y * features.spacing * factor,
          z * features.spacing * factor)

        n = x + y * 16 + 4 * z;
       
        if (randomvalues[count] > treshold) {
        
          cube(factor * features.dim, 4 * count)

        }

        pop()
        count++;
      }
    }
  }

  if ((millis() / 1000 - timer) > 60) { // every xx seconds...
    timer = millis() / 1000;
    seed = int(random(9999999));
    randomSeed(seed);
    createfeatures();
    inittextures();
  }

 
}
