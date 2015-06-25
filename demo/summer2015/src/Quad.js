var Quad = function(config) {


	var t = new SQR.Transform2d();

	var d = {
		position: t.position,
		size: new SQR.V2(),
		rotation: config.rotation || 0
	};

	Feature.toScreen(config.coords[0], config.coords[1], d.position);
	Feature.toScreen(config.size[0], config.size[1], d.size);

	t.shape = function(ctx) {

		t.rotation = d.rotation;

		ctx.fillStyle = config.color;
		ctx.fillRect(d.size.x * -0.5, d.size.y * -0.5, d.size.x, d.size.y);
	};

	Feature.registerActions(config, d);

	return t;
}