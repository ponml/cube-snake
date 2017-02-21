var THREE = require("./scripts/three.min.js");
var Stage = require("./scripts/stage.js");

function setupKeyHandlers() {

    document.addEventListener('keydown', function(event) {
        console.log("x: "+ camera.position.x + ", y: " + camera.position.y + ", z: " + camera.position.z);
        var amount = 1;
        if(event.keyCode === 187) { //+
            camera.position.y += amount;
        } else if(event.keyCode === 189) { //-
            camera.position.y -= amount;
        } else if(event.keyCode === 37) { //left
            camera.position.z += amount;
        } else if(event.keyCode === 39) { //right
            camera.position.z -= amount;
        } else if(event.keyCode === 38) { //up
            camera.position.x += amount;
        } else if(event.keyCode === 40) { //-
            camera.position.x -= amount;
        }
        console.log("x: "+ camera.position.x + ", y: " + camera.position.y + ", z: " + camera.position.z);
    });
}

function addCubeToScene(scene) {
    return function addCube(cube) {
        scene.add(cube.mesh);
    };
}

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var camHelper = new THREE.CameraHelper( camera );
scene.add(camHelper);

var axisHelper = new THREE.AxisHelper( 100 );
scene.add(axisHelper);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var stage = new Stage()
stage.init(5);
stage.traverse(addCubeToScene(scene));

camera.position.z = 50;
var pos = 0.01;
setupKeyHandlers()

var render = function () {
    requestAnimationFrame( render );

    var timer = Date.now() * 0.0001;
   // camera.position.x = Math.cos( timer ) * 200;
   // camera.position.z = Math.sin( timer ) * 200;
    camera.lookAt( scene.position );

    renderer.render(scene, camera);
};

render();