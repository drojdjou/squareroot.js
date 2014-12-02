/**
 *  @class
 *
 *  Represents a quaternion with optionally setting the values directly.
 *
 *  Just as a reminder, this is what the values represent:
 */
SQR.Quaternion = function(x, y, z, w) {
    this.set(w, x, y, z);
}

/**
 *  Set value of the Quaternion directly.
 */
SQR.Quaternion.prototype.set = function(x, y, z, w) {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
}

SQR.Quaternion.prototype.copyTo = function(p) {
    p.x = this.x;
    p.y = this.y;
    p.z = this.z;
    p.w = this.w;
    return this;
}

/**
 *  Copy the values from another quaternion.
 *  @param q the quaternion to copy values from
 */
SQR.Quaternion.prototype.copyFrom = function(q) {
    this.w = q.w;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    return this;
}

/**
 *  Resets the quaternion values to identity.
 */
SQR.Quaternion.prototype.identity = function() {
    this.set();
    return this;
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

    rq.set(x, y, z, w);

    rq.normalize();

    return rq;
}

/**
 *  Sets the quaternion to point in the given direction.
 *  @param _dir the direction to look at
 *  @param _up the up vector
 */
SQR.Quaternion.prototype.lookAt = function(_dir, _up) {

    var dir = SQR.Quaternion.__tv1;
    var right = SQR.Quaternion.__tv2;
    var up = SQR.Quaternion.__tv3;

    _dir.copyTo(dir);
    _up.copyTo(up);

    dir.norm();

    // If direction is back, the returned quaternion is flipped. Not sure why, but that fixes it.
    if(dir.z == -1) {
        dir.x = 0.0001;
        dir.norm();
    }

    // Probably should do the orthonormalization but not sure how that works :)
    // tangent.sub(up, forward.mul(SQR.V3.dot(forward, up))).norm();
    right.cross(up, dir);
    up.cross(dir, right);

    this.w = Math.sqrt(1 + right.x + up.y + dir.z) * 0.5;
    var rc = 4 * this.w;
    this.x = (dir.y - up.z) / rc;
    this.y = (right.z - dir.x) / rc;
    this.z = (up.x - right.y) / rc;

    this.normalize();

    return this;
}

/**
 *  Creates a quaternion out of an angle axis representation.
 *  @param a angle in radians
 *  @param x x component of the axis
 *  @param y y component of the axis
 *  @param z z component of the axis
 */
SQR.Quaternion.prototype.fromAngleAxis = function(a, x, y, z) {
    var s = Math.sin(a / 2);
    this.x = x * s;
    this.y = y * s;
    this.z = z * s;
    this.w = Math.cos(a / 2);
}

/**
 *  Returns the magniture of the quaternion.
 */
SQR.Quaternion.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
}

/**
 *  Normalizes the quaternion.
 */
SQR.Quaternion.prototype.normalize = function() {
    var n = this.mag();
    this.x /= n;
    this.y /= n;
    this.z /= n;
    this.w /= n;
}

/**
 *  That method doesn't do anything for now. Check {SQR.Matrix44.TQS()} to see how to turn a Quanternion into a matrix representation.
 *
 *  @todo Implement (or not... not sure how much this is needed)
 */
SQR.Quaternion.prototype.toMatrix = function(m) {
    throw "SQR.Quaternion.toMatrix() is not implemented. Check SQR.Matrix44.TQS()"; 
}

/**
 *  Returns a spherical linear interpolation between two quaternions.
 *  @param qa first quaternion
 *  @param qb second quaternion
 *  @param t interpolation value [0-1]
 *  @param qr the quaterion to store the results in and return. If omitted results are returned in a new quaternion object.
 */
SQR.Quaternion.slerp = function(qb, qa, t, qr) {
    qr = qr || new SQR.Quaternion();

    var cha = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;
    var ha = Math.acos(cha);
    var sha = Math.sqrt(1 - cha * cha);
    var ra = Math.sin((1 - t) * ha) / sha;
    var rb = Math.sin(t * ha) / sha;

    if (Math.abs(cha) >= 1) {
        // If angle is 0 (i.e cos(a) = 1) just
        // return the first quaternion
        ra = 1;
        rb = 0;
    } else if (Math.abs(sha) < 0.001) {
        // If angle is 180 deg (i.e. sin(a) = 0) there is
        // an infinite amount of possible rotations between those 2
        ra = 0.5;
        rb = 0.5;
    }

    qr.w = (qa.w * ra + qb.w * rb);
    qr.x = (qa.x * ra + qb.x * rb);
    qr.y = (qa.y * ra + qb.y * rb);
    qr.z = (qa.z * ra + qb.z * rb);
    return qr;
}

SQR.Quaternion.prototype.slerp = function(qa, qb, t) {
    SQR.Quaternion.slerp(qa, qb, t, this);
}

SQR.Quaternion.__tv1 = new SQR.Quaternion();
SQR.Quaternion.__tv2 = new SQR.Quaternion();
SQR.Quaternion.__tv3 = new SQR.Quaternion();














