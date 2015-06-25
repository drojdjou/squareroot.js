var EditableNode = function(v2, parent, changeCallback) {

	var mouse = new SQR.V2();
	var dist = new SQR.V2();
	var last = new SQR.V2();

	var limit = 50 * 50;

	var en = {
		hover: false,
		drag: false,
		debug: false,
		vector: v2
	};

	document.addEventListener('mousemove', function(e) {
		last.copyFrom(mouse);
		mouse.set(e.pageX, e.pageY);
		dist.sub(mouse, v2);
		en.hover = dist.magsq() < limit;

		if(en.drag && en.debug) {
			v2.x += mouse.x - last.x;
			v2.y += mouse.y - last.y;
		}
	});

	document.addEventListener('keydown', function(e) {
		if(e.keyCode == 'D'.charCodeAt(0)) {
			en.debug = !en.debug;
		}
	});

	document.addEventListener('mousedown', function(e) {
		if(en.hover) en.drag = true;
	});

	document.addEventListener('mouseup', function(e) {
		en.drag = false;
		if(changeCallback) changeCallback();
	});

	return en;
}