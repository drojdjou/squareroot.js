var Freeway = function() {

	var CAR_PARAM = "aCarParam";

    var vectors = [], carparams = [];

    var geo = new SQR.Geometry().quickSetup('v3');
    geo.attr(CAR_PARAM, 3);

	var carSize = 0.6;

    geo.create = function(num, radius, intensity) {

    	for(var i = 0; i < num; i++) {
    		if(Math.random() > intensity) continue;

    		var a = i / num * SQR.twoPI;


    		var sin = Math.sin(a) * radius;
    		var cos = Math.cos(a) * radius;

    		vectors.push(-carSize, cos, sin);
    		vectors.push(+carSize, cos, sin);

    		var cp = new SQR.V3();
    		cp.x = Math.random();
    		cp.y = Math.random();
    		cp.z = Math.random();
    		carparams.push(cp.x, cp.y, cp.z, cp.x, cp.y, cp.z);
    	}

    	return geo.refresh();
    }

    geo.refresh = function(wavedata, damp) {
    	geo.data(SQR.Geometry.VERTEX, vectors);
    	geo.data(CAR_PARAM, carparams);
        geo.dirty = true;
        return geo;   
    }

    return geo;

}