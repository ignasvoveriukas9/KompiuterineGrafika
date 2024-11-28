import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GUI } from 'dat.gui';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);


// position and point the camera 1 to the center of the scene
camera.position.x = -100;
camera.position.y = 90;
camera.position.z = 120;
camera.lookAt(scene.position);


var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xEEEEEE, 1.0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows for better results
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild( renderer.domElement );

// axes helper
var axesHelper = new THREE.AxesHelper( 20 );
scene.add ( axesHelper );

// add abientLight
const ambiantLight = new THREE.AmbientLight ( 0xffffff, 1 );
scene.add ( ambiantLight );

//var shape = generateShape ( generatePoints ( 10, 20, 100000 ) );

//scene.add ( shape );

var shape = generateShapeWithUV(generatePoints(10, 20, 500));
//scene.add(shape);

//fixSeams(shape.geometry);
scene.add(shape);

const trackBallControls = new TrackballControls(camera, renderer.domElement);

var controls = new function() {

}

var gui = new GUI ();

var step = 0;

render();

function generatePoints ( width, height, n) {
	var points = [];
        for ( var i = 0; i < n; i++ ) {
        	var randomX = (Math.random() * width ) - ( width * 0.5 );
                var randomY = (Math.random() * height ) - ( height * 0.5 );
                var randomZ = (Math.random() * width ) - ( width * 0.5 );
                
                if ( ( ( randomX * randomX ) + ( randomZ * randomZ ) ) <= ( ( width * 0.5 ) * ( width * 0.5 ) ) ){
                	points.push(new THREE.Vector3(randomX, randomY, randomZ));
                }
        }
        
        return points
}

function generateShape ( points ) {
	//var meshMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
	var meshMaterial = new THREE.MeshNormalMaterial();
	var hullGeometry = new ConvexGeometry(points);
        var hullMesh = new THREE.Mesh( hullGeometry, meshMaterial );
        return hullMesh
}

function generateShapeWithUV(points) {
    var geometry = new ConvexGeometry(points);

    // Compute bounding box for normalization
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;
    const height = bbox.max.y - bbox.min.y; // h
    const radius = (bbox.max.x - bbox.min.x) / 2; // Approximation for R

    // Add UV mapping
    var uv = [];
    geometry.attributes.position.array.forEach((_, i) => {
        const x = geometry.attributes.position.getX(i);
        const y = geometry.attributes.position.getY(i);
        const z = geometry.attributes.position.getZ(i);

        const phi = Math.atan2(z, x);
        const u = (phi + Math.PI) / (2 * Math.PI); // Normalize phi to [0, 1]
        //const u = (phi ) / (2 * Math.PI);
        const v = (y - bbox.min.y) / height; // Normalize y to [0, 1]

        uv.push(u, v);
    });
    
    //uv = fixUV ( uv );

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    
    //geometry = fixSeams ( geometry );

    // Assign texture
    const texture = new THREE.TextureLoader().load('./tiles_0059_color_1k.jpg');
    const material = new THREE.MeshStandardMaterial({ map: texture });

    return new THREE.Mesh(geometry, material);
}

function fixSeams(geometry) {
    const uv = geometry.attributes.uv.array; // UV array (flat: [u1, v1, u2, v2, ...])
    const position = geometry.attributes.position.array; // Position array for debugging
    const indices = geometry.index ? geometry.index.array : null; // Use indices if indexed

    // Helper function to adjust UV
    const adjustUV = (i) => {
        if (uv[i * 2] < 0.5) uv[i * 2] += 1; // Add 1 to u if u < 0.5
        else uv[i * 2] -= 1; // Subtract 1 from u if u > 0.5
    };

    // Iterate through each triangle
    //const triangleCount = indices ? indices.length / 3 : uv.length / 6;
    const triangleCount = uv.length / 6;
    console.log ( uv.length );
    for (let i = 0; i < triangleCount; i++) {
        // Get vertex indices of the triangle
        //const v0 = indices ? indices[i * 3] : i * 3;
        //const v1 = indices ? indices[i * 3 + 1] : i * 3 + 1;
        //const v2 = indices ? indices[i * 3 + 2] : i * 3 + 2;
        
        const v0 = i * 3;
        const v1 = i * 3 + 1;
        const v2 = i * 3 + 2;

        // Extract u-coordinates
        const u0 = uv[v0 * 2];
        const u1 = uv[v1 * 2];
        const u2 = uv[v2 * 2];

        // Check if the triangle spans the seam
        if (
            (u0 < 0.5 && u1 < 0.5 && u2 > 0.5) ||
            (u0 > 0.5 && u1 > 0.5 && u2 < 0.5) ||
            (u0 < 0.5 && u2 < 0.5 && u1 > 0.5) ||
            (u0 > 0.5 && u2 > 0.5 && u1 < 0.5) ||
            (u1 < 0.5 && u2 < 0.5 && u0 > 0.5) ||
            (u1 > 0.5 && u2 > 0.5 && u0 < 0.5)
        ) {
            // Fix the seam by adjusting UVs
            if (u0 < 0.5 && u1 < 0.5) adjustUV(v2);
            else if (u1 < 0.5 && u2 < 0.5) adjustUV(v0);
            else if (u0 < 0.5 && u2 < 0.5) adjustUV(v1);
	    else if (u0 > 0.5 && u1 > 0.5) adjustUV(v2);
            else if (u1 > 0.5 && u2 > 0.5) adjustUV(v0);
            else if (u0 > 0.5 && u2 > 0.5) adjustUV(v1);
        }
    }
    
    //geometry.attributes.uv.array = uv;

    // Update the UV attribute
    geometry.attributes.uv.needsUpdate = true;
    //return geometry
}

function render() {
        
        // render
	renderer.render( scene, camera );
	requestAnimationFrame( render );
	trackBallControls.update(); 
}
