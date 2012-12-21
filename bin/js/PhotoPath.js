/**
 * PhotoPath is used in demo 015_photoAlbum.
 *
 * A PhotoPath is a spline composed of 2 bezier curves. The both meet a one constant point (0,0,0)
 *
 * The constructor defines the Z and Y offsets at the beginning and at the end and a slope
 */
PhotoPath = function(slopeFactor, cy, yo0, zo0, yo1, zo1, color) {

    var center = new SQR.V3(0, cy, 0);

    var b0p0 = new SQR.V3(-PhotoPath.EDGE, yo0, zo0);
    var b0c0 = new SQR.V3(-PhotoPath.EDGE * slopeFactor, yo0, zo0);
    var b0c1 = new SQR.V3(-PhotoPath.EDGE * slopeFactor, cy, 0);
    var b0p1 = center;

    var b1p0 = center;
    var b1c0 = new SQR.V3(PhotoPath.EDGE * slopeFactor, cy, 0);
    var b1c1 = new SQR.V3(PhotoPath.EDGE * slopeFactor, yo1, zo1);
    var b1p1 = new SQR.V3(PhotoPath.EDGE, yo1, zo1);

    var b0 = new SQR.QuadraticBezier(b0p0, b0c0, b0c1, b0p1);
    var b1 = new SQR.QuadraticBezier(b1p0, b1c0, b1c1, b1p1);

    this.createTransform = function() {
        var t = new SQR.Transform();
        t.geometry = new SQR.Geometry();

        b0.createSegment(30, t.geometry);
        b1.createSegment(30, t.geometry);

        t.geometry.color = color;
        t.renderer = new SQR.Segment(1);
        return t;
    }

    var getCurveParam = function(t, func) {
        t = t * 2;

        var ts = Math.floor(t);
        var ti = t % 1;

        if (ts == 2) {
            ts = 1;
            ti = 1;
        }

        return (ts == 0) ? b0[func](ti) : b1[func](ti);
    }

    this.valueAt = function(t) {
        return getCurveParam(t, 'valueAt');
    }

    this.velocityAt = function(t) {
        return getCurveParam(t, 'velocityAt');
    }

    var n1 = new SQR.V3();
    var n2 = new SQR.V3();
    var up = new SQR.V3();
    var n = new SQR.V3();

    this.normalAt = function(t) {
        n1.copyFrom(getCurveParam(t, 'velocityAt'));
        n2.copyFrom(getCurveParam(t + 0.01, 'velocityAt'));

        up.cross(n1, n2);
        n.cross(n1, up).norm();

        n.norm();

        return n;
    }
}

PhotoPath.EDGE = 0;