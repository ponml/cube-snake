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

Food.prototype.getRandXY = function getRandXY() {
    function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var me = this;
    var min = 0;
    var max = me.allFoodPositionsLookup.length;
    
    return me.allFoodPositionsLookup[getRandomInt(min, max)];
};

Food.prototype.setNewPosition = function setNewPosition() {
    var me = this;
    var pos = me.getRandXY();
    me.item.colour = "green";
    me.item.x = pos.x;
    me.item.y = pos.y;   
};

module.exports = Food;