import SQR from 'SQR';

export default Buffer = function() {

	var b = {};
	var hasIndex = false;
	var data, indices;
	var buffer, indexBuffer;

	b.mode = SQR.gl.TRIANGLES;

	/**
	 *	@method setMode
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description set the drawing mode for this buffer. 
	 *	Can be any one of the supported webgl drawing modes such as 
	 *	`gl.POINTS`, `gl.LINES` or `gl.TRIANGLES` which is the default.
	 *
	 *	Reminder: all the gl constants are available through the `SQR.gl` property.
	 */
	b.setMode = function(m) {
		b.mode = m
		return b;
	}

	/**
	 *	@method layout
	 *	@memberof SQR.Buffer.prototype
	 *	
	 *	@description Sets the layout of the buffer. 
	 *	A layout describes all the attributes of the geometry and their respective sizes. 
	 *	{@link SQR} has a few global functions that ar shorthands for typical layouts, like ex. {@link SQR.v2c3()}
	 *	@example 
var l = { aPosition: 3, aColor: 4, aUV: 2 };
// the `new` keyword is optional, all methods are chainable
var buffer = SQR.Buffer().layout(l, 100).update();
	 *
	 *	@param {object} layout - the layout of the buffer (see desc above) and {@tutorial understanding-buffers}
	 *	@param {Number} size - the size of the buffer i.e. how many vertices it has
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
	 *	@description Sets all the data for a given attribute.
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
	 *	@description Sets a value for an attribute at a defined position.
	 *
	 *	@param {string} attribute - name of the attribute (ex. `aPosition`)
	 *	@param {Number} position - the index of this attrbute (related to the size of the buffer)
	 *	@param {Array=} array - the data in form of an `Array` or as separate arguments 
	 *	or an object that has a `toArray` attribute (see example to see all the possible options)
	 *
	 *	@example
b.set('aPosition', 1, 	[3, 5, 6]);
b.set('aPosition', 1, 	4, 8, 9);
b.set('aPosition', 1, 	new SQR.V3(3, 5, 6));
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
	 *	@description Iterates over each value for a given attribute. 
	 *	See example to see how to move all the vertices by 4 on the Y axis.
	 *
	 *	@example
b.iterate('aPosition', function(i, data, count)) {
	// i = x, i+1 = y, i+2 = z
	data[i + 1] += 4;
});
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
	 *	@description Binds the buffer in gl, 
	 *	which does the same thing as calling `gl.bindBuffer` directly.
	 */
	b.bind = function() {
		SQR.gl.bindBuffer(SQR.gl.ARRAY_BUFFER, buffer);
		return b;
	}

	/**
	 *	@method update
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description Updates the webgl buffer with the data from the internal array. 
	 *	When called for the first time it lazily creates the webgl buffer.
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
	 *	@description Sets index data. 
	 *
	 *	@param {Array=} array either an array or argument list of all the indexes. 
	 *	Used when setting up meshes imported as OBJ or JSON object from Unity, Blender or similar.
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
	 *	@description used by the {SQR.Renderer}, called when this geometry is drawn. 
	 *	Will call `gl.drawArrays` or `gl.drawElements` to draw the geometry using the current shader.
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
	 *	@description Returns the raw array data
	 *	
	 *	@data {Float32Array} - Array containing all the vertex attributes data organized in stride
	 *	according to the layout.
	 */
	b.getDataArray = function() {
		return data;
	}

	/**
	 *	@method destroy
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description Destroys the buffer and clears all data from the array.
	 */
	b.destroy  = function() {
		data.length = 0;
		SQR.gl.deleteBuffer(buffer);

		if(hasIndex) {
			indices.length = 0;
			SQR.gl.deleteBuffer(indexBuffer);
		}
	}

	return b;

}