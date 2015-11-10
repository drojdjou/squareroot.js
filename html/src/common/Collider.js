/**
 * @class Collider 
 * @memberof SQR
 *
 * @description A collider can be attached to a transform and later used with the functions in the Intersection utility to detect collisions.
 */
SQR.Collider = function(t) {

	var that = this;

	this.center = new SQR.V3();
	this.type = t;

	this.radius;
	this.box;
	this.buffer;

	this.hit = false;

	this.calculateBoundingBox = function() {

		var mx = Number.MAX_VALUE;

		var b = {
			minX: mx, maxX: -mx,
			minY: mx, maxY: -mx,
			minZ: mx, maxZ: -mx
		};

		that.buffer.iterate('aPosition', function(i, d, c) {
			b.minX = Math.min(b.minX, d[i + 0]);
			b.maxX = Math.max(b.maxX, d[i + 0]);

			b.minY = Math.min(b.minY, d[i + 1]);
			b.maxY = Math.max(b.maxY, d[i + 1]);

			b.minZ = Math.min(b.minZ, d[i + 2]);
			b.maxZ = Math.max(b.maxZ, d[i + 2]);
		});

		return b;
	}
}

SQR.Collider.SPHERE = 1;
SQR.Collider.BOX = 2;
SQR.Collider.MESH = 3;

SQR.Collider.Sphere = function(radius, center) {
	var c = new SQR.Collider(SQR.Collider.SPHERE);
	c.radius = radius || 0;
	if(center) c.center.copyFrom(center);
	return c;
}

SQR.Collider.Box = function(box) {
	var c = new SQR.Collider(SQR.Collider.BOX);
	c.box = box;
	return c;
}

SQR.Collider.Mesh = function(buffer) {
	var c = new SQR.Collider(SQR.Collider.MESH);
	c.buffer = buffer;
	c.box = c.calculateBoundingBox();
	return c;
}