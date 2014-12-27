/**
 *	@class Buffer
 *	@memberof SQR
 *
 *	@description A buffer represents a 2d or 3d geometry and an attribute buffer.
 *	A buffer is internally composed of a Float32Array array and a WebGL buffer object.
 *	Squareroot does rely on strides, so each geometry is only composed of one array/buffer.
 *	A stride is a portion of the array that holds data for all attributes in a specific order.
 *	For example if the geometry is composed of 3D vertices, normals and 2D UV coordinates, 
 *	the stride look like this<br>
 *	`vx, vy, vz, nx, ny, nz, u, v`<br>
 *	The creation of strides in handled internally by the Buffer class.
 *	<br><br>
 *	More info on strides can be found in the specs {@link https://www.khronos.org/registry/webgl/specs/latest/1.0/}
 */
SQR.Buffer = function() {

	var b = {};
	var hasIndex = false;
	var data, indices;
	var buffer, indexBuffer;

	b.mode = SQR.gl.TRIANGLES;

	b.setMode = function(m) {
		b.mode = m
		return b;
	}

	/**
	 *	@method layout
	 *	@memberof SQR.Buffer.prototype
	 *	
	 *	@description Sets the layout of the buffer. 
	 *	A layout describes all the attributes of the geometry and their respective sizes. SQR has a few global functions that ar shorthands for typical layouts, like ex. {@link SQR.v2c3()}
	 *	@example 
var l = { aPosition: 3, aColor: 4, aUV: 2 };
// the `new` keyword is optional, all methods are chainable
var buffer = SQR.Buffer().layout(l, 100).update();
	 *	
	 */
	b.layout = function(layout, size) {
		b.size = size;
		b.strideSize = 0;
		b.layout = layout;
		b.attributes = {};

		for(var a in layout) {
			var aa = { offset: b.strideSize, byteOffset: b.strideSize * 4, size: layout[a] };
			b.strideSize += layout[a];
			b.attributes[a] = aa;
		}

		b.strideByteSize = b.strideSize * 4;
		data = new Float32Array(size * b.strideSize);
		return b;
	}

	/**
	 *	@method data
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description sets all the data for a given attribute
	 */
	b.data = function(attribute, array) {

		if(!(array instanceof Array)) {
			array = Array.prototype.slice.call(arguments, 1);
		}

		var s = b.attributes[attribute];
		var dl = array.length / s.size;

		for(var i = 0; i < dl; i++) {
			for(var j = 0; j < s.size; j++) {
				data[i * b.strideSize + j + s.offset] = array[i * s.size + j];
			}
		}

		return b;
	}

	/**
	 *	@method set
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description sets a value for a single attribute
	 */
	b.set = function(attribute, position, array) {
		if(array.toArray) {
			array = array.toArray();
		} else if(!(array instanceof Array)) {
			array = Array.prototype.slice.call(arguments, 2);
		}

		var s = b.attributes[attribute];

		for(var j = 0; j < s.size; j++) {
			data[position * b.strideSize + j + s.offset] = array[j];
		}

		return b;
	}

	/**
	 *	@method iterate
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description interates over each value for a given attribute
	 */
	b.iterate = function(attribute, callback) {
		var s = b.attributes[attribute];
		var c = 0;

		for(var i = 0; i < data.length; i += b.strideSize) {
			callback(i + s.offset, data, c);
			c++;
		}
		return b;
	}

	/**
	 *	@method bind
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description bind the buffer in gl (does the same thing as calling directly gl.bindBuffer)
	 */
	b.bind = function() {
		SQR.gl.bindBuffer(SQR.gl.ARRAY_BUFFER, buffer);
		return b;
	}

	/**
	 *	@method update
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description updates the gl buffer with the data from the array. 
	 *	When called for the first time it creates the gl buffer.
	 */
	b.update = function() {
		var gl = SQR.gl;

		buffer = buffer || gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        if(hasIndex) {
        	indexBuffer = gl.createBuffer();
        	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        }

        return b;
	}

	/**
	 *	@method index
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description sets index data. 
	 */
	b.index = function(array) {

		if(!(array instanceof Array)) {
			array = Array.prototype.slice.call(arguments, 0);
		}

		indices = new Uint16Array(array);
		b.indexSize = array.length;
        hasIndex = true;

        return b;
	}

	/**
	 *	@method isIndexed
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description returns true if buffer data is indexed and has an index array
	 */
	b.isIndexed = function() {
		return hasIndex;
	}

	/**
	 *	@method draw
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description used by the {SQR.Renderer}, called when this geometry is drawn
	 */
	b.draw = function() {
		var gl = SQR.gl;
		
		if(hasIndex)
			gl.drawElements(b.mode, b.indexSize, gl.UNSIGNED_SHORT, 0);
		else 
			gl.drawArrays(b.mode, 0, b.size);
	}

	/**
	 *	@method setRawData
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description sets the raw data into the array at offset 
	 */
	b.setRawData = function(array, offset) {
		data.set(array, offset);
	}

	/**
	 *	@method getDataArray
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description returns the raw array data
	 */
	b.getDataArray = function() {
		return data;
	}

	/**
	 *	@method destroy
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description destros the buffer and clears all data from the array
	 */
	b.destroy  = function() {
		data.length = 0;
		SQR.gl.deleteBuffer(buffer);
		if(hasIndex) SQR.gl.deleteBuffer(indexBuffer);
	}

	return b;

}