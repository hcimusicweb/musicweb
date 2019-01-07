let numGenre;
let genres = [];
let lines = [];
var h, w;
let easycam;
let data;
let sideBar;
let info;
let header;
let searchForm;
let searchDiv;
let searchInput;
let searchButton;
let currentFocus;
let overlay;
let text;
let start;
let question;
let selected;

function preload(){
  loadJSON("data.json", setData);
}

function setup() {
  w = windowWidth - 5;
  h = windowHeight - 5;
  start = true;

  overlay = createDiv();
  overlay.id("overlay");
  overlay.size(w, h);
  overlay.style('display', "block");
  text = createDiv('<h1>Welcome to the Spotify Musicweb</h1> <br> You can explore 126 different genres and the connections between each other <br> If there is a link between two genres it means spotify recommends one if you like the other. <br> <br> Controls: <br> Zoom: scrolling <br> Rotate: Hold left mouse and move <br> Move web: Hold middle mouse button and move <br> Click on a circle to see information about that genre <br> <br> Click anywhere to close this overlay');
  text.id("text");
  overlay.child(text);

  selected = -1;

  question = select('.question');
  question.position(w - 60, h - 50);

  var canvas = createCanvas(w, h, WEBGL);
  canvas.parent(select("#canvas"));
  pixelDensity(1);
  setAttributes('antialias', true);

  console.log(Dw);
  console.log(Dw.EasyCam.INFO);

  Dw.EasyCam.prototype.apply = function(n){
    var o = this.cam;
    n = n || o.renderer,
    n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
  };

  easycam = createEasyCam();
  easycam.setDistance(4000, 0);

  sideBar = createDiv('<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>');
  sideBar.class("sidenav");

  searchForm = select('.search');
  searchDiv = select('.autocomplete');
  searchInput = select('#myInput');
  searchForm.position(w - 380, 20);
  searchButton = select('button');
  searchButton.mousePressed(buttonPressed);
  searchInput.input(inpEvent);
}

function draw() {
  background(128 ,128 ,128);

  //orbitControl();
  noStroke();

  for(let i = 0; i < lines.length; i++){
    if(selected < 0)
      lines[i].draw();
    else if(lines[i].gen1.id == selected || lines[i].gen2.id == selected)
      lines[i].draw();
  }
  for(let i = 0; i < numGenre; i++){
    if(selected < 0)
      genres[i].draw();
    else if(i == selected)
      genres[i].draw();
    else if(genres[i].hasLink(selected) || genres[selected].hasLink(i))
      genres[i].draw();
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
  this.links = [];

  this.draw = function(){
    push();
    fill(this.color);
    translate(this.x, this.y, this.z);
    sphere(20);
    pop();
  }

  this.addLink = function(genin){
    this.links.push(genin);
  }

  this.hasLink = function(m){
    for(let i = 0; i < this.links.length; i++){
      if(this.links[i] == m)
        return true;
    }
    return false;
  }
}

function genLine(gen1, gen2){
  this.gen1 = gen1;
  this.gen2 = gen2;
  this.x1 = gen1.x;
  this.y1 = gen1.y;
  this.z1 = gen1.z;
  this.x2 = gen2.x;
  this.y2 = gen2.y;
  this.z2 = gen2.z;

  this.draw = function(){
    push();

    stroke(255, 0, 1);
    if(selected < 0)
      strokeWeight(1);
    else
      strokeWeight(4);
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
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(windowWidth -5, windowHeight-5);

  easycam.setViewport([0,0,windowWidth, windowHeight]);

  searchForm.position(w - 380, 20);
  
}

function mouseClicked(){
  if(start){
    start = false;
    overlay.style('display', "none");
  }
  else{
    let x = getObjectID(mouseX, mouseY);
    for(let i = 0; i < numGenre; i++){
      if(red(genres[i].color) == red(x) && green(genres[i].color) == green(x) && blue(genres[i].color) == blue(x)){
        //genres[i].color = randColor();
        openNav(i);
        break;
      }
    }
  }
}

function getObjectID(mx, my) {
  if (mx > w || my > h || mx < 0 || my < 0) {
    return 0;
  }
    loadPixels();
    var index = 4 * ((h-my) * w + mx);

    return color(pixels[index], pixels[index+1], pixels[index+2]);
}

function setData(data){
  numGenre = data.length;
  for(let i = 0; i < numGenre; i++){
    genres.push(new genre(i, data[i].name, color(data[i].color), data[i].x, data[i].y, data[i].z, data[i].info));
  }
  
  for(let i = 0; i < numGenre; i++){
    for(let j = 0; j < data[i].links.length; j++){
      for(let k = 0; k < numGenre; k++){
        if(data[i].links[j] == genres[k].name){
          genres[i].addLink(genres[k].id);
          lines.push(new genLine(genres[i], genres[k]))
        }
      }
    }
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
  sideBar.style('width', '33%');
  info = createP(genres[i].info);
  header = createElement('h1', genres[i].name.charAt(0).toUpperCase() + genres[i].name.slice(1));
  sideBar.child(header);
  sideBar.child(info);
  selected = i;
  let sel = false;
}

function closeNav() {
  selected = -1;
  info.remove();
  header.remove();
  sideBar.style('width', 0);
}

function inpEvent(){
  var a, b, i, val = searchInput.value();
  var name;
  closeAllLists();

  if (!val) { return false;}
  currentFocus = -1;

  a = createDiv();
  a.attribute("id", "autocomplete-list");
  a.attribute("class", "autocomplete-items");
  searchDiv.child(a);

  for(i = 0; i < numGenre; i++){
    name = genres[i].name;
    if(name.substr(0, val.length).toUpperCase() == val.toUpperCase()){
      b = createDiv("<strong>" + name.substr(0, val.length) + "</strong>");
      b.html(name.substr(val.length), true);
      b.html("<input type='hidden' value='" + name + "'>", true);
      b.elt.addEventListener("click", function(e) {
        /*insert the value for the autocomplete text field:*/
        searchInput.value(this.getElementsByTagName("input")[0].value);
        /*close the list of autocompleted values,
        (or any other open lists of autocompleted values:*/
        closeAllLists();
        buttonPressed();
      });
      /*mousePressed(function(e){
        searchInput.value(select('input', this).value());
        closeAllLists();
        buttonPressed();
      });*/

      a.child(b);
      console.log(b);
    }
  }
}

function closeAllLists(elmnt) {
  var x = selectAll(".autocomplete-items");
  for (var i = 0; i < x.length; i++){
    if (elmnt != x[i] && elmnt != searchInput){
      x[i].remove();
    }
  }
}

function keyPressed(){
  var a;
  var x = select("#autocomplete-list");
  if(x) a = selectAll("div", x);
  switch(keyCode){
    case DOWN_ARROW:
      currentFocus++;
      addActive(a);
      break;
    case UP_ARROW:
      currentFocus--;
      addActive(a);
      break;
    case ENTER:
    case RETURN:
      if (a){
        searchInput.value(select('input', a[currentFocus]).value());
        closeAllLists();
        buttonPressed();
      }
      //return false;
      break;
  }
}

function addActive(x) {
  /*a function to classify an item as "active":*/
  if (!x) return false;
  /*start by removing the "active" class on all items:*/
  removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = (x.length - 1);
  /*add class "autocomplete-active":*/
  x[currentFocus].addClass("autocomplete-active");
}

function removeActive(x) {
  /*a function to remove the "active" class from all autocomplete items:*/
  for (var i = 0; i < x.length; i++) {
    x[i].removeClass("autocomplete-active");
  }
}

function buttonPressed(){
  var val = searchInput.value();
  var name, gen, i;
  for(i = 0; i < numGenre; i++){
    gen = genres[i];
    name = gen.name;
    if(val.toUpperCase() == name.toUpperCase()){
      easycam.setCenter([gen.x, gen.y, gen.z], 500);
      easycam.setDistance(200, 500);
      searchInput.value("");
      openNav(gen.id);
    }
  }
}

function showStart(){
  start = true;
  overlay.style('display', "block");
}