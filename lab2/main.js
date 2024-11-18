import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GUI } from 'dat.gui'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xEEEEEE, 1.0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows for better results
document.body.appendChild( renderer.domElement );

// axes helper
var axesHelper = new THREE.AxesHelper( 20 );
scene.add( axesHelper );

// create the planes
var planeGeometry = new THREE.PlaneGeometry(60,60);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
var GroundPlane = new THREE.Mesh(planeGeometry,planeMaterial);
planeGeometry = new THREE.PlaneGeometry ( 60, 30 );
var SecondPlane = new THREE.Mesh ( planeGeometry, planeMaterial );

// Move and rotate the planes
GroundPlane.rotation.x = -Math.PI * 0.5;
SecondPlane.rotation.x = -Math.PI * 0.5;
SecondPlane.position.y = 30;
SecondPlane.position.z = -15;

GroundPlane.receiveShadow  = true;
SecondPlane.receiveShadow = true;
 
// add the planes to the scene
scene.add ( GroundPlane );
scene.add ( SecondPlane );

var stairs = getStairs ( 20 );
stairs.castShadow = true;
scene.add ( stairs );

// position and point the camera to the center of the scene
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

// add spotlight for the shadows
var spotLight = new THREE.SpotLight( 0xffffff, 250 );
spotLight.position.set( 20, 25, 40 );
spotLight.target.position.set( 0, 0, 0 );
spotLight.castShadow = true;
spotLight.decay = 1.5;
scene.add( spotLight );
scene.add( spotLight.target );

const helper = new THREE.CameraHelper( spotLight.shadow.camera );
scene.add( helper );

// add abientLight
const ambiantLight = new THREE.AmbientLight ( 0xffffff, 0.5 );
scene.add ( ambiantLight );

const trackBallControls = new TrackballControls(camera, renderer.domElement);

var controls = new function() {
	this.stepCountt = 20;
            
        this.asGeom = function () {
        	// remove the old plane
                scene.remove(stairs);
                
                // create a new one
                stairs = getStairs(controls.stepCountt)
                
                stairs.castShadow = true;
                
                // add it to the scene.
        	scene.add(stairs);
        };
}

var gui = new GUI();
gui.add(controls, 'stepCountt',10,30).step(1).onChange(controls.asGeom);

console.log(renderer.capabilities );

render();

function getStairs ( stepCount ) {

	var gaph = ( ( 7.5 * Math.PI ) + 23 ) / ( stepCount );
	var gapv = 30 / (stepCount);


	var stepGeometry = new THREE.ExtrudeGeometry ( drawStepShape(), {depth: 0.3, bevelEnabled: false} );
	var stepMaterial = new THREE.MeshLambertMaterial({color: 0xdb9b5a});
	var plateGeometry = new THREE.BoxGeometry ( gaph * 1.3, 0.1, 1 );
	var metalMaterial = new THREE.MeshPhongMaterial ( {color: 0x999999, specular: 0xffffff, shininess: 50 } );
	var cylinderGeometry = new THREE.CylinderGeometry ( 0.2, 0.2, gapv );
	var railSupportGeometry = new THREE.CylinderGeometry ( 0.1, 0.1, 5);
	var railSupportGeometry2 = new THREE.CylinderGeometry ( 0.1, 0.1, 5 - ( 0.5 - (stepCount / 100 ) ));
	
	const points = [];

	var i, stair, plate, supportCylinder, railSupport, stepRotate;

	var stairs = new THREE.Object3D ();
	
	stairs.castShadow = true;
		
	var pos = 12;
		
	for ( i = 0; pos >= -11; i ++ ) {
		stair = new THREE.Mesh ( stepGeometry, stepMaterial );
		plate = new THREE.Mesh ( plateGeometry, metalMaterial );
		supportCylinder = new THREE.Mesh ( cylinderGeometry, metalMaterial );
		railSupport = new THREE.Mesh ( railSupportGeometry, metalMaterial );

		stair.castShadow = true;
		plate.castShadow = true;
		supportCylinder.castShadow = true;
		railSupport.castShadow = true;

		stair.rotation.x = Math.PI * ( 0.5 + ( ( i + ( ( stepCount + 1 ) % 2 ) ) % 2 ) );
		stair.rotation.z = -Math.PI * 0.5;

		stair.position.x = pos;
		plate.position.x = pos - ( gaph * 0.75 ) + 0.5;
		supportCylinder.position.x = pos;
		railSupport.position.x = pos - 0.5;

		stair.position.y = gapv * ( i + 1 ) + ( 0.15 * ( ( 1 - ( ( i % 2 ) * 2 ) ) * ( - 1 + ( ( stepCount % 2 ) * 2 ) ) ) );
		plate.position.y = gapv * ( i + 1 ) - 0.2;
		supportCylinder.position.y = gapv * ( i + 1 ) - ( 0.5 * gapv ) - 0.15;
		railSupport.position.y = gapv * ( i + 1 ) + 2.5;

		stair.position.z = 15;
		plate.position.z = 15;
		supportCylinder.position.z = 15;
		railSupport.position.z = 18;

		stairs.add ( stair );
		stairs.add ( plate );
		stairs.add ( supportCylinder );
		stairs.add ( railSupport );
		
		const globalPosition = new THREE.Vector3();
		railSupport.getWorldPosition(globalPosition);
		points.push ( globalPosition );

		pos -= gaph;
	}

	var stepsLeft = stepCount - i;
	
	const pointsCurve = [];

	for (i = 0; i < stepsLeft; i++ ) {

		stair = new THREE.Mesh ( stepGeometry, stepMaterial );
		plate = new THREE.Mesh ( plateGeometry, metalMaterial );
		supportCylinder = new THREE.Mesh ( cylinderGeometry, metalMaterial );
		railSupport = new THREE.Mesh ( railSupportGeometry2, metalMaterial );

		plate.rotation.y = ( Math.PI / 180 ) * ( 90 - ( 100 / stepCount ));

		stair.castShadow = true;
		plate.castShadow = true;
		supportCylinder.castShadow = true;
		railSupport.castShadow = true;

		stair.position.x = -15;
		plate.position.x = -15 + ( 8 / stepCount);
		supportCylinder.position.x = -15;
		railSupport.position.x = -18;

		stair.position.y = 30 - ( gapv * i ) + ( 0.15 * ( 1 - ( ( i % 2 ) * 2 ) ) );
		plate.position.y = 30 - ( gapv * i ) - 0.2;
		supportCylinder.position.y = 30 - ( gapv * i ) - ( 0.5 * gapv ) - 0.15;
		railSupport.position.y = 30 - ( gapv * i ) + 2.5;

		plate.position.z = ( - gaph * 0.75 ) - 0.5 + ( 10 / stepCount);
		railSupport.position.z = -0.5;

		stair.rotation.x = Math.PI * ( 0.5 + ( i % 2 ) );
		stair.rotation.z = Math.PI * ( i % 2 );
	
		stepRotate = new THREE.Object3D ();
		stepRotate.position.x = -11;
		stepRotate.add ( stair );
		stepRotate.add ( plate );
		stepRotate.add ( supportCylinder );
		stepRotate.add ( railSupport );
		stepRotate.rotation.y = ( ( Math.PI * 0.5 ) - ( ( - pos - 11) / 15 ) ) / ( stepsLeft - 1 ) * i;
		stepRotate.castShadow = true;
		
		const globalPosition = new THREE.Vector3();
		stepRotate.children[3].getWorldPosition(globalPosition);
		pointsCurve.push ( globalPosition );
	
		stairs.add ( stepRotate );
	}
	
	pointsCurve.reverse();
		
	// SplineCurve3 is no longer a valid constructor in recent versions of the three.js library. It was replaced with THREE.CatmullRomCurve3.
	var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3( points.concat ( pointsCurve ) ), 100, 0.3, 100, false);
	var railing = new THREE.Mesh ( tubeGeometry, metalMaterial );
	
	railing.position.y += 2.5;
	
	railing.castShadow = true;
	
	stairs.add ( railing );
	
	const endGeometry = new THREE.SphereGeometry( 0.6, 32, 16 );
	var railingStart = new THREE.Mesh ( endGeometry, metalMaterial );
	var railingEnd = new THREE.Mesh ( endGeometry, metalMaterial );
	
	railingStart.position.x = points [0].x;
	railingStart.position.y = points [0].y + 2.5;
	railingStart.position.z = points [0].z;
	railingEnd.position.x = pointsCurve [ pointsCurve.length -1 ].x;
	railingEnd.position.y = pointsCurve [ pointsCurve.length -1 ].y + 2.5;
	railingEnd.position.z = pointsCurve [ pointsCurve.length -1 ].z;
	
	stairs.add ( railingStart );
	stairs.add ( railingEnd );
	
	stairs.castShadow = true;
		
	return stairs;
}

function drawStepShape() {
	var shape = new THREE.Shape();

	shape.moveTo ( -3, 1 );
	shape.bezierCurveTo ( 0.5, 0.8, 2, -0.1, 3, 0 );
	shape.lineTo ( 3, -1 );
	shape.lineTo ( -3, -1 );
	shape.lineTo ( -3, 1 );

	return shape;
}
 
function render() {
        // render
	renderer.render( scene, camera );
	requestAnimationFrame( render );
	trackBallControls.update(); 
}
