var AnimationPreview = function(timeLabel, cnv, prop, duration, linear) {

	var animCanvasSize = new SQR.V2(600, 400);
	var timeScale = 5;

	var animationPathLinear = [];
	var animationPathBezier = [];

	cnv.width = animCanvasSize.x;
	cnv.height = animCanvasSize.y;

	var ctx = cnv.getContext('2d');
	ctx.strokeStyle = ctx.strokeStyle = 'rgba(0, 80, 255, 0.5)';
	ctx.beginPath();

	var max = -1000000000, min = 1000000000;

	var w = animCanvasSize.x;
	var h = animCanvasSize.y * 0.8;

	for(var i = 0; i < prop.keys.length; i += 4) {
		var v = prop.keys[i+1];
		max = Math.max(max, v);
		min = Math.min(min, v);
	}

	if(min == max) return false;

	for(var i = 0; i < prop.keys.length; i += 4) {
		animationPathLinear.push(new SQR.V2(prop.keys[i+0], prop.keys[i+1]));
	}

	for(var i = 0; i < prop.keys.length - 4; i += 4) {
		var k1t = prop.keys[i+0];
		var k1v = prop.keys[i+1];
		var k1o = prop.keys[i+3];

		var k2t = prop.keys[i+4];
		var k2v = prop.keys[i+5];
		var k2i = prop.keys[i+6];
		
		var start = new SQR.V2(k1t, k1v);
		var end = new SQR.V2(k2t, k2v);

		var d = (end.x - start.x) / 3.0;
		var st = new SQR.V2( d,  d * k1o).add(start);
		var et = new SQR.V2(-d, -d * k2i).add(end);

		animationPathBezier.push(new SQR.Bezier(start, st, et, end));
	}

	var linearIndex = 0;
	var bezierIndex = 0;

	var draw = function(t) {
		requestAnimationFrame(draw);
		var td = ((t/1000/timeScale) % duration);
		
		timeLabel.innerHTML = td.toPrecision(6).substring(0, 4);

		ctx.clearRect(0, 0, animCanvasSize.x, animCanvasSize.y);

		ctx.save();
		ctx.fillStyle = 'rgba(0, 255, 128, 0.6)';
		ctx.fillRect((td / duration) * w, 0, 1, animCanvasSize.y);
		ctx.restore();

		ctx.save();
		ctx.translate(0, animCanvasSize.y * 0.1);
		ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
		ctx.beginPath();

		for(var i = 0; i < animationPathLinear.length - 1; i++) {

			var a0 = animationPathLinear[i+0];
			var a1 = animationPathLinear[i+1];

			var k1t = a0.x / duration * w;
			var k1v = (a0.y - min) / (max - min) * h;

			var k2t = a1.x / duration * w;
			var k2v = (a1.y - min) / (max - min) * h;

			ctx.moveTo(k1t, k1v);
			ctx.lineTo(k2t, k2v);
		}
		ctx.stroke();
		ctx.restore();

		ctx.save();
		ctx.translate(0, animCanvasSize.y * 0.1);
		ctx.strokeStyle = 'rgba(80, 128, 255, 0.2)';
		ctx.beginPath();

		for(var i = 0; i < animationPathBezier.length; i++) {
			var c = animationPathBezier[i];

			ctx.moveTo(
				c.p0.x / duration * w, 
				(c.p0.y - min) / (max - min) * h
			);

			ctx.bezierCurveTo(
				c.c0.x / duration * w, 
				(c.c0.y - min) / (max - min) * h, 
				c.c1.x / duration * w, 
				(c.c1.y - min) / (max - min) * h, 
				c.p1.x / duration * w, 
				(c.p1.y - min) / (max - min) * h
			);
		}
		ctx.stroke();
		ctx.restore();

		var tmp = new SQR.V2();

		// Linear
		for(var i = linearIndex; i < animationPathLinear.length - 1; i++) {
			var b0 = animationPathLinear[i+0];
			var b1 = animationPathLinear[i+1];

			if(b0.x <= td && b1.x > td) {
				var t = (td - b0.x) / (b1.x - b0.x);
				var v = b0.y + (b1.y - b0.y) * t;

				ctx.save();
				ctx.fillStyle = '#f00';
				ctx.translate(td / duration * w, (v - min) / (max - min) * h + animCanvasSize.y * 0.1);
				ctx.beginPath();
				ctx.arc(0, 0, 2, 0, SQR.TWOPI);
				ctx.fill();
				ctx.restore();

				linearIndex = i;
				break;
			}

			if(linearIndex >= animationPathLinear.length - 2) linearIndex = 0;
		}

		// Bezier
		for(var i = bezierIndex; i < animationPathBezier.length; i++) {
			var b = animationPathBezier[i];

			if(b.p0.x <= td && b.p1.x > td) {
				var t = (td - b.p0.x) / (b.p1.x - b.p0.x);
				b.valueAt(t, tmp);

				ctx.save();
				ctx.fillStyle = '#00f';
				ctx.translate(tmp.x / duration * w, (tmp.y - min) / (max - min) * h + animCanvasSize.y * 0.1);
				ctx.beginPath();
				ctx.arc(0, 0, 2, 0, SQR.TWOPI);
				ctx.fill();
				ctx.restore();

				bezierIndex = i;
				break;
			}

			if(bezierIndex >= animationPathBezier.length - 2) bezierIndex = 0;
		}


	}

	draw();

	return true;
}














