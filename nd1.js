
const canvas = document.getElementById ( "canvas" );
const ctx = canvas.getContext ( "2d" );

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

function drawGear ( radius, toothCount, toothHeight) {

	ctx.save ();

	let toothLength = Math.PI * radius / toothCount;

	//ctx.translate ( centerX, centerY );

	ctx.beginPath ();

	ctx.arc ( 0, 0, radius, 0, Math.PI * 2 );
	ctx.fillStyle = '#555';
	ctx.fill ();

	for ( let i = 0; i < toothCount; i++ ) {
		
		ctx.rotate ( 2 * Math.PI / toothCount );
		ctx.fillRect ( 0, -toothLength / 2, radius + toothHeight, toothLength );
	}

	ctx.restore ();
}

let angle = 0;

function draw () {

	ctx.save ();
	
	ctx.clearRect ( 0, 0, canvas.width, canvas.height );

	ctx.translate ( centerX, centerY );
	ctx.rotate ( angle );

	drawGear ( 100, 10, 15 );

	ctx.restore ();

	angle += ( Math.PI / 180) * 1;

}

setInterval ( draw, 10 );

