SQR.QuadraticBezier = function(_p0, _c0, _c1, _p1) {

    this.p0 = _p0;
    this.c0 = _c0;
    this.c1 = _c1;
    this.p1 = _p1;

    var interpolatedValue;

    var pfunc = SQR.Interpolation.bezierPosition;
    var vfunc = SQR.Interpolation.bezierVelocity;

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

