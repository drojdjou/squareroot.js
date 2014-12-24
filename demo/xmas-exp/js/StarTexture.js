StarTexture = function(canvas) {

	canvas = canvas || document.createElement('canvas');
	canvas.width = 512;
	canvas.height = 512;

	var ctx = canvas.getContext('2d');

	SQR.TextureGenerator.noise(512, 512, canvas, 80, 255);

	var ws = 128, hs = 64, ro = 30, ri = 10;

	ctx.globalCompositeOperation = 'destination-atop';
	// ctx.fillStyle = '#000000';
	// ctx.fillRect(0, 0, 512, 512);
	ctx.fillStyle = '#ffffff';
	ctx.beginPath();

	for(var x = 0; x < 4; x++) {
		for(var y = 0; y < 8; y++) {

			ctx.save();
			ctx.translate(x * ws, y * hs);
			ctx.translate(ws / 4, hs / 2);
			if(y % 2 == 0) ctx.translate(ws / 4 * 2, 0);
			

			for(var i = 0; i < 10; i++) {
				var r = (i % 2 == 0) ? ro : ri;
				var a = i/10 * Math.PI * 2;
				var px = Math.cos(a) * r;
				var py = Math.sin(a) * r;

				if(i == 0) 
					ctx.moveTo(px, py);
				else
					ctx.lineTo(px, py);
			}

			
			ctx.restore();

		}
	} 
		
	ctx.fill();

	return canvas;
}