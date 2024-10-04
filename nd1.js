
const canvas = document.getElementById ( "canvas" );
const ctx = canvas.getContext ( "2d" );

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

function drawGear ( radius, toothCount, toothHeight ) {

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

function drawHand ( radius, toothCount, toothHeight, length , width, color ) {
	drawGear ( radius, toothCount, toothHeight );

	ctx.save ();
	ctx.fillStyle = color;
	ctx.fillRect ( -width/2, 0, width, -length ); 
	ctx.restore ();
}

let angle = 0;

function draw () {

	ctx.save ();
	
	ctx.clearRect ( 0, 0, canvas.width, canvas.height );

	ctx.translate ( centerX + 350, centerY );
	
	//ctx.scale ( 0.1, 0.1 );

	ctx.rotate ( angle );

	ctx.rotate ( ( Math.PI / 180 ) * 1.8 )

	drawGear ( 100, 100, 1.5 );
	//drawHand ( 50, 5, 15, 100, 10, "red" );

	ctx.restore ();

	ctx.save();
	ctx.translate ( centerX + 462, centerY );
	ctx.rotate (  angle * -10  );
	drawHand ( 10, 10, 1.5, 150, 10, "red" );
	ctx.restore ();

	ctx.save();
	ctx.translate ( centerX - 352, centerY );
	ctx.rotate ( angle / -6);
	drawHand ( 600, 600, 1.5, 1000, 20, "black" );
	ctx.restore ();

	angle += ( Math.PI / 180) * -0.36;


}

setInterval ( draw, 10 );

