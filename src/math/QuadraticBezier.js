SQR.QuadraticBezier = function(_p0, _c0, _c1, _p1) {

    this.p0 = _p0 || new SQR.V2();
    this.c0 = _c0 || new SQR.V2();
    this.c1 = _c1 || new SQR.V2();
    this.p1 = _p1 || new SQR.V2();

    var interpolatedValue = new SQR.V2();

    this.set = function(p0x, p0y, c0x, c0y, c1x, c1y, p1x, p1y) {
        this.p0.x = p0x;
        this.p0.y = p0y;

        this.c0.x = c0x;
        this.c0.y = c0y;

        this.c1.x = c1x;
        this.c1.y = c1y;

        this.p1.x = p1x;
        this.p1.y = p1y;

        return this;
    }

    this.velocityAt = function(t, v) {
        v = v || interpolatedValue;
        v.x = SQR.Interpolation.bezierVelocity(t, this.p0.x, this.c0.x, this.c1.x, this.p1.x);
        v.y = SQR.Interpolation.bezierVelocity(t, this.p0.y, this.c0.y, this.c1.y, this.p1.y);
        return v;
    }

    this.valueAt = function(t, v) {
        v = v || interpolatedValue;
        v.x = SQR.Interpolation.bezierPosition(t, this.p0.x, this.c0.x, this.c1.x, this.p1.x);
        v.y = SQR.Interpolation.bezierPosition(t, this.p0.y, this.c0.y, this.c1.y, this.p1.y);
        return v;
    }
}

