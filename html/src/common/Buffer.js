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
 *	More info on strides can be found in the {@link https://www.khronos.org/registry/webgl/specs/latest/1.0/ specs}.
 *	<br><br>
 *	Please read the {@tutorial basic-setup} tutorial to see how to use a buffer  
 *	and the {@tutorial understanding-buffers} tutorial  for an in depth discussion on buffers.
 */
SQR.Buffer = function() {

	var b = {};
	var hasIndex = false;
	var data, indices;
	var buffer, indexBuffer;

	b.mode = SQR.gl.TRIANGLES;
	b.drawMode = SQR.gl.STATIC_DRAW;

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
	 *	@method resize
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description Resizes the data 
	 */
	b.resize = function(size, offset) {
		b.size = size;
		var nd = new Float32Array(size * b.strideSize);
		
		if(!offset) { 
			nd.set(data); 
		} else {
			for(var i = 0; i < data.length; i++) {
				var k = i - offset * b.strideSize;
				if(k >= 0) nd[k] = data[i];
			}
		}

		data = nd;
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

		if(position < 0) position += b.size;
		if(position >= b.size) position = position % b.size;

		for(var j = 0, al = array.length; j < al; j++) {
			data[position * b.strideSize + j + s.offset] = array[j];
		}

		return b;
	}

	// Is this even useful?

	// b.get = function(attribute, position, array) {
	// 	array = array || [];

	// 	var s = b.attributes[attribute];

	// 	if(position < 0) position += b.size;
	// 	if(position >= b.size) position = position % b.size;

	// 	var c = position * b.strideSize + s.offset;
	// 	for(var i = 0; i < b.size; i++) array[i] = data[c + i];

	// 	return array;
	// }

	/**
	 *	@method iterate
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description Iterates over each value for an attribute or over every stride.
	 *	See example below to see how to move all the vertices by 4 on the y-axis.
	 *
	 *	@param {string=} attribute - the name of the attribute to interate over, if null, it will iterate over entire strides
	 *
	 *	@param {SQR.Buffer~iterateCallback} callback - the callback function processing the data.
	 *
	 *	@example
b.iterate('aPosition', function(i, data, count)) {
	// i+0 = x, i+1 = y, i+2 = z
	// so, to increment the y value do:
	data[i+1] += 4;
});
	 */
	b.iterate = function(attribute, callback) {
		var s = b.attributes[attribute];
		var o = attribute ? s.offset : 0;
		var c = 0;

		for(var i = 0; i < data.length; i += b.strideSize) {
			callback(i + o, data, c);
			c++;
		}
		return b;
	}
	/**
	 *	This callback for the iterate function allowing processing of the buffer data.
	 *
	 *	@callback SQR.Buffer~iterateCallback
	 *	@param {Number} i - <p>the index of the first value for this attribute in the buffer</p>
	 *
	 *	<p>Example: if a buffer has 2 attributes - aPosition (3d vector) and aUV (2d vector)
	 *	this means the stride size is 3 + 2 = 5. In this case i for the first position attribute is
	 *	0 and for the second one it is 6. This index points to the index of first component of the attribute
	 *	- in case of a position which is a 3d vector - it points to the x component. 
	 *	To access the next component - y - add 1 to i, so data[i+1] is the y component.</p>
	 *
	 *	@param {Float3dArray} data - the entire the buffer array. Use the i parameter to read/write data to this array.
	 *
	 *	@param {Number} count - the current index for the attribute - it is incremented by 1 at each iteration
	 */

	/**
	 *	@method bind
	 *	@memberof SQR.Buffer.prototype
	 *
	 *	@description Binds the buffer in gl, 
	 *	which does the same thing as calling `gl.bindBuffer` directly.
	 */
	b.bind = function() {
		SQR.gl.bindBuffer(SQR.gl.ARRAY_BUFFER, buffer);
		if(hasIndex)SQR.gl.bindBuffer(SQR.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
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
        gl.bufferData(gl.ARRAY_BUFFER, data, b.drawMode);

        if(hasIndex) {
        	indexBuffer = gl.createBuffer();
        	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, b.drawMode);
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
	 *	@data {Float32Array} - Array containing all the vertex attributes data organized in strides
	 *	according to the layout.
	 */
	b.getDataArray = function() {
		return data;
	}

	b.getIndexArray = function() {
		return indices;
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