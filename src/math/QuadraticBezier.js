/**
 *  @class
 *
 *  Represents a quadratic bezier curve. All paramaters can be either {@link SQR.V3} or {@link SQR.V2}.
 *
 *  @param _p0 start position
 *  @param _c0 first control point
 *  @param _c1 last control point
 *  @param _c1 end position
 *
 */
SQR.QuadraticBezier = function(_p0, _c0, _c1, _p1) {

    /**
     *  Start position. Can be either {@link SQR.V3} or {@link SQR.V2}.
     */
    this.p0 = _p0;

    /**
     *  First control point. Can be either {@link SQR.V3} or {@link SQR.V2}.
     */
    this.c0 = _c0;

    /**
     *  Second control point. Can be either {@link SQR.V3} or {@link SQR.V2}.
     */
    this.c1 = _c1;

    /**
     *  End position. Can be either {@link SQR.V3} or {@link SQR.V2}.
     */
    this.p1 = _p1;

    var interpolatedValue;

    var pfunc = SQR.Interpolation.bezierPosition;
    var vfunc = SQR.Interpolation.bezierVelocity;

    /**
     *  Returns the velocity on a curve. 
     *  @param t interpolation value [0-1]
     *  @param v vector to write the value to. If omitted, returns a temporary value, that will be overwritten on next call so do not store this object.
     */
    this.velocityAt = function(t, v) {
        interpolatedValue = interpolatedValue || this.p0.clone().set();
        v = v || interpolatedValue;
        v.x = vfunc(t, this.p0.x, this.c0.x, this.c1.x, this.p1.x);
        v.y = vfunc(t, this.p0.y, this.c0.y, this.c1.y, this.p1.y);

        if(v.z && this.p0.z) {
            v.z = vfunc(t, this.p0.z, this.c0.z, this.c1.z, this.p1.z);
        }

        return v;
    }

    /**
     *  Returns the position on a curve.
     *  @param t interpolation value [0-1]
     *  @param v vector to write the value to. If omitted, returns a temporary value, that will be overwritten on next call so do not store this object.
     */
    this.valueAt = function(t, v) {
        interpolatedValue = interpolatedValue || this.p0.clone().set();
        v = v || interpolatedValue;
        v.x = pfunc(t, this.p0.x, this.c0.x, this.c1.x, this.p1.x);
        v.y = pfunc(t, this.p0.y, this.c0.y, this.c1.y, this.p1.y);

        if(v.z != null && this.p0.z != null) {
            v.z = pfunc(t, this.p0.z, this.c0.z, this.c1.z, this.p1.z);
        }
        
        return v;
    }
}

