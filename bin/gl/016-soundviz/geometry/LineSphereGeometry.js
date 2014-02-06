var LineSphereGeometry = function() {

    var lines = [], vertices = [];

    var geo = new SQR.Geometry().quickSetup('v3n3t2');
    var options = options || {};

	var that = this;
	var num, inner, mul;
	var vs = [];

    geo.create = function(_num, _inner, _mul) {
    	num = _num;
    	inner = _inner;
    	mul = _mul;

    	for(var i = 0; i < num; i++) {
    		var innerVec = new SQR.V3().random().norm().mul(inner);
    		var outerVec = innerVec.clone().norm().mul(mul).appendVec(innerVec);
            innerVec.bump = 0;
            innerVec.anitDump = 1 - Math.pow(Math.random(), 2);
            innerVec.phase = Math.PI * Math.random();
    		lines.push([innerVec, outerVec]);
    	}

    	return geo;
    }

    geo.refresh = function(wavedata, damp) {

    	vs.length = 0;

        var wl = wavedata.length;

        for(var i = 0; i < num; i++) {
            var j = (i % wl);
            var innerVec = lines[i][0];
            innerVec.bump = Math.max(innerVec.bump, wavedata[j]);
            innerVec.bump *= 0.95;
            innerVec.phase += 0.2;
            var bp = (1 + Math.sin(innerVec.phase)) * 20;
            var xtl = 1 + (mul + bp * innerVec.bump) * damp;
            var outerVec = innerVec.clone().norm().mul(xtl).appendVec(innerVec);
            lines[i][1] = outerVec;
        }

    	for(var i = 0; i < num; i++) {
    		var l = lines[i];
    		vs.push(l[0].x, l[0].y, l[0].z, l[1].x, l[1].y, l[1].z);
    	}

    	geo.data(SQR.Geometry.VERTEX, vs);

        mul += innerVec.bump / 200.0;

    	// console.log(that.vertices);
    	// console.log(that.vertices.length, that.numVertices);

        that.dirty = true;
        return geo;   
    }

    return geo;
}