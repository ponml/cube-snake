
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

    if(options.transparent) {
        me.mesh.material.depthTest = false;
        me.mesh.material.opacity = 0.15;
        me.mesh.material.transparent = true;

        var wireframe = new THREE.WireframeGeometry( me.geometry );
        var lines = new THREE.LineSegments( wireframe );
        me.mesh.add(lines);
    }

    me.mesh.position.add(me.position);
}

Cube.prototype.equals = function equals(cube) {
    var me = this;
    return me.position.equals(cube.position);
};

Cube.prototype.updatePosition = function updatePosition(cube) {
    var me = this;
    me.position = new THREE.Vector3().add(cube.position);
    me.mesh.position.set(cube.position.x, cube.position.y, cube.position.z);
};

Cube.prototype.positionToGrid = function positionToGrid() {
    var me = this;
    var x = me.position.x;
    var y = me.position.y;
    var z = me.position.z;
    var offset = Cube.CUBE_DIMENSION_SIZE / 2;
    var i = (x/Cube.CUBE_DIMENSION_SIZE) + offset;
    var j = (y/Cube.CUBE_DIMENSION_SIZE) + offset;
    var k = (z/Cube.CUBE_DIMENSION_SIZE) + offset;
    return {
        i: i,
        j: j,
        k: k
    };
};

Cube.prototype.getChildrenInStage = function getChildrenInStage(stage) {
    var me = this;
    
    var children = [];   
    var cubeInStage = me.positionToGrid();
    var i = cubeInStage.i;
    var j = cubeInStage.j;
    var k = cubeInStage.k;

    var max = Cube.CUBE_DIMENSION_SIZE - 1;

    var children = [];
    if(i < max) {
        children.push(stage.cubes[i+1][j][k]);
    }
    if(i > 0) {
        children.push(stage.cubes[i-1][j][k]);
    }

    if(j < max) {
        children.push(stage.cubes[i][j+1][k]);
    }
    if(j > 0) {
        children.push(stage.cubes[i][j-1][k]);
    }

    if(k < max) {
        children.push(stage.cubes[i][j][k+1]);
    }
    if(k > 0) {
        children.push(stage.cubes[i][j][k-1]);
    }
    return children;
}

module.exports = Cube;
