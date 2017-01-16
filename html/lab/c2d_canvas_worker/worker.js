onmessage = function(e) {

	var l = e.data.data.length;

	for(var i = 0; i < l; i += 4) {
		e.data.data[i+0] *= 1.0;
		e.data.data[i+1] *= 0.5;
		e.data.data[i+2] *= 0.0;
	}


	postMessage(e.data);
}