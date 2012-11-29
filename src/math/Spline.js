/**
 * How many segments a spline has?
 *
 * Four points define the first curve, where the last point is considered the endpoint
 *
 * Each additional 2 points define the next curve (the endpoint between 1st and next curve is the midpoint between the two last point of the 1st
 *
 * Cases:
 *
 * 1,2,3,4
 * 1,2,3,c34 + c34,4,5,6
 * 1,2,3,c34 + c34,4,5,c56 + c56,6,7,8
 *
 * So valid number of points are: 4, 6, 8, 10, etc...
 *
 */
SQR.Spline = function(s1, s2, s3, s4) {

    this.rawPoints = [];
    this.controlPoints = [];
    
    var numSegments = 1;
    var numRawPoints = 4;

    this.rawPoints.push(s1, s2, s3, s4);
    this.controlPoints.push(s1, s2, s3, s4);

    var interpolatedValue = new SQR.V2();

    var findMidpoint = function(a, b) {
        return new SQR.V2().sub(b, a).mul(0.5).addTo(a);
    }

    var interpolate = function(t, p0, c0, c1, p1) {
        return p0 * (1 - t) * (1 - t) * (1 - t) +
            c0 * 3 * t * (1 - t) * (1 - t) +
            c1 * 3 * t * t * (1 - t) +
            p1 * t * t * t;
    }

    this.valueAt = function(t, v) {
        var s, st;
        var cs = this.controlPoints;

        s = Math.floor(t * numSegments)
        st = (t * numSegments) - s;

        if(s == cs.length / 4) {
            s = Math.max(0, s - 1);
            st = 1;
        }

        s *= 4;

        v = v || interpolatedValue;
        v.x = interpolate(st, cs[s+0].x, cs[s+1].x, cs[s+2].x, cs[s+3].x);
        v.y = interpolate(st, cs[s+0].y, cs[s+1].y, cs[s+2].y, cs[s+3].y);
        return v;
    }

    this.add = function(p1, p2) {
        this.rawPoints.push(p1, p2);
        numRawPoints = this.rawPoints.length;
        this.calculateControlPoints();
    }

    this.calculateControlPoints = function() {

        if (numRawPoints < 4 || numRawPoints % 2 == 1) {
            throw "Spline is corrupt - illegal number of points (should be an even number and >= 4)";
        }

        this.controlPoints = [];
        numSegments = 1;

        for (var i = 0; i < numRawPoints; i++) {

            var r = this.rawPoints[i];

            if (i < 3) {
                this.controlPoints.push(r);
                continue;
            }

            if (i >= 3 && i % 2 == 0) {
                this.controlPoints.push(r);
                continue;
            }

            if (i >= 3 && i % 2 == 1 && i == numRawPoints - 1) {
                this.controlPoints.push(r);
                continue;
            }

            if (i >= 3 && i % 2 == 1 && i < numRawPoints - 1) {
                var l = this.rawPoints[i - 1];
                var m = findMidpoint(r, l);
                this.controlPoints.push(m, m, r);
                numSegments++;
                continue;
            }
        }

//        console.log("numSegments", numSegments, "cpl: " + this.controlPoints.length);
    }
}