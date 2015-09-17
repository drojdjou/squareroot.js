var Building = function(coords, type, config) {

	var p = new SQR.Transform2d();

	p.shape = function(ctx) {

		ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
		ctx.beginPath();

		for(var i = 0; i < coords.length; i += 2) {
			var x = coords[i+0] + 1;
			var y = coords[i+1] + 1;
			if(i == 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}

		ctx.fill();

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