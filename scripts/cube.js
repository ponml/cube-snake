
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
    me.position = options.position;

    me.color = options.color || 0x000000;
    
    me.geometry = new THREE.BoxGeometry( me.size, me.size, me.size,  );
    me.material = new THREE.LineBasicMaterial( { color: me.color } );
    

    // me.material = new THREE.MeshPhongMaterial( {
    //     color: me.color,
    //     polygonOffset: true,
    //     polygonOffsetFactor: 1, // positive value pushes polygon further away
    //     polygonOffsetUnits: 1
    // });
    me.mesh = new THREE.Mesh( me.geometry, me.material );
    me.mesh.position.add(me.position);
   //wireframe
    var geo = new THREE.EdgesGeometry( me.mesh.geometry ); // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 25 } );
    var wireframe = new THREE.LineSegments( geo, mat );
    me.mesh.add( wireframe );
}

Cube.prototype.equals = function equals(cube) {
    var me = this;
    if(me.i === cube.i && me.j === cube.j && me.k === cube.k) {
        return true;
    } else {
        return false;
    }
}

module.exports = Cube;
