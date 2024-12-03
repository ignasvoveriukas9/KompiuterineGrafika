import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GUI } from 'dat.gui';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

const scene2 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera3 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

//const cameraBody1 = getCameraBody ();
const cameraBody2 = getCameraBody ();
const cameraBody3 = getCameraBody ();

//scene2.add ( cameraBody1 );
scene2.add ( cameraBody2 );
scene2.add ( cameraBody3 );

const helper = new THREE.CameraHelper( camera2 );
scene2.add( helper );


// position and point the camera 1 to the center of the scene
camera1.position.x = -100;
camera1.position.y = 80;
camera1.position.z = 120;
camera1.lookAt(scene2.position);

camera3.position.x = 0;
camera3.position.y = 120;
camera3.position.z = 0;

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xEEEEEE, 1.0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows for better results
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild( renderer.domElement );

// axes helper
var axesHelper = new THREE.AxesHelper( 20 );
scene2.add ( axesHelper );

// add abientLight
const ambiantLight = new THREE.AmbientLight ( 0xffffff, 1 );
scene2.add ( ambiantLight );

// scene 2

// add spotlight for the shadows
var spotLight = new THREE.SpotLight( 0xffffff, 250 );
spotLight.position.set( 30, 50, 40 );
spotLight.target.position.set( 0, 0, 0 );
spotLight.castShadow = true;
spotLight.decay = 1.5;
scene2.add( spotLight );
scene2.add( spotLight.target );

const loader = new THREE.TextureLoader();
const texture = loader.load( './tiles_0059_color_1k.jpg' );
texture.colorSpace = THREE.SRGBColorSpace;

// Set the texture to repeat
texture.wrapS = THREE.RepeatWrapping; // Horizontal wrapping
texture.wrapT = THREE.RepeatWrapping; // Vertical wrapping

// Set how many times the texture should repeat
texture.repeat.set(4, 4); // Adjust these values for desired tiling
texture.offset.set(0.25, 0.25); // Shift the texture halfway along each axis

var planeGeometry = new THREE.PlaneGeometry(1000,1000);
var planeMaterial = new THREE.MeshStandardMaterial({map: texture,});
var GroundPlane = new THREE.Mesh(planeGeometry,planeMaterial);
GroundPlane.receiveShadow  = true;
GroundPlane.rotation.x = -Math.PI * 0.5;
scene2.add ( GroundPlane );

var kingStatic = generateFigure ();
kingStatic.position.x = -100;
scene2.add ( kingStatic );

camera2.position.x = -100;
camera2.position.y = 23;
camera2.position.z = 100 / ( 2 * Math.tan ( 0.5 * 50 * Math.PI / 180 ) );

camera2.lookAt ( new THREE.Vector3 ( kingStatic.position.x, kingStatic.position.y + 35, kingStatic.position.z ) );

var king = generateFigure ();
scene2.add ( king );

camera3.lookAt ( king.position );

//const cameraBody = getCameraBody ();
//scene2.add ( cameraBody );

var camera = camera1;

var controls = new function() {
	this.cam1_fov = 50;
	this.cam2_zoomFactor = 50; // Factor to control dolly zoom
            
    	this.updateFOV = function () {
        	camera1.fov = this.cam1_fov; // Update the camera's FOV
        	camera1.updateProjectionMatrix (); // Apply the changes to the camera
    	};
    	
    	this.updateDollyZoom = function () {
        // Adjust the camera's FOV based on zoomFactor
        camera2.fov = this.cam2_zoomFactor; // Example calculation
        camera2.updateProjectionMatrix();

        // Adjust the camera's position.z to simulate dolly movement
        var distance = 100 / ( 2 * Math.tan ( 0.5 * this.cam2_zoomFactor * Math.PI / 180 ) )
        camera2.position.z = distance;
        camera2.position.y = 23;
        camera2.lookAt ( new THREE.Vector3 ( kingStatic.position.x, kingStatic.position.y + 23, kingStatic.position.z ) );
        };
        
        this.cam_1 = function() {
		camera = camera1;
	};
	
	this.cam_2 = function() {
		camera = camera2;
	};
	
	this.cam_3 = function() {
		camera = camera3;
	};
}

var gui = new GUI ();
//gui.add ( controls, 'fov', 10, 100 ).step ( 1 ).onChange ( controls.updateFOV () );
gui.add(controls, 'cam1_fov', 10, 100).step(1).onChange(function(value) {
    controls.cam1_fov = value;         // Update the control's FOV value
    controls.updateFOV();         // Call the update function to apply changes
});
gui.add(controls, 'cam2_zoomFactor', 30, 120).step(1).onChange(function (value) {
    controls.cam2_zoomFactor = value;    // Update the control's zoom factor
    controls.updateDollyZoom();    // Apply the dolly zoom effect
});

gui.add(controls, 'cam_1');
gui.add(controls, 'cam_2');
gui.add(controls, 'cam_3');

var step = 0;

render();

function generateFigure () {
            
            var pointsX = [
            	0, 10, 10, 7,  6,  5,  4,  5, 10, 10,  3, 10,  2,  0 ];
            var pointsY = [
            	0,  0,  3, 4,  7, 10, 15, 25, 28, 30, 31, 40, 41, 41 ];
            	
            var points = [];
            for ( var i = 0; i < pointsX.length; i++) {
            	points.push ( new THREE.Vector2 ( pointsX [ i ], pointsY [ i ] ) );
            }

            // use the points to create a latheGeometry
            var meshMaterial = new THREE.MeshLambertMaterial ( { color: 0xf0f0f0, transparent: false } );
            var latheGeometry = new THREE.LatheGeometry(points, Math.ceil ( 12 ), 0, 2 * Math.PI );
            var latheMesh = new THREE.Mesh ( latheGeometry, meshMaterial );
            
            var crossGeometry = new THREE.ExtrudeGeometry ( drawCrossShape (), { depth: 2, bevelEnabled: false } );
            var crossMesh = new THREE.Mesh ( crossGeometry, meshMaterial );
            
            crossMesh.position.y = 41;
            crossMesh.position.z = -1;
            crossMesh.position.x = -3;
            
            //scene2.add ( crossMesh );
            
            var figure = new THREE.Object3D ();
            
            latheMesh.castShadow = true;
            crossMesh.castShadow = true;
            
            figure.add ( latheMesh );
            figure.add ( crossMesh );

            //scene2.add(latheMesh);
            return figure;
}

function drawCrossShape() {
	var shape = new THREE.Shape();

	shape.moveTo ( 2, 0 );
	shape.lineTo ( 4, 0 );
	shape.lineTo ( 4, 2 );
	shape.lineTo ( 6, 2 );
	shape.lineTo ( 6, 4 );
	shape.lineTo ( 4, 4 );
	shape.lineTo ( 4, 6 );
	shape.lineTo ( 2, 6 );
	shape.lineTo ( 2, 4 );
	shape.lineTo ( 0, 4 );
	shape.lineTo ( 0, 2 );
	shape.lineTo ( 2, 2 );
	shape.lineTo ( 2, 0 );

	return shape;
}

function getCameraBody () {

const bodyGeom = new THREE.BoxGeometry ( 2, 4, 8 );
const meshMaterial = new THREE.MeshLambertMaterial ( { color: 0xf0f0f0, transparent: false } );
const body = new THREE.Mesh ( bodyGeom, meshMaterial );

const lensGeom = new THREE.CylinderGeometry ( 0.75, 0.75, 1 );
const lens = new THREE.Mesh ( lensGeom, meshMaterial );
lens.rotation.x = Math.PI / 2;
lens.position.z = - 4.5;

const tapeGeom = new THREE.CylinderGeometry ( 2, 2, 1 );
const tape1 = new THREE.Mesh ( tapeGeom, meshMaterial );
const tape2 = new THREE.Mesh ( tapeGeom, meshMaterial );

tape1.rotation.z = Math.PI / 2;
tape2.rotation.z = Math.PI / 2;

tape1.position.z = -2;
tape2.position.z = 2;
tape1.position.y = 3;
tape2.position.y = 3;

const camera = new THREE.Object3D ();

camera.add ( body );
camera.add ( lens );
camera.add ( tape1 );
camera.add ( tape2 );

return camera;
}

function updateCameraBody ( camera, cameraBody, offset ){
	cameraBody.position.copy ( camera.position );
	cameraBody.position.z += offset;
	cameraBody.quaternion.copy ( camera.quaternion );
}

function render() {

	// move figure
        step += 0.03;
        king.position.z = 0 + ( 25 * (Math.cos(step)));
        king.position.y = 0 + ( 20 * Math.abs(Math.sin(step)));

	var targetUP = new THREE.Vector3 ( 0, 1, 0 );
        
	if ( king.position.z >= 0.5 && king.position.z <= -0.5 ){
		targetUP.set ( 0, 1, 0 );
	}
	if ( king.position.z < 5.5 && king.position.z >= 4.5 ){
		targetUP.set ( 0.5, 0.5, 0 );
	}
	if ( king.position.z > -5.5 && king.position.z <= -4.5 ){
		targetUP.set ( 0.5, 0.5, 0 );
	}
        
	camera3.up.lerp ( targetUP, 0.05 );
        camera3.lookAt ( king.position );

	updateCameraBody ( camera2, cameraBody2, 6 );
	updateCameraBody ( camera3, cameraBody3, -6 );
        
        // render
	renderer.render( scene2, camera );
	requestAnimationFrame( render );
}
