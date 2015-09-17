var Parcel = function(coords, type, config) {

	var p = new SQR.Transform2d();

	p.shape = function(ctx) {
		ctx.fillStyle = config[type] || '#ffffff';
		ctx.beginPath();

		for(var i = 0; i < coords.length; i += 2) {
			var x = coords[i+0];
			var y = coords[i+1];
			if(i == 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}

		ctx.fill();
	}

	return {
		fill: p
	}
}