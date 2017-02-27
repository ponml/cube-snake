    var THREE = require("./scripts/three.min.js");
var Stage = require("./scripts/stage.js");
var Snake = require("./scripts/snake.js");
var Cube = require("./scripts/cube.js");
var Food = require("./scripts/food.js");

var STAGE_SIZE = 100;

function addChildrenToFringeSet(parentNode) {
    var children = parentNode.getChildrenInStage(stage);
    children.forEach(function(child) {

        if(!child || snake.checkForCollision(child)) {
            return;
        }
        child.material.color.setHex(0x554433);
        var found = null;
        var childIsInClosed = closedSet.some(function(item) {
            return item.equals(child);
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
        if(node.equals(food.item)) {
            return node;
        } else {
            var found = null;
            var nodeIsInClosed = closedSet.some(function(item) {
                return item.equals(node);
            });
            if(!nodeIsInClosed) {
                closedSet.push(node);
                addChildrenToFringeSet(node);
            }
            //return food.item;
            return findRoute();
        }

    }

}

function distanceFromNodeToNode(node1, node2) {
    var result = node1.position.distanceTo(node2.position);
    return result;
}

function updateSnakeFromNode(node) {

    var gridIndexes = node.positionToGrid();
    var i = gridIndexes.i;
    var j = gridIndexes.j;
    var k = gridIndexes.k;
    var max = Cube.CUBE_DIMENSION_SIZE;

    if(i < max && j < max && k < max &&  i >= 0 && j >= 0 && k >=0) {
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
}

 function search() {
    fringeSet = [];
    closedSet = [];
    fringeSet.push(snake.head);

    var node = findRoute();
    if(node.equals(food.item)) {           
       
        if(node) {
            nodePath.unshift(node);
            var curNode = node.parent;
            while(curNode) {
                //scene.add(curNode.mesh);
                nodePath.unshift(curNode);
                curNode = curNode.parent;
            }
        }
    }

}

function update() {
    var node = nodePath.shift();
    if(node) {
        updateSnakeFromNode(node);
        checkForFood();
    }
}

function checkForFood() {
    if(snake.head.equals(food.item)) {
        var grew = snake.grow(stage);
        if(grew) {
            scene.add(snake.tail.mesh);
            var newPos = null;
            do {
                newPos = food.getNewPosition(stage);
            } while(snake.checkForCollisionByPosition(newPos));
            food.item.position.setX(newPos.x);
            food.item.position.setY(newPos.y);
            food.item.position.setZ(newPos.z);
            food.item.mesh.position.setX(newPos.x);
            food.item.mesh.position.setY(newPos.y);
            food.item.mesh.position.setZ(newPos.z);
            // updateScore();        
        } else {
            gameOver();
        }

    }
}

function gameOver() {
    alert("game over");
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
        else if(event.keyCode === 80) { //p
            search();
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

var stage = new Stage({
    size: STAGE_SIZE
});
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
        search();
    }           
    update();


    renderer.render(scene, camera);
};

render();