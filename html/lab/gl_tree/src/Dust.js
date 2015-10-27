var Dust = function(parent, assets, renderer, light, color, options) {

	options = options || {};

	var numDots = options.numDots || 3000;
	var index = 0, dotsPerFrame = options.dotsPerFrame || 10;

	

	var dotSize = 16;
	var dcv = document.createElement('canvas');
	dcv.ctx = dcv.getContext('2d');
	dcv.width = dotSize;
	dcv.height = dotSize;
	dcv.ctx.fillStyle = 'rgba(255, 255, 255, 0)';
	dcv.ctx.fillRect(0, 0, dotSize, dotSize);
	dcv.ctx.fillStyle = '#ffffff';
	dcv.ctx.beginPath();
	dcv.ctx.arc(dotSize/2, dotSize/2, dotSize/2, 0, SQR.TWOPI);
	dcv.ctx.fill();
	var dtex = SQR.Texture(dcv);		

	/// -----------------------------------------------

	var r = function(m) { 
		m = m || 1; 
		return Math.random() * m; 
	};

	var dots = new SQR.Transform();

	dots.buffer = SQR.Buffer()
		.layout({ aPosition: 3, aBirth: 1, aEnergy: 2, aSize: 1, aColor: 3 }, numDots)
		.iterate('aEnergy', function(i, data) {
			data[i+0] = (r() * 2 - 1) * 0.001;
			data[i+1] = r() * 0.002;
			data[i+2] = (r() * 2 - 1) * 0.004;
		})
		.iterate('aBirth', function(i, data) {
			data[i+0] = -1000000;
		})
		.iterate('aSize', function(i, data) {
			data[i+0] =  r();
		})
		.iterate('aColor', function(i, data) {
			data[i+0] =  color.r + Math.random() * 0.5 * color.r;
			data[i+1] =  color.g + Math.random() * 0.5 * color.g;
			data[i+2] =  color.b + Math.random() * 0.5 * color.b;
		})
		.setMode(SQR.gl.POINTS)
		.update();

	dots.setBlending(true);
	dots.depthMask = false;

	var bs = options.baseSize || 3;
	var es = options.extraSize || 6;

	bs = (bs / 1024 * window.innerWidth).toPrecision(3).toString();
	es = (es / 1024 * window.innerWidth).toPrecision(3).toString();

	if(bs.indexOf('.') == -1) bs += '.0';
	if(es.indexOf('.') == -1) es += '.0';

	console.log(bs, es);

	dots.shader = SQR.Shader(assets.dust, {
			directives: [
				{ name: 'BASE_SIZE', value: bs },
				{ name: 'EXTRA_SIZE', value: es }
			]
		})
		.use()
		.setUniform('uGravity', [0.0, -0.0002, 0.0])
		.setUniform('uTexture', dtex);


	dots.beforeDraw = function(t) {

		var lp = light.globalPosition;

		for(var i = 0; i < dotsPerFrame; i++) {

			dots.buffer.set('aPosition', index, 
				lp.x, lp.y, lp.z
			);

			dots.buffer.set('aBirth', index, renderer.currentTime || 0);
			index++;
			if(index > numDots) index = 0;
		}	

		dots.buffer.update();
	};

	parent.add(dots);

}