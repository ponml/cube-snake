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

Snake.prototype.grow = function grow() {
    var me = this;
    var directionUpdate = me.updateTailByDirection[me.currentDirection];

    var newTail = new Cube({
        position: new THREE.Vector3(
            me.tail.x + directionUpdate.x,
            me.tail.y + directionUpdate.y,
            me.tail.z + directionUpdate.z,
        ),
        type: "snake"
    });
    newTail.next = me.tail;
    me.tail = newTail;
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
}



// function Segment(options) {
//     var me = this;

//     me.width = Segment.SEGMENT_SIZE;
//     me.height = Segment.SEGMENT_SIZE;
//     me.colour = options.colour || "black";
//     me.next = options.next || null;
//     me.prev = options.prev || null;
//     me.x = options.x;
//     me.y = options.y;
//     me.d = 0;
//     me.dPlusL2 = 0;
//     me.parent = options.parent;
//     me.ctx = options.ctx;
//     me.type = options.type;
// }

// Segment.prototype.updatePos = function updatePos(x, y) {
//     this.x = x;
//     this.y = y;
// };  

// Segment.prototype.draw = function draw(colour) {
//     var me = this;
//     me.ctx.fillStyle = colour || me.colour;
//     me.ctx.fillRect(me.x, me.y, me.width, me.height);
// };

// Segment.prototype.clear = function clear() {
//     var me = this;
//     me.ctx.clearRect(me.x, me.y, me.width, me.height);
//     me.ctx.strokeStyle="grey";
//     me.ctx.strokeRect(me.x, me.y, me.width, me.height);
// };

// Segment.prototype.equal = function(otherSegment) {
//     var me = this;
//     return me.x == otherSegment.x && me.y == otherSegment.y;
// };

// Segment.SEGMENT_SIZE = 10;


// function Food(stage) {
//     var me = this;
//     me.allFoodPositionsLookup = [];
//     var i,j;
//     for(i = 0 ; i < canvasWidth ; i += Segment.SEGMENT_SIZE) {
//         for(j = 0; j < canvasHeight ; j += Segment.SEGMENT_SIZE) {
//             me.allFoodPositionsLookup.push({ x: i, y: j });
//         }
//     }
//     var startPosition = me.getRandXY();
//     me.item = new Segment({
//         ctx: ctx,
//         x: startPosition.x,
//         y: startPosition.y,
//         colour: 'green',
//         type: "food"
//     });
// }

// Food.prototype.getRandXY = function getRandXY() {
//     function getRandomInt(min, max) {
//             return Math.floor(Math.random() * (max - min + 1)) + min;
//     }
//     var me = this;
//     var min = 0;
//     var max = me.allFoodPositionsLookup.length;
    
//     return me.allFoodPositionsLookup[getRandomInt(min, max)];
// };

// Food.prototype.setNewPosition = function setNewPosition() {
//     var me = this;
//     var pos = me.getRandXY();
//     me.item.colour = "green";
//     me.item.x = pos.x;
//     me.item.y = pos.y;   
// };

// Food.prototype.draw = function draw() {
//     this.item.draw();
// }

// Food.prototype.clear = function clear() {
//     this.item.clear();
// }

// function Grid(ctx, width, height, cellSize) {
//     var me = this;
//     me.cells = [];
//     me.ctx = ctx;
//     me.width = width;
//     me.height = height;
//     me.cellSize = cellSize;

//     var x,y;
//     for(x = 0; x < width ; x += cellSize) {
//         for(y = 0 ; y < height; y += cellSize) {
//             var index = x/cellSize;
//             var newCell = new Segment({
//                 x: x,
//                 y: y,
//                 width: Segment.SEGMENT_SIZE,
//                 height: Segment.SEGMENT_SIZE,
//                 ctx: ctx,
//                 type: "grid"
//             });
//             if(!me.cells[index]) {
//                 me.cells[index] = [newCell];
//             } else {
//                 me.cells[index].push(newCell);
//             }
//         }
//     }
// }

// Grid.prototype.draw = function draw() {
//     var me = this;
//     for(x = 0; x < me.width ; x += me.cellSize) {
//         for(y = 0 ; y < me.height; y += me.cellSize) {
//             var cell = me.cells[x/me.cellSize][y/me.cellSize];
//             me.ctx.strokeStyle="grey";
//             me.ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
//         }
//     }    
    
// }
    

module.exports = Snake;
// {
//     Food: Food,
//     Snake: Snake,
//     Segment: Segment,
//     Grid: Grid,
// };
