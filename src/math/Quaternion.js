SQR.Quaternion = function(w, x, y, z) {
    this.set(w, x, y, z);
}

SQR.Quaternion.prototype.set = function(w, x, y, z) {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

SQR.Quaternion.prototype.copyFrom = function(q) {
    this.w = q.w;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
}

SQR.Quaternion.prototype.identity = function() {
    this.set();
}

/**
 * Multiplies rq (or this if no rq) by q
 * @param q
 * @param rq if not defined this is multiplied by q
 */
SQR.Quaternion.prototype.mul = function(q, rq) {
    rq = rq || this;

    var w = (rq.w * q.w - rq.x * q.x - rq.y * q.y - rq.z * q.z);
    var x = (rq.w * q.x + rq.x * q.w + rq.y * q.z - rq.z * q.y);
    var y = (rq.w * q.y - rq.x * q.z + rq.y * q.w + rq.z * q.x);
    var z = (rq.w * q.z + rq.x * q.y - rq.y * q.x + rq.z * q.w);

    rq.set(w, x, y, z);

    rq.normalize();

    return rq;
}

SQR.Quaternion.prototype.fromAngleAxis = function(a, x, y, z) {
    var s = Math.sin(a / 2);
    this.x = x * s;
    this.y = y * s;
    this.z = z * s;
    this.w = Math.cos(a / 2);
}

SQR.Quaternion.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
}

SQR.Quaternion.prototype.normalize = function() {
    var n = this.mag();
    this.x /= n;
    this.y /= n;
    this.z /= n;
    this.w /= n;
}

SQR.Quaternion.prototype.toMatrix = function(m) {
    // Check Matrix44.TQS()
}

SQR.Quaternion.slerp = function(qa, qb, t, qr) {
    qr = qr || new SQR.Quaternion();

    var cha = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;

    if(Math.abs(cha) >= 1) {
        qr.copyFrom(qa);
        return qr;
    }

    var ha = Math.acos(cha);
    var sha = Math.sqrt(1 - cha * cha);

    var ra = Math.sin((1 - t) * ha) / sha;
    var rb = Math.sin(t * ha) / sha;

    // If angle is 180 (i.e. sin(a) == 0) degrees there is an infinite amount of possible rotations
    if (Math.abs(sha) < 0.001){
		qr.w = (qa.w * 0.5 + qb.w * 0.5);
		qr.x = (qa.x * 0.5 + qb.x * 0.5);
		qr.y = (qa.y * 0.5 + qb.y * 0.5);
		qr.z = (qa.z * 0.5 + qb.z * 0.5);
		return qr;
	}

    qr.w = (qa.w * ra + qb.w * rb);
	qr.x = (qa.x * ra + qb.x * rb);
	qr.y = (qa.y * ra + qb.y * rb);
	qr.z = (qa.z * ra + qb.z * rb);
	return qr;
}

SQR.Quaternion.__tv1 = new SQR.V3();
SQR.Quaternion.__tv2 = new SQR.V3();
SQR.Quaternion.__tv3 = new SQR.V3();

















