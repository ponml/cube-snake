var Cube = require("./cube.js");

function Stage(options) {
    var me = this;
    me.cubes = [];
}

Stage.prototype.init = function(dimension) {
    var me = this;
    var i,j,k;
    me.dimension = dimension;
    for(i = 0 ; i < dimension ; i++) {
        me.cubes.push([]);
        for(j = 0 ; j < dimension ; j++) {
            me.cubes[i].push([]);
            for(k = 0 ; k < dimension ; k++) {
                me.cubes[i][j].push(new Cube({
                    i: i,
                    j: j,
                    k: k
                }));
                
            }
        }
    }
}

Stage.prototype.draw = function draw() {
    var me = this;
};

Stage.prototype.rotate = function rotate() {
    var me = this;
};

Stage.prototype.traverse = function(callback) {
    var me = this;
    for(i = 0 ; i < me.dimension ; i++) {
        for(j = 0 ; j < me.dimension ; j++) {
            for(k = 0 ; k < me.dimension ; k++) {
                callback(me.cubes[i][j][k]);
            }
        }
    }    
};

module.exports = Stage;