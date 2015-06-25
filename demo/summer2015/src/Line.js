/**

	{
		type: 'line',
		coords: [50, 0, 50, 100],
		color: '#ffffff',
		width: 20
	}

**/

var Line = function(config) {

	var line = {};
	var l = new SQR.Transform2d();

	line.ra = 0;
	line.rb = 1;

	line.a = new SQR.V2();
	line.b = new SQR.V2();

	line.alpha = config.alpha || 1;
	
	var resize = function() {
		Feature.toScreen(config.coords[0], config.coords[1], line.a);
		Feature.toScreen(config.coords[2], config.coords[3], line.b);
	};
	
	window.addEventListener('resize', resize);
	resize();

	line.mode = 0;

	var d = new SQR.V2();
	var ar = new SQR.V2();
	var br = new SQR.V2();

	line.calcPos = function() {
		l.alpha = line.alpha;
		d.sub(line.b, line.a);
		ar.copyFrom(d).mul(line.ra).add(ar, line.a);
		br.copyFrom(d).mul(line.rb).add(br, line.a);
	};

	line.clear = function(b) {
		line.ra = line.rb = b || 0;
	}

	line.calcPos();

	Feature.registerActions(config, line);

	var ea = EditableNode(line.a, line);
	var eb = EditableNode(line.b, line);

	l.shape = function(ctx) {
		if(!ea.debug && !eb.debug) {
			line.calcPos();
			ctx.lineWidth = config.width;
			ctx.strokeStyle = config.color;
			ctx.beginPath();
			ctx.moveTo(ar.x, ar.y);
			ctx.lineTo(br.x, br.y);
			ctx.stroke();
		} else {
			ctx.lineWidth = 1;
			ctx.strokeStyle = Feature.DEBUG_COLOR;
			ctx.beginPath();
			ctx.moveTo(line.a.x, line.a.y);
			ctx.lineTo(line.b.x, line.b.y);
			ctx.stroke();

			if(ea.hover) ctx.strokeRect(line.a.x - 5, line.a.y - 5, 10, 10);
			if(eb.hover) ctx.strokeRect(line.b.x - 5, line.b.y - 5, 10, 10);
		}
			
	};

	return l;
}







