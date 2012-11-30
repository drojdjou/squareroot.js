SQR.QuadraticBezier = function(_p0, _c0, _c1, _p1) {

    if(!_p0 || !_c0 && !_c1 || !_p1) throw("Failed to create cruve: 4 2D or 2D vectors are required.");

    this.p0 = _p0;
    this.c0 = _c0;
    this.c1 = _c1;
    this.p1 = _p1;

    // This way it's the same type as the points (V2 or V3)
    var interpolatedValue = _p0.clone().set();

    var pfunc = SQR.Interpolation.bezierPosition;
    var vfunc = SQR.Interpolation.bezierVelocity;

    this.velocityAt = function(t, v) {
        v = v || interpolatedValue;
        v.x = vfunc(t, this.p0.x, this.c0.x, this.c1.x, this.p1.x);
        v.y = vfunc(t, this.p0.y, this.c0.y, this.c1.y, this.p1.y);

        if(v.z && this.p0.z) {
            v.z = vfunc(t, this.p0.z, this.c0.z, this.c1.z, this.p1.z);
        }

        return v;
    }

    this.valueAt = function(t, v) {
        v = v || interpolatedValue;
        v.x = pfunc(t, this.p0.x, this.c0.x, this.c1.x, this.p1.x);
        v.y = pfunc(t, this.p0.y, this.c0.y, this.c1.y, this.p1.y);

        if(v.z != null && this.p0.z != null) {
            v.z = pfunc(t, this.p0.z, this.c0.z, this.c1.z, this.p1.z);
        }
        
        return v;
    }

    this.createGeometry = function(numVertices) {
        var g = new SQR.Geometry();
        g.continous = true;

        g.vertices = [];
        g.tangents = [];

        for(var i = 0; i < numVertices; i++) {
            var t = i / numVertices;
            g.vertices.push(this.valueAt(t, new SQR.V3()));
            g.tangents.push(this.velocityAt(t, new SQR.V3()));
        }

        return g;
    }
}

