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

const lightGeometry = new THREE.SphereGeometry( 1, 32, 16 );
const lightMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
const light = new THREE.Mesh ( lightGeometry, lightMaterial );
light.position.x = 20;
light.position.y = 10;
light.position.z = 30;
scene.add ( light )

//var material = new THREE.MeshBasicMaterial();
var material = new THREE.ShaderMaterial( {
  uniforms: { 
		uLightX: {type: 'f', value: 20}, 
		uLightY: {type: 'f', value: 10},
    uLightZ: {type: 'f', value: 30},
		uShininess: {type: 'f', value: 30.0} 
  },
  vertexShader: document.getElementById( 'vertexShader2' ).textContent,
  fragmentShader: document.getElementById( 'fragmentShader2' ).textContent  
} );

var geo = new TeapotGeometry(15, 10, true, true, true, true, true);
//size, segments, bottom, lid, body, fitLid, blinn
var mesh = new THREE.Mesh(geo, material); 
scene.add( mesh );

const trackBallControls = new TrackballControls ( camera, renderer.domElement );

var controls = new function () {
  this.lightX = 20;
  this.lightY = 10;
  this.lightZ = 30;
  this.shin = 30.0;
}

var gui = new GUI ();
  gui.add(controls, 'lightX', -20, 20);    
  gui.add(controls, 'lightY', -15, 15);  
  gui.add(controls, 'lightZ', 25, 50); 
  gui.add(controls, 'shin', 10.0, 60.0);  

var step = 0;

render ();

function render () {
	// Update uniforms
  material.uniforms.uLightX.value = controls.lightX; 
  material.uniforms.uLightY.value = controls.lightY;
  material.uniforms.uLightZ.value = controls.lightZ;
  material.uniforms.uShininess.value = controls.shin; 

  light.position.x = controls.lightX;
  light.position.y = controls.lightY;
  light.position.z = controls.lightZ;
 
  // render
	renderer.render ( scene, camera );
	requestAnimationFrame ( render );
	trackBallControls.update (); 
}
