SQR.QuadraticBezier = function(_p0, _c0, _c1, _p1) {

    this.p0 = _p0 || new SQR.V2();
    this.c0 = _c0 || new SQR.V2();
    this.c1 = _c1 || new SQR.V2();
    this.p1 = _p1 || new SQR.V2();

    var interpolatedValue = new SQR.V2();

    var interpolate = function(t, p0, c0, c1, p1) {
        return p0 * (1 - t) * (1 - t) * (1 - t) +
            c0 * 3 * t * (1 - t) * (1 - t) +
            c1 * 3 * t * t * (1 - t) +
            p1 * t * t * t;
    }

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

    this.valueAt = function(t, v) {
        v = v || interpolatedValue;
        v.x = interpolate(t, this.p0.x, this.c0.x, this.c1.x, this.p1.x);
        v.y = interpolate(t, this.p0.y, this.c0.y, this.c1.y, this.p1.y);
        return v;
    }
}