SQR.Shapes2d = {

	circle: function(radius, color) {
		return function(ctx) {
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.arc(0, 0, radius, 0, Math.PI * 2);
			ctx.fill();
		}
	},

	triangleEq: function(radius, color) {
		return function(ctx) {
			ctx.fillStyle = color;
			ctx.beginPath();
			var r = radius;
			ctx.moveTo(Math.cos(30/180*Math.PI) * r, Math.sin(30/180*Math.PI) * r);
			ctx.lineTo(Math.cos(150/180*Math.PI) * r, Math.sin(150/180*Math.PI) * r);
			ctx.lineTo(Math.cos(Math.PI/-2) * r, Math.sin(Math.PI/-2) * r);
			ctx.fill();
		}
	},

	quad: function(width, height, color) {
		return function(ctx) {
			ctx.fillStyle = color;
			ctx.fillRect(width*-0.5, height*-0.5, width, height);
		}
	}

}