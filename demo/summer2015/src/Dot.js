var Dot = function(config) {

	var t = new SQR.Transform2d();

	t.alpha = config.alpha;
	t.position.copyFrom(config.position);

	t.shape = function(ctx) {

		config.move(t.position, config);

		if(config.wrap) Feature.wrap(t.position, config.radius);

		ctx.fillStyle = config.color;
		ctx.beginPath();
		ctx.arc(0, 0, config.radius, 0, SQR.TWOPI);
		ctx.fill();
	}

	return t;

}