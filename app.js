var THREE = require("./scripts/three.min.js");
var Stage = require("./scripts/stage.js");
var Snake = require("./scripts/snake.js");
var Cube = require("./scripts/cube.js");
var Food = require("./scripts/food.js");

function addChildrenToFringeSet(parentNode) {
    var northCoords = {
        x: parentNode.x/Segment.SEGMENT_SIZE,
        y: (parentNode.y-Segment.SEGMENT_SIZE)/Segment.SEGMENT_SIZE
    };
    var southCoords = {
        x: parentNode.x/Segment.SEGMENT_SIZE,
        y: (parentNode.y+Segment.SEGMENT_SIZE)/Segment.SEGMENT_SIZE
    };
    var westCoords = {
        x: (parentNode.x-Segment.SEGMENT_SIZE)/Segment.SEGMENT_SIZE,
        y: parentNode.y/Segment.SEGMENT_SIZE
    };
    var eastCoords = {
        x: (parentNode.x+Segment.SEGMENT_SIZE)/Segment.SEGMENT_SIZE,
        y: parentNode.y/Segment.SEGMENT_SIZE
    };
    var children = [];

    if(parentNode.y-Segment.SEGMENT_SIZE >= 0) {
        var cellToConsider = grid.cells[northCoords.x][northCoords.y];
        if(cellToConsider && !snake.cellIsSnake(cellToConsider)) {
            children.push(cellToConsider);
        }
    }
    if(parentNode.y+Segment.SEGMENT_SIZE < canvasHeight) {
        var cellToConsider = grid.cells[southCoords.x][southCoords.y];
        if(cellToConsider && !snake.cellIsSnake(cellToConsider)) {
            children.push(cellToConsider);
        }
    }
    if(parentNode.x-Segment.SEGMENT_SIZE >= 0) {
        var cellToConsider = grid.cells[westCoords.x][westCoords.y];
        if(cellToConsider && !snake.cellIsSnake(cellToConsider)) {            
            children.push(cellToConsider);
        }
    }
    if(parentNode.x+Segment.SEGMENT_SIZE < canvasWidth) {
        var cellToConsider = grid.cells[eastCoords.x][eastCoords.y];
        if(cellToConsider && !snake.cellIsSnake(cellToConsider)) {
            children.push(cellToConsider);
        }
    }                        

    children.forEach(function(child) {

        var found = null;
        var childIsInClosed = closedSet.some(function(item) {
            return item.equal(child);
        });
        if(!childIsInClosed) {
            child.d = parentNode.d + distanceFromNodeToNode(parentNode, child);
            var L2 = distanceFromNodeToNode(child, food.item);
            child.dPlusL2 = child.d + L2;
            child.parent = parentNode;
        }
        fringeSet.push(child);
    });

    fringeSet.sort(function(a,b) {
        return a.dPlusL2 > b.dPlusL2 ? 1 : -1;
    });
}

//http://mnemstudio.org/path-finding-a-star.htm
function findRoute() {
    if(fringeSet.length === 0) {
        return snake.head;
    } else {
        var node = fringeSet.shift();
        if(node.equal(food.item)) {
            return node;
        } else {
            var found = null;
            var nodeIsInClosed = closedSet.some(function(item) {
                return item.equal(node);
            });
            if(!nodeIsInClosed) {
                closedSet.push(node);
                addChildrenToFringeSet(node);
            }
            return findRoute();
        }

    }

}

function distanceFromNodeToNode(node1, node2) {
    var node1X = node1.x;
    var node1Y = node1.y;
    
    var node2X = node2.x;
    var node2Y = node2.y;

    var dx = (node2X - node1X);
    var dy = (node2Y - node1Y);
    var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    return distance;
}

function updateSnakeFromNode(node) {
    snake.head.material.color.setHex(0x000000);
    var newTail = snake.tail.next;
    snake.tail.updatePosition(node);
    var newHead = snake.tail;
    newHead.next = null;
    snake.head.next = newHead;
    snake.head = newHead;
    snake.tail = newTail;
    snake.head.material.color.setHex(0xFF0000);
}

function setupKeyHandlers() {

    document.addEventListener('keydown', function(event) {
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
        } else if(event.keyCode === 87) { //w
            updateSnakeFromNode(new Cube({
                position: new THREE.Vector3(
                    snake.head.position.x + Cube.CUBE_DIMENSION_SIZE, 
                    snake.head.position.y, 
                    snake.head.position.z),
                type: "snake"                
            }));
        }
        else if(event.keyCode === 83) { //s
            updateSnakeFromNode(new Cube({
                position: new THREE.Vector3(
                    snake.head.position.x - Cube.CUBE_DIMENSION_SIZE, 
                    snake.head.position.y, 
                    snake.head.position.z),
                type: "snake"                
            }));
        }
        else if(event.keyCode === 81) { //q
            updateSnakeFromNode(new Cube({
                position: new THREE.Vector3(
                    snake.head.position.x, 
                    snake.head.position.y + Cube.CUBE_DIMENSION_SIZE, 
                    snake.head.position.z),
                type: "snake"                
            }));
        }        
        else if(event.keyCode === 69) { //e
            updateSnakeFromNode(new Cube({
                position: new THREE.Vector3(
                    snake.head.position.x, 
                    snake.head.position.y - Cube.CUBE_DIMENSION_SIZE, 
                    snake.head.position.z),
                type: "snake"                
            }));
        }
        else if(event.keyCode === 65) { //a
            updateSnakeFromNode(new Cube({
                position: new THREE.Vector3(
                    snake.head.position.x, 
                    snake.head.position.y, 
                    snake.head.position.z + Cube.CUBE_DIMENSION_SIZE),
                type: "snake"                
            }));
        }   
        else if(event.keyCode === 68) { //d
            updateSnakeFromNode(new Cube({
                position: new THREE.Vector3(
                    snake.head.position.x,
                    snake.head.position.y, 
                    snake.head.position.z - Cube.CUBE_DIMENSION_SIZE),
                type: "snake"                
            }));
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

var fringeSet = [];
var closedSet = [];
var nodePath = [];

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var stage = new Stage();
stage.init(5);
scene.add(stage.mesh);

var snake = new Snake({
    position: new THREE.Vector3()
});

snake.traverse(addCubeToScene(scene));
//stage.traverse(addCubeToScene(scene))

var food = new Food();
scene.add(food.item.mesh);

camera.position.z = 50;
camera.position.x = 100;
camera.position.y = 100;
setupKeyHandlers();

var render = function () {
    requestAnimationFrame( render );

    var timer = Date.now() * 0.0001;
    camera.position.x = Math.cos( timer ) * 200;
    camera.position.z = Math.sin( timer ) * 200;
    camera.lookAt( scene.position );

    if(!nodePath.length) {
        //search();
    }           
    //update();


    renderer.render(scene, camera);
};

render();