import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GUI } from 'dat.gui';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';

const scene = new THREE.Scene ();
const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );


// position and point the camera 1 to the center of the scene
camera.position.x = -100;
camera.position.y = 90;
camera.position.z = 120;
camera.lookAt ( scene.position );

//set renderer parameters
var renderer = new THREE.WebGLRenderer ( { antialias: true } );
renderer.setSize ( window.innerWidth, window.innerHeight );
renderer.setClearColor ( 0xEEEEEE, 1.0 );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows for better results
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild ( renderer.domElement );

// axes helper
var axesHelper = new THREE.AxesHelper ( 20 );
scene.add ( axesHelper );

// add abientLight
const ambiantLight = new THREE.AmbientLight ( 0xffffff, 2 );
scene.add ( ambiantLight );

//var material = new THREE.MeshBasicMaterial();
var material = new THREE.ShaderMaterial( {
  uniforms: { 
		uScale: {type: 'f', value: 4.0},
		uEdge: {type: 'f', value:  10.0},
		dx: {type: 'f', value:  0.0}, 
		dy: {type: 'f', value:  0.0}, 
		dz: {type: 'f', value:  1.0} 
    },
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent  
} );

var geo = new TeapotGeometry(15, 10, true, true, true, true, true);
//size, segments, bottom, lid, body, fitLid, blinn
var mesh = new THREE.Mesh(geo, material); 
scene.add( mesh );

const trackBallControls = new TrackballControls ( camera, renderer.domElement );

var controls = new function () {
  this.scale = 1.0;
  this.edge = 0.0;
}

var gui = new GUI ();
  gui.add(controls, 'scale', 1.0, 10.0);    
  gui.add(controls, 'edge', 0.0, 10.0); 

var step = 0;

render ();

function render () {
  // Update uniform
  material.uniforms.uScale.value = controls.scale; 
  material.uniforms.uEdge.value = controls.edge; 
 
  // render
	renderer.render ( scene, camera );
	requestAnimationFrame ( render );
	trackBallControls.update (); 
}
