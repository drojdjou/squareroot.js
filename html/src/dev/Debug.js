SQR.Debug = (function() {

	var d = {};

	var v3ToString = function(v) {
		return '[' + v.x.toPrecision(2) + ', ' + v.y.toPrecision(2) + ', ' + v.z.toPrecision(2) + ']'
	}

	var matToString = function(m) {
		var d = [];
		for(var i = 0; i < m.data.length; i++) d.push(m.data[i].toPrecision(2));
		return '[ ' + d.join(', ') + ' ]'
	}

	d.traceBuffer = function(b, dumpData) {
		var d = '';
		d += 'buffer ';
		d += 'stride: ' + b.strideSize + ' (' + b.strideByteSize + ' bytes) x ' + b.size + '\n';

		for(var a in b.attributes) d += a + '[' + b.attributes[a].size + '], ';

		console.log(d);

		var a = [], oa = b.getDataArray();
		for(var i = 0; i < b.strideSize; i++) a.push(oa[i].toPrecision(2));
		console.log('[' + a.join(', ') + '] ' + oa.length + '/' + (b.size * b.strideSize));

		if(dumpData) console.log(b.getDataArray());
	}

	d.traceVector3 = function(v) {
		console.log('v3', v3ToString(v));
	}

	d.traceMat = function(m) {
		console.log('mat', matToString(m));
	}

	d.traceTransform = function(t) {
		console.log('transform numChildren:' + t.numChildren); 
		console.log('p' + v3ToString(t.position) + 
			' r' + v3ToString(t.rotation) + 
			' s' + v3ToString(t.scale));

		console.log('g' + matToString(t.globalMatrix));
		console.log('v' + matToString(t.viewMatrix));

		if(t.buffer) d.traceBuffer(t.buffer);
	}

	return d;

})();