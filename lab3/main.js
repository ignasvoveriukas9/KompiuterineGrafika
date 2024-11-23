import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GUI } from 'dat.gui';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

const scene = new THREE.Scene();
const scene2 = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);


// position and point the camera to the center of the scene
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xEEEEEE, 1.0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows for better results
document.body.appendChild( renderer.domElement );

// axes helper
var axesHelper = new THREE.AxesHelper( 20 );
scene.add ( axesHelper );
scene2.add ( axesHelper );

// add abientLight
const ambiantLight = new THREE.AmbientLight ( 0xffffff, 1 );
scene.add ( ambiantLight );
scene2.add ( ambiantLight );

// add spotlight for the shadows
var spotLight = new THREE.SpotLight( 0xffffff, 250 );
spotLight.position.set( 20, 25, 40 );
spotLight.target.position.set( 0, 0, 0 );
spotLight.castShadow = true;
spotLight.decay = 1.5;
scene2.add( spotLight );
scene2.add( spotLight.target );

var shape = generateShape ( generatePoints ( 10, 20, 100000 ) );

scene.add ( shape );

var king = generateFigure ();
scene2.add ( king );

const trackBallControls = new TrackballControls(camera, renderer.domElement);

generateFigure();

render();

function generatePoints ( width, height, n) {
	var points = [];
        for ( var i = 0; i < n; i++ ) {
        	var randomX = Math.round(Math.random() * width ) - ( width * 0.5 );
                var randomY = Math.round(Math.random() * height ) - ( height * 0.5 );
                var randomZ = Math.round(Math.random() * width ) - ( width * 0.5 );
                
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

function render() {
        // render
	renderer.render( scene2, camera );
	requestAnimationFrame( render );
	trackBallControls.update(); 
}
