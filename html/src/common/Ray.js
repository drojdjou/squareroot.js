/**
 * @class Ray
 * @memberof SQR
 * 
 * @description A Ray has an origin and a direction. It is for ray casting, mostly to calculate the ray from the mouse and detect 3d rollovers.
 *
 * @params {SQR.V3} origin - origin of the ray
 * @params {SQR.V3} direction - direction of the ray
 *
 */
SQR.Ray = function(o, d) {
	this.origin = o || new SQR.V3();
	this.direction = d || new SQR.V3();
	
	this.localOrigin = new SQR.V3();
	this.localDirection = new SQR.V3();

	if(!SQR.Ray._mt) {
		SQR.Ray._mt = new SQR.Matrix44();
		SQR.Ray._nt = new SQR.Matrix33();
	}
}

SQR.Ray.prototype.makeLocal = function(t) {

	var m = SQR.Ray._mt;
	var n = SQR.Ray._nt;

	m.copyFrom(t.globalMatrix).inverse();
	m.transformVector(this.origin, this.localOrigin);

	n.copyFrom(t.normalMatrix).transpose();
	n.transformVector(this.direction, this.localDirection);
}










