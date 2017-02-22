var THREE = require("./three.min.js");
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
                me.cubes[i][j].push(new Cube(
                    {
                        position: new THREE.Vector3(
                            i*Cube.CUBE_DIMENSION_SIZE, 
                            j*Cube.CUBE_DIMENSION_SIZE, 
                            k*Cube.CUBE_DIMENSION_SIZE
                        )
                    }
                ));
                
            }
        }
    }
    var stageSize = dimension * Cube.CUBE_DIMENSION_SIZE;

    var geometry = new THREE.BoxGeometry( 100, 100, 100);

    var wireframe = new THREE.WireframeGeometry( geometry );

    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.opacity = 0.75;
    line.material.transparent = true;
    me.line = line;
    // me.geometry = new THREE.BoxGeometry( stageSize, stageSize, stageSize );
    // me.material = new THREE.LineBasicMaterial( { color: 0xffffff } );
    // me.mesh = new THREE.Mesh( me.geometry, me.material );
    // //wireframe
    // var geo = new THREE.EdgesGeometry( me.mesh.geometry ); // or WireframeGeometry
    // var mat = new THREE.LineBasicMaterial( { color: 0xFF00FF, linewidth: 100 } );
    // var wireframe = new THREE.LineSegments( geo, mat );
    // me.mesh.add( wireframe );

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