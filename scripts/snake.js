var THREE = require("./three.min.js");
var Cube = require("./cube.js");

function Snake(options) {
    var me = this;   

    if(!options) {
        options = {};
    }

    me.position = options.position;
    me.reset();
}

Snake.prototype.reset = function reset() {
    var me = this;
    
    me.head = null;
    me.tail = null;

    var tail = new Cube({
        position: new THREE.Vector3(me.position.x, me.position.y, me.position.z),
        color: 0x000000,
        type: "snake"
    });
    var body = new Cube({
        position: new THREE.Vector3(tail.position.x + Cube.CUBE_DIMENSION_SIZE, tail.position.y, tail.position.z),
        color: 0x000000,
        type: "snake"
    });
    var head = new Cube({
        position: new THREE.Vector3(body.position.x + Cube.CUBE_DIMENSION_SIZE, body.position.y, body.position.z),
        color: 0xFF0000,
        type: "snake"
    });

    tail.next = body;
    body.next = head;
    head.next = null;

    me.head = head;
    me.tail = tail;

    me.updateTailByDirection = {
        NORTH: {
            x: 0,
            y: Cube.CUBE_DIMENSION_SIZE,           
            z: 0
        },
        SOUTH: {
            x: 0,
            y: -1 * Cube.CUBE_DIMENSION_SIZE,
            z: 0
            
        },
        EAST: {
            x: -1 * Cube.CUBE_DIMENSION_SIZE,
            y: 0,        
            z: 0
        },
        WEST: {
            x: Cube.CUBE_DIMENSION_SIZE,
            y: 0,
            z: 0
        },
        UP: {
            x: 0,
            y: 0,
            z: Cube.CUBE_DIMENSION_SIZE
        }   ,
        DOWN: {
            x: 0,
            y: 0,
            z: -1 * Cube.CUBE_DIMENSION_SIZE
        }                     
    };

};

Snake.prototype.getCubes = function getCubes() {
    var me = this;
    var cube = me.tail;
    var cubes = [];
    while(cube) {
        cubes.push(cube)
        cube = cube.next;
    }    
    return cubes;
};

Snake.prototype.traverse = function traverse(callback) {
    var me = this;
    var cube = me.tail;
    while(cube) {
        callback(cube);
        cube = cube.next;
    }
};

Snake.prototype.clearAll = function clearAll() {
    var me = this;
    var tail = me.tail;
    tail.clear();
    while(tail.next) {
        tail = tail.next;
        tail.clear();
    }
};

Snake.prototype.checkForCollisionByPosition = function checkForCollisionByPosition(position) {
    var me = this;
    var snakeCubes = me.getCubes();
    var targetIsInSnake = snakeCubes.some(function(snakeCube) {
        return snakeCube.position.equals(position);
    });
    return targetIsInSnake;
}

Snake.prototype.checkForCollision = function checkForCollision(cube) {
    var me = this;
    var snakeCubes = me.getCubes();
    var targetIsInSnake = snakeCubes.some(function(snakeCube) {
        return snakeCube.equals(cube);
    });
    return targetIsInSnake;
}

Snake.prototype.grow = function grow(stage) {
    var me = this;
    var children = me.tail.getChildrenInStage(stage);

    var snakeCubes = me.getCubes();


    var newCubeTarget;
    children.some(function(child) {
        var childIsInSnake = me.checkForCollision(child);
        if(!childIsInSnake) {
            newCubeTarget = child;
            return true;
        }
    });

    if(newCubeTarget) {
        var newTail = new Cube({
            position: new THREE.Vector3(
                newCubeTarget.position.x,
                newCubeTarget.position.y,
                newCubeTarget.position.z,
            ),
            type: "snake"
        });
        newTail.next = me.tail;
        me.tail = newTail;
        return true;
    }
    return false;
};

Snake.prototype.cellIsSnake = function cellIsSnake(cell) {
    var me = this;
    var tail = me.tail;
    var found = false;
    while(tail) {
        if(tail.equal(cell)) {
            found = true;
            break;
        }
        tail = tail.next;
    }
    return found;
};

module.exports = Snake;