SQR.Pointer3d = function(options) {

	options = options || {};

	var mx = -2, my = 0;
	var ray = new SQR.Ray();
	var hitObjects = [];

	document.addEventListener('mousemove', function(e) {
		mx = e.pageX / window.innerWidth * 2 - 1;
		my = e.pageY / window.innerHeight * 2 - 1;
	});

	var sortHitObjects = function(a, b) {
		if(a.collider.__hit < b.collider.__hit) { return -1; }
		if(a.collider.__hit > b.collider.__hit) { return  1; }
		return 0;
	}

	return {

		all: options.all || false,

		ray: ray,

		onTransform: function(t) {

			if(!t.collider || mx == -2) return;

			var h = SQR.Intersection.rayTest(ray, t);

			if(options.all) {
				t.collider.hit = h;
			} else {
				t.collider.hit = false;
				t.collider.__hit = h;
			}

			if(h) hitObjects.push(t);
		},

		onAfterRender: function() {
			if(mx == -2) return;

			if(!options.all && hitObjects.length > 0) {
				hitObjects.sort(sortHitObjects);
				hitObjects[0].collider.hit = hitObjects[0].collider.__hit;
			}
		},

		fromMousePosition: function(camera, projection) {
			var m = SQR.Ray._mt;
			ray.origin.set(mx, my * -1, 0);
			m.copyFrom(projection).inverse();
			m.transformVector(ray.origin);
			camera.globalMatrix.transformVector(ray.origin);
			ray.direction.sub(ray.origin, camera.globalPosition).norm();
			hitObjects.length = 0;
		}
	}
};


