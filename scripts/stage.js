var THREE = require("./three.min.js");
var Cube = require("./cube.js");

function Stage(options) {
    var me = this;
    me.cubes = [];
    me.size = options.size;
}

Stage.prototype.init = function(dimension) {
    var me = this;
    var i,j,k;
    me.dimension = dimension;
    var min_dimension = -1 * 5;
    for(i = 0 ; i < dimension*2 ; i++) {
        me.cubes.push([]);
        for(j = 0 ; j < dimension*2 ; j++) {
            me.cubes[i].push([]);
            for(k = 0 ; k < dimension*2 ; k++) {
                me.cubes[i][j].push(new Cube(
                    {
                        position: new THREE.Vector3(
                            (i-dimension)*Cube.CUBE_DIMENSION_SIZE, 
                            (j-dimension)*Cube.CUBE_DIMENSION_SIZE, 
                            (k-dimension)*Cube.CUBE_DIMENSION_SIZE
                        ),
                        type: "stage",
                        i: i,
                        j: j,
                        k: k,
                        transparent: true
                    }
                ));
                
            }
        }
    }
    var stageSize = dimension * Cube.CUBE_DIMENSION_SIZE;
    var cubeDimPadding = Cube.CUBE_DIMENSION_SIZE;
    me.geometry = new THREE.BoxGeometry(me.size, me.size, me.size);
    me.material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
    me.mesh = new THREE.Mesh( me.geometry, me.material );
    me.mesh.material.depthTest = false;
    me.mesh.material.opacity = 0.15;
    me.mesh.material.transparent = true;

    var wireframe = new THREE.WireframeGeometry( me.geometry );
    var lines = new THREE.LineSegments( wireframe );
    me.mesh.add(lines);
    me.mesh.position.add(new THREE.Vector3(-5,-5,-5));
}

Stage.prototype.draw = function draw() {
    var me = this;
};

Stage.prototype.rotate = function rotate() {
    var me = this;
};

Stage.prototype.traverse = function(callback) {
    var me = this;
    for(i = 0 ; i < me.dimension*2 ; i++) {
        for(j = 0 ; j < me.dimension*2 ; j++) {
            for(k = 0 ; k < me.dimension*2 ; k++) {
                callback(me.cubes[i][j][k]);
            }
        }
    }    
};

module.exports = Stage;