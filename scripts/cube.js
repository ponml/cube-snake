
var THREE = require("./three.min.js");

Cube.CUBE_DIMENSION_SIZE = 10;

function Cube(options) {
    var me = this;
    if(!options) {
        options = {};
    }
    var effectiveCubeDimension = options.dimension || Cube.CUBE_DIMENSION_SIZE;
    me.width = effectiveCubeDimension;
    me.length = effectiveCubeDimension;
    me.height = effectiveCubeDimension;

    me.d = 0;
    me.dPlusL2 = 0;
    me.parent = options.parent;
    me.type = options.type;

    me.i = options.i;   
    me.j = options.j;
    me.k = options.k;
    me.size = options.size || Cube.CUBE_DIMENSION_SIZE;    
    me.position = options.position || new THREE.Vector3();
    me.color = options.color || 0x000000;
    me.geometry = new THREE.BoxGeometry( me.size, me.size, me.size);
    me.material = new THREE.MeshBasicMaterial( { color: me.color } );
    me.mesh = new THREE.Mesh( me.geometry, me.material );
    me.mesh.position.add(me.position);
}

Cube.prototype.equals = function equals(cube) {
    var me = this;
    return me.position.equals(cube);
}

Cube.prototype.updatePosition = function updatePosition(cube) {
    var me = this;
    me.position = new THREE.Vector3().add(cube.position);
    me.mesh.position.set(cube.position.x, cube.position.y, cube.position.z);
};

module.exports = Cube;
