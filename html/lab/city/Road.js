var Road = function(start, end, type, config, c1, c2) {

	var outline = new SQR.Transform2d();
	var surface = new SQR.Transform2d();

	var getWidth = function(type, isOutline) {
		switch(type) {
			case 'main':
				return isOutline ? 10 : 9;
			case 'freeway':
				return isOutline ? 20 : 18;
			case 'tiny':
				return isOutline ? 3 : 2;
			case 'rail':
				return 1;
			default:
				return isOutline ? 6 : 5;
		}
	}

	var getColor = function(type, isOutline) {
		switch(type) {
			case 'main':
				return isOutline ? config.roadOutline : config.mainRoad
			case 'freeway':
				return isOutline ? config.freewayOutline : config.freeway
			case 'rail':
				return config.rail;
			default:
				return isOutline ? config.roadOutline : config.road;
		}
	}

	outline.shape = function(ctx) {

		var w = getWidth(type, true);

		if(type == 'freeway') return;

		ctx.lineWidth = w;
		ctx.strokeStyle = getColor(type, true);
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);

		if(!c1) ctx.lineTo(end.x, end.y);
		else ctx.bezierCurveTo(
			c1.x, c1.y, 
			c2.x, c2.y, 
			end.x, end.y);

		ctx.stroke();
	}

	surface.shape = function(ctx) {

		var w = getWidth(type, type == 'freeway');

		ctx.lineWidth = w;
		ctx.strokeStyle = getColor(type, type == 'freeway');
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);

		if(!c1) ctx.lineTo(end.x, end.y);
		else ctx.bezierCurveTo(
			c1.x, c1.y, 
			c2.x, c2.y, 
			end.x, end.y);

		ctx.stroke();

		if(type == 'freeway') {
			var w = getWidth(type, false);

			ctx.lineWidth = w;
			ctx.strokeStyle = getColor(type, false);
			ctx.beginPath();
			ctx.moveTo(start.x, start.y);

			if(!c1) ctx.lineTo(end.x, end.y);
			else ctx.bezierCurveTo(
				c1.x, c1.y, 
				c2.x, c2.y, 
				end.x, end.y);

			ctx.stroke();

			var w = 1;

			ctx.lineWidth = w;
			ctx.strokeStyle = getColor(type, true);
			ctx.beginPath();
			ctx.moveTo(start.x, start.y);

			if(!c1) ctx.lineTo(end.x, end.y);
			else ctx.bezierCurveTo(
				c1.x, c1.y, 
				c2.x, c2.y, 
				end.x, end.y);

			ctx.stroke();
		}
	}

	return {
		outline: outline,
		surface: surface
	}

}