// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix* u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {

    if(u_whichTexture == -2){
      gl_FragColor = u_FragColor;
    }
    else if(u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    }
    else if(u_whichTexture == 0){

      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
    else if(u_whichTexture == -3){

      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else if(u_whichTexture == -6){

      gl_FragColor = texture2D(u_Sampler2, v_UV);
    }
    else{
      gl_FragColor = vec4(1,0.2,0.2,1);
    }
  }`

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;

function setupWebGl(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
} 
function connectVariablesToGLSL(){
    // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  //Get storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if(!u_Sampler1){
      console.log('Failed to get the storage location of u_Sampler1');
      return false;
    }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if(!u_Sampler2){
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }


  

  //Set the initial value of the matrix
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  var projectionMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);
}

//Constants
const POINT=0;
const TRIANGLE=1;
const CIRCLE=2;
//Globals UI based
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=10;
let g_selectedType=POINT;
let g_globalAngle=60;
let g_legAngle=0;
let g_bodyAngle=0;
let g_tailAngle=0;
let g_tailAngle2=0;
let g_mouthAngle=0;
let g_headAngle=0;
let g_leftArmAngle=0;
let g_rightArmAngle=0;
let g_spikeColor=0.3;
let g_bodyAngle2=0;
let g_animation=false;
let g_startTime=null;
let g_quick=false;
let poke=false;
let g_eyeStore=[0,0,0];
let g_atStore=[0,0,0];
let g_upStore=[0,0,0];
let heliON=false;
let missileOn=false;
let missileStartTime = null;
let missileDone=false;





//let g_segNum=10;

function addActionsForHtmlUI(){
    
    
    
    document.getElementById('heli').onclick = function() {
      g_eyeStore = camera.eye.elements.slice(); 
      g_atStore = camera.at.elements.slice(); 
      g_upStore = camera.up.elements.slice(); 
      camera.eye.elements = [1, 8.5, 7];
      camera.at.elements = [0, -70, -100];
      camera.up.elements = [0, 1.5, 0];
      heliON = true;
    };    
    document.getElementById('heliOff').onclick = function() {
      camera.eye = new Vector([1, 0.1, 3]);
      camera.at = new Vector([0, 0, -100]);
      camera.up = new Vector([0, 1.5, 0]);
      camera.viewMatrix.setLookAt(
        camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
        camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
        camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
      );
      heliON = false;
    };






}   

function initTextures() {
  
  
  var image = new Image();  // Create the image object
  var image1= new Image();
  var image2= new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  if (!image1) {
    console.log('Failed to create the image object');
    return false;
  }
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }

  
  // Register the event handler to be called on loading an image
  image.onload = function() {sendImageToTEXTURE0(image);};

  image.src = './building.jpg';

  image1.onload = function() {sendImageToTEXTURE1(image1);};
  image1.src = './sky.jpg';

  image2.onload = function() {sendImageToTEXTURE2(image2);};
  image2.src = './lizardSkin.jpg';


  return true;
}



function sendImageToTEXTURE0(image) {
  
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  console.log('finished loadTexture');
  renderAllShapes();
}

function sendImageToTEXTURE1(image) {
  console.log('image:', image);
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);

  console.log('finished loadTexture1');
  renderAllShapes();

}

function sendImageToTEXTURE2(image) {
  console.log('image:', image);
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);

  console.log('finished loadTexture2');
  renderAllShapes();

}


function main() {
    setupWebGl();
    connectVariablesToGLSL();
    addActionsForHtmlUI();

    document.onkeydown = keydown;

    initTextures();
    console.log('u_whichTexture value:', u_whichTexture);

    camera = new Camera(); 
    g_animation=true; 
    g_startTime=null; 
    g_quick=false; 
    poke=false; 
    tick();
    
  canvas.onmousedown = function(ev) {
    if (ev.shiftKey) {
        poke = true;
        g_animation = true;
        g_startTime = null;
        g_quick = false;
        tick();
    }
};
let isMouseDown = false;

canvas.addEventListener('mousedown', () => {
  isMouseDown = true;
});

canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown && camera.oldMouseX !== null && camera.oldMouseZ !== null) {
    const newX = event.offsetX - camera.oldMouseX;
    

    camera.rotateUsingMouse(newX);
  }

  camera.oldMouseX = event.offsetX;
  camera.oldMouseZ = event.offsetY;
});

  gl.clearColor(0.6, 0.8, 1.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  renderAllShapes();
}

function keydown(ev) {
  if (ev.keyCode == 39) { 
    camera.right();
  } else if (ev.keyCode == 37) {
    camera.left();
  } else if (ev.keyCode == 38) { 
    camera.forward();
  } else if (ev.keyCode == 40) { 
    camera.back();
  } else if (ev.keyCode == 81) { 
    camera.rotateLeft();
  } else if (ev.keyCode == 69) { 
    camera.rotateRight();
  }

}




var g_shapesList=[];


var g_seconds=performance.now()/1000.0 - g_startTime;

function tick() {

  
  if (g_startTime === null) {
    g_startTime = performance.now() / 1000.0;
    if (g_quick) {
      g_startTime -= 30; 
    }
  }
  g_seconds = performance.now() / 1000.0 - g_startTime;
  renderAllShapes();
  if (g_animation) {
    requestAnimationFrame(tick);
  }
}





var g_map=[
  [2,2,2,1,1,2,2,1,1,1,2,2,1,1,1,1,2,2,1,1,2,2,1,1,1,2,2,1,2,2,1,1],//1
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//2
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//3
  [2,0,0,1,1,2,2,1,1,2,2,1,1,0,0,2,2,0,0,0,0,0,0,0,0,3,3,0,0,6,0,2],//4
  [1,0,0,1,1,2,2,1,1,2,2,1,1,0,0,2,2,0,0,0,0,0,0,0,0,3,3,0,0,0,0,2],//5
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,1],//6
  [1,0,6,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],//7
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],//8
  [2,0,0,1,1,2,2,2,2,1,1,0,0,0,2,2,2,2,1,1,1,1,2,2,0,0,0,0,0,0,0,1],//9
  [1,0,0,1,1,2,2,2,2,1,1,0,0,0,2,2,2,2,1,1,1,1,2,2,0,0,0,0,0,0,0,2],//10
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],//11
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//12
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//13
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],//14
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,2],//15
  [2,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],//16
  [2,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//17
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//18
  [2,0,0,1,1,2,2,2,2,1,1,0,0,0,1,1,2,2,1,1,1,1,2,2,0,0,0,0,0,0,0,1],//19
  [2,0,0,1,1,2,2,2,2,1,1,0,0,0,1,1,2,2,1,1,1,1,2,2,0,0,0,0,0,0,0,1],//20
  [2,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],//21
  [2,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],//22
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//23
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//24
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],//25
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2],//26
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,3,3,3,0,0,0,0,1],//27
  [2,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,1],//28
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,2],//29
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],//30
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],//31
  [2,2,1,1,2,2,1,1,2,2,1,1,2,2,1,2,2,1,2,1,2,2,1,2,2,1,2,2,1,1,2,2],//32
];

function drawMap(){
  for(x=0;x<32;x++){
    for(y=0;y<32;y++){
      if(g_map[x][y]==1){
        var cube = new Cube();
        cube.color=[0.1,0.1,0.1,1.0];
        cube.textureNum=-0;
        cube.matrix.translate(x-16,-0.95,y-16);
        cube.matrix.scale(1,2.5,1);
        cube.render();
      }
      if(g_map[x][y]==2){
        var cube = new Cube();
        cube.color=[0.1,0.1,0.1,1.0];
        cube.textureNum=-0;
        cube.matrix.translate(x-16,-0.95,y-16);
        cube.matrix.scale(1,4.5,1);
        cube.render();
      }
      if(g_map[x][y]==3){
        var cube = new Cube();
        cube.color=[0.1,0.1,0.1,1.0];
        cube.textureNum=-0;
        cube.matrix.translate(x-16,-0.95,y-16);
        cube.matrix.scale(1,6.5,1);
        cube.render();
      }
      if(g_map[x][y]==4){
        var cube = new Cube();
        cube.color=[0.1,0.1,0.1,1.0];
        cube.textureNum=-1;
        cube.matrix.translate(x-16,-0.95,y-16);
        cube.matrix.scale(1,3.5,1);
        cube.render();
      }
      if(g_map[x][y]==5){
        var cube = new Cube();
        cube.color=[0.1,0.1,0.1,1.0];
        cube.textureNum=-2;
        cube.matrix.translate(x-16,-0.95,y-16);
        cube.matrix.scale(1,3.5,1);
        cube.render();
      }
      if(g_map[x][y]==6){
        var cube = new Cube();
        cube.color=[0.1,0.1,0.1,1.0];
        cube.textureNum=-6;
        cube.matrix.translate(x-16,0,y-16);
        cube.matrix.scale(1,1,1);
        cube.render();
      }
    }
  }
}

function handleTextureClick(event) {
  const selectedTexture = event.target.src;
  console.log('Selected texture:', selectedTexture);
  missileOn = true;
}


function renderAllShapes(){
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(100, canvas.width / canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawMap();

  var floor = new Cube();
  floor.color=[0.4,0.4,0.4,1.0];
  floor.textureNum=-2;
  floor.matrix.translate(0.0,-0.95,0);
  floor.matrix.scale(100,0.01,100);
  floor.matrix.translate(-0.5,-0.5,-0.5);
  floor.render();

  var sky = new Cube();
  sky.color=[0.4,0.4,1,1.0];
  sky.textureNum=-3;
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-0.5,-0.5,-0.5);
  sky.render();

  
  
  if (heliON == true) {
    g_globalAngle = g_seconds * 10;
    var amplitude = 1.0;
    var frequency = 0.5;
    var verticalPosition = amplitude * Math.sin(g_seconds * frequency);
    camera.eye.elements[1] += verticalPosition / 100;
    camera.viewMatrix.setLookAt(
      camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
      camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
      camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
    );
  }
//launches missile
  if (missileOn == true) {
    if (missileStartTime === null) {
      missileStartTime = performance.now() / 1000.0; 
      camera.eye.elements = [0, 200, 0];
      camera.at.elements = [0, 0, 100];
      camera.up.elements = [0, 0, 1];
    }
  
    const missileTime = (performance.now() / 1000.0) - missileStartTime;
  
    var missileSpeed = 4;
    var missileLocation = Math.min(missileTime / missileSpeed, 1); 
    var start = 200; 
    var end = 0.1; 
    camera.eye.elements[1] = start + (end - start) * missileLocation;
  
    
    
    camera.viewMatrix.setLookAt(
      camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
      camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
      camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
    );
  
    
//Gets rid of Godzilla and resets camera
    if(missileTime>5){
      missileDone=true;
      missileStartTime = null;
      camera.eye = new Vector([1, 0.1, 3]);
      camera.at = new Vector([0, 0, -100]);
      camera.up = new Vector([0, 1.5, 0]);
      camera.viewMatrix.setLookAt(
        camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
        camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
        camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
      );
      if (missileLocation === 1) {
        missileOn = false;
      }
    }
  }

  

  if(missileDone==false){
    var BreathCoord1=godzillaLoad();

  
  
    if(g_seconds>32){
      breathTime(BreathCoord1);
    }
  }
  


  
  








  
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " +  Math.floor(duration) + " fps " + Math.floor(10000/duration)/10, "numdot")

  //console.log("Camera position: (" + g_eye[0] + ", " + g_eye[1] + ", " + g_eye[2] + ")");

}

function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}
