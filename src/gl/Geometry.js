/**
 * @class
 */
SQR.Geometry = function() {

	var attributes = {}, attributeList = [];
	var that = this;

	this.count = 0;
	this.dirty = false;

	this.attr = function() {
		var al = arguments.length;
		for(var i = 0; i < al; i += 2) {
			var a = arguments[i];
			var s = arguments[i+1];
			attributes[a] = { size: s, array: [], name:a };
			attributeList.push(attributes[a]);
		}
		return that;
	}

	/**
	 *	Arguments: pairs of attr name (string) and values (array) 
	 */
	this.data = function() {

		var al = arguments.length;
		var _count;

		for(var i = 0; i < al; i += 2) {
			var n = arguments[i];
			var d = arguments[i+1];
			var a = attributes[n];

			if(!a) {
				console.warn("Trying to add attribute that was not setup for this geometry: " + n);
				continue;
			}

			_count = d.length / a.size;
			// Uncomment this to check geometry integrity (every attribute should have same _count)
			// console.log(n, _count);
			
			if(!a.data || that.count == 0 || _count != that.count || d.length != a.data.length) {
				a.data = new Float32Array(d);
			} else {
				a.data.set(d);
			}
		}

		that.count = _count;
		that.dirty = true;

		return that;
	}

	// Argument: string with any combination of letters v,n,c,t,u (u = textcoord2). 
	// Each letter must be followed by a number specyfying the size. Ex: v3n3t2c4
	this.quickSetup = function(s) {
		var d = s.split('');
		for(var i = 0; i < d.length; i += 2) {
			var a = d[i];
			var s = parseInt(d[i+1]);
			if(isNaN(s)) throw "Forgot to add sizes when creating geometry -> " + s;
			switch(a) {
				case "v": that.attr(SQR.Geometry.VERTEX, s); break;
				case "n": that.attr(SQR.Geometry.NORMAL, s); break;
				case "c": that.attr(SQR.Geometry.COLOR, s); break;
				case "t": that.attr(SQR.Geometry.TEXCOORD, s); break;
				case "u": that.attr(SQR.Geometry.TEXCOORD2, s); break;
			} 
		}
		return that;
	} 

	this.setupBuffers = function(gl, shader, usage) {
	    var attr, val;
	    
		for(var i = 0; i < shader.numAttributes; i++) {

			var shaderAttr = shader.attributes[i];
			var geoAttr = attributes[shaderAttr.name];

			if(!geoAttr) throw "Attribute required by shader not found on geometry: " + shaderAttr.name;

			if(!geoAttr.buffer) geoAttr.buffer = gl.createBuffer();

			gl.bindBuffer(gl.ARRAY_BUFFER, geoAttr.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, geoAttr.data, usage);

			gl.enableVertexAttribArray(shaderAttr.location);
			// TODO: this doesn't support int attributes, only floats
	        gl.vertexAttribPointer(shaderAttr.location, geoAttr.size, gl.FLOAT, false, 0, 0);
		}
	}
}

SQR.Geometry.VERTEX = "aVertexPosition";
SQR.Geometry.NORMAL = "aVertexNormal";
SQR.Geometry.TEXCOORD = "aTextureCoord";
SQR.Geometry.TEXCOORD2 = "aTextureCoord2";
SQR.Geometry.COLOR = "aVertexColor";









