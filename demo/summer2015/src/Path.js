/**

	{
		type: 'line',
		coords: [50, 0, 50, 100],
		color: '#ffffff',
		width: 20
	}

**/

var Path = function(config, paths) {

	var line = {};
	var l = new SQR.Transform2d();
	

	line.ra = 0;
	line.rb = 1;

	
	line.b = new SQR.V2();
	line.ca = new SQR.V2();
	line.cb = new SQR.V2();

	line.alpha = config.alpha || 1;

	var curve, nodes;

	if(config.path) {
		nodes = paths[config.path].nodes;
		curve = paths[config.path].curve;
	} else {
		nodes = [];
		curve = new SQR.Spline();
		for(var i = 0; i < config.coords.length; i += 2) {
			var v = new SQR.V2();
			Feature.toScreen(config.coords[i], config.coords[i+1], v);

			var cb = (i == 0) ? function() { curve.create(0.5, config.closed); } : null;
			var en = EditableNode(v, null, cb);

			nodes.push(en);
			curve.addSegment(v);
		}
	}

	curve.create(0.5, config.closed);

	l.curve = curve;
	l.nodes = nodes;
	
	line.mode = 0;

	line.calcPos = function() {
		l.alpha = line.alpha;
	};

	line.clear = function(b) {
		line.ra = line.rb = b || 0;
	}

	line.calcPos();

	if(config.actions) {
		document.addEventListener('keydown', function(e) {
			for(var k in config.actions) {
				var f = config.actions[k];
				var c = k.toUpperCase().charCodeAt(0);				
				if(e.keyCode == c) f(line);
			}
		});
	}

	

	var resolution = 100, tmp = new SQR.V2(), tmpN = new SQR.V2();

	l.shape = function(ctx) {
		if(!config.isPath && !nodes[0].debug) {
			line.calcPos();
			ctx.lineWidth = config.width;
			ctx.strokeStyle = config.color;
			ctx.beginPath();

			var rd = line.rb - line.ra;

			for(var i = 0; i < resolution; i++) {
				curve.valueAt(line.ra + rd * (i / resolution), tmp);

				if(config.offset) {
					curve.velocityAt(line.ra + rd * (i / resolution), tmpN);
					tmpN.norm().mul(config.offset);
					tmp.x += tmpN.y;
					tmp.y -= tmpN.x;
				}

				if(i == 0) ctx.moveTo(tmp.x, tmp.y);
				else ctx.lineTo(tmp.x, tmp.y);
			}

			ctx.stroke();

		} else if(config.isPath && nodes[0].debug) {

			curve.create(0.5, config.closed);

			ctx.lineWidth = 1;
			ctx.strokeStyle = Feature.DEBUG_COLOR;
			ctx.fillStyle = Feature.DEBUG_COLOR;
			ctx.beginPath();

			for(var i = 0; i < nodes.length; i++) {
				var v = nodes[i].vector;
				if(i == 0) ctx.moveTo(v.x, v.y);
				else ctx.lineTo(v.x, v.y);
				if(nodes[i].hover) {
					ctx.fillRect(v.x - 10, v.y - 10, 20, 20);
				}
			}

			ctx.stroke();

			ctx.strokeStyle = Feature.DEBUG_COLOR_2;
			ctx.beginPath();

			for(var i = 0; i < resolution; i++) {
				curve.valueAt(i / resolution, tmp);

				if(i == 0) ctx.moveTo(tmp.x, tmp.y);
				else ctx.lineTo(tmp.x, tmp.y);
			}

			ctx.stroke();

			

			ctx.strokeStyle = Feature.DEBUG_COLOR_3;

			for(var i = 0; i < resolution; i++) {

				ctx.beginPath();
				curve.valueAt(i / resolution, tmp);
				curve.velocityAt(i / resolution, tmpN);

				tmpN.norm().mul(10);

				ctx.moveTo(tmp.x - tmpN.y, tmp.y + tmpN.x);
				ctx.lineTo(tmp.x + tmpN.y, tmp.y - tmpN.x);
				ctx.stroke();
			}

			

		}
			
	};

	return l;
}







