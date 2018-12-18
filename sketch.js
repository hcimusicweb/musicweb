let numGenre = 6;
let genres = [];
let lines = [];
var h, w;
let easycam;
let canvas;
let data;
let sideBar;
let info;
let header;

function preload(){
  loadJSON("data.json", setData);
}

function setup() {
  w = windowWidth;
  h = windowHeight;


  canvas = createCanvas(w, h, WEBGL);
  pixelDensity(1);
  setAttributes('antialias', true);

  //console.log(Dw);
  //console.log(Dw.EasyCam.INFO);

  /*Dw.EasyCam.prototype.apply = function(n){
    var o = this.cam;
    n = n || o.renderer,
    n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
  };

  easycam = createEasyCam();*/

  sideBar = createDiv('<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>');
  sideBar.class("sidenav");
  /*for(let i = 0; i < numGenre + 1; i++){
    genres.push(new genre(i, randColor(), random(w) - w/2, random(h) - h/2, random(min(w, h))));
    print(genres[i - 101])
  }*/
  for(let i = 0; i < numGenre; i++){
    let a = random(genres);
    let b = random(genres);
    while(a == b){
      b = random(genres);
    }
    lines.push(new genLine(a, b));
  }
}

function draw() {
  background(128 ,128 ,128);

  orbitControl();
  noStroke();

  for(let i = 0; i < numGenre; i++){
    genres[i].draw();
    lines[i].draw();
  }
}

function genre(idin, namein, colorin, xin, yin, zin, infoin){
  this.id = idin;
  this.name = namein;
  this.color = colorin;
  this.x = xin;
  this.y = yin;
  this.z = zin;
  this.info = infoin;

  this.draw = function(){
    push();
    fill(this.color);
    translate(this.x, this.y, this.z);
    sphere(20);
    pop();
  }
}

function genLine(gen1, gen2){
  this.x1 = gen1.x;
  this.y1 = gen1.y;
  this.z1 = gen1.z;
  this.x2 = gen2.x;
  this.y2 = gen2.y;
  this.z2 = gen2.z;

  this.draw = function(){
    push();

    stroke(255, 0, 0);
    line(this.x1, this.y1, this.z1, this.x2, this.y2, this.z2);

    pop();
  }
}
  
function randColor(){
  let r = floor(random(255));
  let g = floor(random(255));
  let b = floor(random(255));

  return color(r, g, b);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  //easycam.setViewport([0,0,windowWidth, windowHeight]);
  //updatePixels();
}

function mousePressed(){
  let x = getObjectID(mouseX, mouseY);
  print("Object: " + x);
  for(let i = 0; i < numGenre; i++){
    if(red(genres[i].color) == red(x) && green(genres[i].color) == green(x) && blue(genres[i].color) == blue(x)){
      //genres[i].color = randColor();
      openNav(i);
      break;
    }
  }
}

function getObjectID(mx, my) {
  if (mx > w || my > h || mx < 0 || my < 0) {
    return 0;
  }
    loadPixels();
    print(pixels);
    var index = 4 * ((h-my) * w + mx);

    return color(pixels[index], pixels[index+1], pixels[index+2]);
}

function setData(data){
  for(let i = 0; i < numGenre; i++){
    genres.push(new genre(i, data[i].name, color(data[i].color), data[i].x, data[i].y, data[i].z, data[i].info));
  }
}

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav(i) {
  if(info !== undefined){
    info.remove();
  }
  if(header !== undefined){
    header.remove();
  }
  sideBar.style('width', '33%')
  info = createP(genres[i].info);
  header = createElement('h1', genres[i].name);
  sideBar.child(header);
  sideBar.child(info);
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  info.remove();
  header.remove();
  sideBar.style('width', 0);
}