var Cube = require("./cube.js");
var THREE = require("./three.min.js");

function Food(startPosition) {
    var me = this;
    me.item = new Cube({
        position: startPosition || new THREE.Vector3(0,20,30),
        color: 0x00FF00,
        type: "food"
    });
}

Food.prototype.getNewPosition = function getNewPosition(stage) {
    function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var me = this;

    var max = Cube.CUBE_DIMENSION_SIZE-1;

    var i = getRandomInt(0,max);
    var j = getRandomInt(0,max);
    var k = getRandomInt(0,max);

    return new THREE.Vector3().add(stage.cubes[i][j][k].position);
};

module.exports = Food;