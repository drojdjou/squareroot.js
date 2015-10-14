NightSky = function(parent, assets, camera) {

	var NUM_STARS = Simplrz.touch ? 500 : 1000;
	var dotSize = 16;
	var skyDist = 1500;
	var horizonLevel = 0.1;

	var dcv = document.createElement('canvas');
	dcv.ctx = dcv.getContext('2d');
	dcv.width = dotSize;
	dcv.height = dotSize;
	dcv.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
	dcv.ctx.fillRect(0, 0, dotSize, dotSize);

	dcv.ctx.globalAlpha = 0.33;
	dcv.ctx.fillStyle = 'rgba(255, 255, 255, 255)';
	var r = dotSize/2;

	dcv.ctx.beginPath();
	dcv.ctx.arc(r, r, r, 0, SQR.TWOPI);
	dcv.ctx.fill();

	dcv.ctx.beginPath();
	dcv.ctx.arc(r, r, r-2, 0, SQR.TWOPI); 
	dcv.ctx.fill();

	dcv.ctx.beginPath();
	dcv.ctx.arc(r, r, r-4, 0, SQR.TWOPI); 
	dcv.ctx.fill();

	
	var dtex = SQR.Texture(dcv);

	var stars = new SQR.Transform();

	stars.shader = SQR.Shader(assets.stars)
		.use()
		.setUniform('uTexture', dtex);

	stars.buffer = SQR.Buffer()
		.layout({ aPosition: 3, aSize: 1, aBrightness: 1 }, NUM_STARS)
		.iterate('aPosition', function(i, data) {

			var d = new SQR.V3().random().norm();
			d.y = Math.abs(d.y) + horizonLevel;
			d.mul(skyDist);

			data[i+0] = d.x;
			data[i+1] = d.y;
			data[i+2] = d.z;
		})
		.iterate('aSize', function(i, data) {
			data[i+0] = 1 + Math.random() * 2;
		})
		.iterate('aBrightness', function(i, data) {
			data[i+0] = 0.2 + Math.random() * 0.8;
		})
		.setMode(SQR.gl.POINTS)
		.update();

	stars.setBlending(true);

	stars.beforeDraw = function() {
		stars.position.copyFrom(camera.position);
	}

	parent.add(stars);
}