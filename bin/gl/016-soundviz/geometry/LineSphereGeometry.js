var LineSphereGeometry = function() {

	var that = this;
	var num, inner, mul;
	var lines = [], vs = [];

	this.vertexSize = 3;

    this.create = function(_num, _inner, _mul) {
    	num = _num;
    	inner = _inner;
    	mul = _mul;

    	// console.log(num, inner, mul);

    	for(var i = 0; i < num; i++) {
    		var innerVec = new SQR.V3().random().norm().mul(inner);
    		var outerVec = innerVec.clone().norm().mul(mul).appendVec(innerVec);
            innerVec.bump = 0;
            innerVec.phase = Math.PI * Math.random();
    		lines.push([innerVec, outerVec]);
    	}


    	that.numVertices = num * 2;
    	return that;
    }

    this.refresh = function(wavedata) {

    	vs.length = 0;

        var wl = wavedata.length;

        for(var i = 0; i < num; i++) {
            var j = (i % wl);
            var innerVec = lines[i][0];
            innerVec.bump = Math.max(innerVec.bump, wavedata[j]);
            innerVec.bump *= 0.95;
            innerVec.phase += 0.2;
            var xtl = mul + (1 + Math.sin(innerVec.phase)) * innerVec.bump * 30.0;
            var outerVec = innerVec.clone().norm().mul(xtl).appendVec(innerVec);
            lines[i][1] = outerVec;
        }

    	for(var i = 0; i < num; i++) {
    		var l = lines[i];
    		vs.push(l[0].x, l[0].y, l[0].z, l[1].x, l[1].y, l[1].z);
    	}

    	that.vertices = new Float32Array(vs);

        mul += innerVec.bump / 200.0;

    	// console.log(that.vertices);
    	// console.log(that.vertices.length, that.numVertices);

        that.dirty = true;
        return that;   
    }
}