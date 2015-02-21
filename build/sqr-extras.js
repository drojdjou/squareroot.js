/* --- --- [extras/ConvexHull.js] --- --- */

/**
 *  @class ConvexHull
 *  @memberof SQR
 *
 *  @description utility to compute a convex hull. Based on algorithm from Chapter 1 in 
 *	{@link http://www.amazon.com/dp/3540779736/?tag=stackoverfl08-20} and code from 
 *	{@link http://blog.cedric.ws/draw-the-convex-hull-with-canvas-and-javascript} 
 *	which is basically the implementation of the algorithm explained in the book.
 *
 *	Other links: 
 *
 *	{@link http://www.travellermap.com/tmp/delaunay.js}
 *	{@link https://github.com/ironwallaby/delaunay/blob/master/delaunay.js}
 *	{@link http://paulbourke.net/papers/triangulate/}
 */
SQR.ConvexHull = (function() {



	var upper = [], lower = [], hull = [];

	var sortXY = function(a, b) {
		if(a.x == b.x) return a.y - b.y;
		else return a.x - b.x;
	}

	var isRight = function(a, b, c){
		return ( 
			(c.x * a.y - c.y * a.x) - 
			(b.x * a.y - b.y * a.x) + 
			(b.x * c.y - b.y * c.x)) < 0;
	}

	var upperHull = function(p, u) {

		u.push(p[0]);
		u.push(p[1]);

		for(var i = 2, l = p.length; i < l; i++) {

			u.push(p[i]);

			while(u.length > 2 &&
				!isRight(
					u[u.length-3],
					u[u.length-1],
					u[u.length-2]
				)
			) {
				u.splice(
					u.indexOf(u[u.length-2]), 
					1
				);
			}
		}

		return u;
	}

	var lowerhull = function(p, u){

		u.push(p[p.length-1]);
		u.push(p[p.length-2]);

		for(var i = p.length-3; i >= 0; i--) {
			u.push(p[i]);

			while(u.length > 2 &&
				!isRight(
					u[u.length-3], 
					u[u.length-1],
					u[u.length-2]
				)
			) {
				u.splice(
					u.indexOf(u[u.length-2]), 
					1
				);
			}
		}

		return u;
	}

	return {
		/** 
		 *	@method compute
		 *	@memberof SQR.ConvexHull
		 *
		 *	@desription computes the convexhull for a give set of points
		 *	
		 *	@param {Array} p - array of {@link SQR.V2} or any objects that have a `x` and `y` property.
		 *	@param {Array} h - the array to store the result in. If omitted, new one is created.
		 *
		 *	@returns {Array} array of {@link SQR.V2} containing ordered points that make the convexhull.
		 */
		compute: function(p, h) {

			if(!h) h = hull;

			upper.length = 0, lower.length = 0, h.length = 0;

			p.sort(sortXY);

			upperHull(p, upper);
			lowerhull(p, lower);

			h = h.concat(upper, lower);

			return h;
		}
	}

})();











/* --- --- [extras/Delaunay.js] --- --- */

/**
 *  
 *	@class Delaunay
 *  @memberof SQR
 *
 *  @description based on:<br> 
 *  
 *  {@link http://paulbourke.net/papers/triangulate/}<br>
 *  {@link http://www.travellermap.com/tmp/delaunay.htm} (original code)<br> 
 *  {@link https://github.com/ironwallaby/delaunay/blob/master/delaunay.js}<br> 
 *  {@link http://www.amazon.com/Computational-Geometry-Applications-Mark-Berg/dp/3642096816}
*/
SQR.Delaunay = (function() {

	var delaunay = {};

	var Edge = function(v0, v1) {
		this.v0 = v0;
		this.v1 = v1;
	}

	Edge.prototype.equals = function(other) {
		return (this.v0 === other.v0 && this.v1 === other.v1);
	};

	Edge.prototype.inverse = function() {
		return new Edge(this.v1, this.v0);
	};

	var createSuperTriangle = function(vertices) {
		// NOTE: There's a bit of a heuristic here. If the bounding triangle 
		// is too large and you see overflow/underflow errors. If it is too small 
		// you end up with a non-convex hull.

		var minx, miny, maxx, maxy;
		vertices.forEach(function(vertex) {
			if (minx === undefined || vertex.x < minx) { minx = vertex.x; }
			if (miny === undefined || vertex.y < miny) { miny = vertex.y; }
			if (maxx === undefined || vertex.x > maxx) { maxx = vertex.x; }
			if (maxy === undefined || vertex.y > maxy) { maxy = vertex.y; }
		});

		var dx = (maxx - minx) * 10;
		var dy = (maxy - miny) * 10;

		var stv0 = new SQR.V2(minx - dx, miny - dy * 3);
		var stv1 = new SQR.V2(minx - dx, maxy + dy);
		var stv2 = new SQR.V2(maxx + dx * 3, maxy + dy);

		return new SQR.Triangle(stv0, stv1, stv2);
	}

	function addVertex(vertex, triangles) {
		var edges = [];

		triangles = triangles.filter(function(triangle) {
			if (triangle.vertexInCircumcircle(vertex)) {
				edges.push(new Edge(triangle.v0, triangle.v1));
				edges.push(new Edge(triangle.v1, triangle.v2));
				edges.push(new Edge(triangle.v2, triangle.v0));
				return false;
			}

			return true;
		});

		edges = uniqueEdges(edges);

		edges.forEach(function(edge) {
			triangles.push(new SQR.Triangle(edge.v0, edge.v1, vertex));
		});

		return triangles;
	}

	var uniqueEdges = function(edges) {
		var uniqueEdges = [];

		for (var i = 0; i < edges.length; ++i) {
			var edge1 = edges[i];
			var unique = true;

			for (var j = 0; j < edges.length; ++j) {
				if (i === j) continue;
				var edge2 = edges[j];
				if (edge1.equals(edge2) || edge1.inverse().equals(edge2)) {
					unique = false;
					break;
				}
			}

			if (unique) uniqueEdges.push(edge1);
		}

		return uniqueEdges;
	}

	/**
	 *	@method triangulate
	 *	@memberof SQR.Delaunay
	 *
	 *	@description Performs Delaunay triangulation.
	 *
	 *	@param vertices - a list of 2d vertices. 
	 *	Can be {@link SQR.V2}, {@link SQR.V3} or any object that has `x` and `y` properties. 
	 *	In case of a 3d vector, the `z` component is ignored.
	 *	@returns a list of {@link SQR.Triangles}
	 */
	delaunay.triangulate = function(vertices) {
		var triangles = [];

		var st = createSuperTriangle(vertices);

		triangles.push(st);

		vertices.forEach(function(vertex) {
			// NOTE: This is O(n^2) - can be optimized by sorting vertices
			// along the x-axis and only considering triangles that have 
			// potentially overlapping circumcircles
			triangles = addVertex(vertex, triangles);
		});

		// Remove triangles that shared edges with "supertriangle"
		triangles = triangles.filter(function(triangle) {
			return !(triangle.v0 == st.v0 || triangle.v0 == st.v1 || triangle.v0 == st.v2 ||
			triangle.v1 == st.v0 || triangle.v1 == st.v1 || triangle.v1 == st.v2 ||
			triangle.v2 == st.v0 || triangle.v2 == st.v1 || triangle.v2 == st.v2);
		});

		return triangles;
	}

	return delaunay;

})();

/* --- --- [extras/GeometryTools.js] --- --- */

/**
 *  @namespace GeometryTools
 *  @memberof SQR
 *
 *  @description Tools to work with geometries/buffers.
 */
SQR.GeometryTools = (function() {

	var geoTools = {};
	var MAX_BUFFER_SIZE = 65535;

	/**
	 *	@method batch
	 *	@memberof SQR.GeometryTools
	 *
	 *	@description Combines all the geometries in a tree into one geometry. It assumes (but does not check) 
	 *	that all the children can be rendered using the same shader and that all their buffers have the same
	 *	layout. 
	 *
	 *	@param {SQR.Transform} container - the root of the tree to combine. 
	 *	This object and all it's children will be combined. 
	 *
	 *	@returns {SQR.Transform} the same object as passed in the argument. It will have no children 
	 *	and will have a buffer containing all the combine geometries. If the container shader was not set
	 *	it will inherit the shader from the first child that had one.
	 */
	geoTools.batch = function(container) {
		var batchObjects = [], size = 0;

		var updateTransform = function(t) {

			t.transformWorld();

			if (t.numChildren > 0) {
	            for (var i = 0; i < t.numChildren; i++) {
	                updateTransform(t.children[i]);
	            }
	        }

	        if(t.buffer) {
	        	if(t.buffer.isIndexed()) {
	        		console.warn("> SQR.GeometryTools.batch - indexed buffers can't be batched");
	        	} else {
	        		batchObjects.push(t);
	        		size += t.buffer.size;
	        	}
	        }

	        if(t.shader && !container.shader) {
	        	container.shader = t.shader;
	        }
		}

		updateTransform(container);

		var cb = SQR.Buffer().layout(batchObjects[0].buffer.layout, size);

		var offset = 0, base = 0, tmp = new SQR.V3(), tmpMat = new SQR.Matrix33(), c = 0;
		

		for(var i = 0; i < batchObjects.length; i++) {
				var bo = batchObjects[i];
				var b = batchObjects[i].buffer;
				var tb = new Float32Array(b.size * b.strideSize);
				tb.set(b.getDataArray());

				b.iterate('aPosition', function(i, d, c) {
					tmp.set(d[i+0], d[i+1], d[i+2], 1);
					bo.globalMatrix.transformVector(tmp);
					tb[i+0] = tmp.x;
					tb[i+1] = tmp.y;
					tb[i+2] = tmp.z;
				});

				b.iterate('aNormal', function(i, d, c) {
					tmp.set(d[i+0], d[i+1], d[i+2]);
					bo.globalMatrix.inverseMat3(tmpMat);
					tmpMat.transformVector(tmp);
					tb[i+0] = tmp.x;
					tb[i+1] = tmp.y;
					tb[i+2] = tmp.z;
				});

				cb.setRawData(tb, offset - base);

				offset += b.size * b.strideSize;

				c++;
		}

		// console.log('batched ' + container.numChildren + ' geometries, ' + size + ' vertices, ' + offset + ' elements in array');

		container.removeAll();
		container.buffer = cb.update();

		return container;
	}

	return geoTools;

})();

/* --- --- [extras/Shapes2d.js] --- --- */

SQR.Shapes2d = {

	circle: function(radius, color) {
		return function(ctx) {
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.arc(0, 0, radius, 0, Math.PI * 2);
			ctx.fill();
		}
	},

	triangleEq: function(radius, color) {
		return function(ctx) {
			ctx.fillStyle = color;
			ctx.beginPath();
			var r = radius;
			ctx.moveTo(Math.cos(30/180*Math.PI) * r, Math.sin(30/180*Math.PI) * r);
			ctx.lineTo(Math.cos(150/180*Math.PI) * r, Math.sin(150/180*Math.PI) * r);
			ctx.lineTo(Math.cos(Math.PI/-2) * r, Math.sin(Math.PI/-2) * r);
			ctx.fill();
		}
	},

	quad: function(width, height, color) {
		return function(ctx) {
			ctx.fillStyle = color;
			ctx.fillRect(width*-0.5, height*-0.5, width, height);
		}
	}

}

/* --- --- [extras/SpriteSheet.js] --- --- */

/**
 *  @class SpriteSheet
 *  @memberof SQR
 *
 *  @description Utility to create sprite sheets for 2d animations.
 *	See avaialble code samples:
 *	<ul>
 *		<li><a href="../tutorials/sprite-sheet.html">rendering a sprite sheet on canvas 2d</a></li>
 *		<li>rendering a sprite sheet in webgl (coming soon)</li>
 *	</ul>
 *
 *	@property {HTMLCanvasElement} canvas - the canves on which the sprite-sheet is drawn
 *	@property {Number} numFrames - the number for frames (rows x cols)
 *	@property {Number} rows - the number of rows as defined in {@link SQR.SpriteSheet#layout}
 *	@property {Number} columns - the number of columns as defined in {@link SQR.SpriteSheet#layout}
 *	@property {Number} size - the size of the sprite sheet square as defined in {@link SQR.SpriteSheet#layout}
 */
SQR.SpriteSheet = function() {

	var s = {};
	var rows, cols, size, options;

	var cnv = document.createElement('canvas');
	var ctx = cnv.getContext('2d');

	s.canvas = cnv;
	s.frame = 0;

	/**
	 *	Define the layout of the sprite sheet. The number of rows and columns is
	 *	arbitary, but it impacts the number of frames in the animaction, which is 
	 *	equal to the number product of those values (cols x rows). Typically it's better 
	 *	to create balanced sprite sheets that have roughly the same amount of rows as columns,
	 *	and avoid creating very long sheets iwth ex lots of rows and only one column. Thanks to this
	 *	you can avoid hitting the max canvas size limitation, esp on mobile.
	 *
	 *	Another limitations is that currently all cells need to be square and are defined by a single 
	 *	size value below. Since it's not optimal for rectangular animations, future versions will 
	 *	implement both width and height separately.
	 *
	 *	@param {Number} _rows - the number of rows in the spritesheet
	 *	@param {Number} _cols - the number of columns in the spritesheet
	 *	@param {Number} _size - the size of each cell. All cells in spritesheets are square
	 *
	 *	@method layout
	 *	@memberof SQR.SpriteSheet.prototype
	 */
	s.layout = function(_rows, _cols, _size) {
		rows = _rows, cols = _cols, size = _size;
		cnv.width = cols * size;
		cnv.height = rows * size;
		s.numFrames = rows * cols;
		s.rows = rows;
		s.cols = cols;
		s.size = size;
		return s;
	}

	/**
	 *	Set misc options for the spritesheet, which include:
	 *	<ul>
	 *		<li>bgcolor - a css color to use as background (default is transparent)</li>
	 *		<li>webglFlipY - set to true if spritesheet is used as webgl texture</li>
	 *	</ul>
	 *
	 *	@method options
	 *	@memberof SQR.SpriteSheet.prototype
	 */
	s.options = function(_options) {
		options = _options;
		return s;
	}

	/**
	 *	Draws a single frame to a canvas element. Can be used manually, but typically using
	 *	`run` below is recommended. The `run` function returns this function but wraps it in a
	 *	closure with a `setInterval` call for continous animated rendering.
	 *
	 *	@param {CanvasRenderingContext2D} context - context 2d of the canvas to draw the sprite to 
	 *	@param {Number} frame - the frame number to draw
	 *
	 *	@method renderToCanvas
	 *	@memberof SQR.SpriteSheet.prototype
	 */
	s.renderToCanvas = function(context, frame) {
		var row = cols == 1 ? frame : Math.floor(frame / cols);
		var col = frame % cols;

		context.translate(size / -2, size / -2);

		context.drawImage(cnv, 
			col * size, row * size, size, size, 
			0, 0, size, size);
	}

	/**
	 *	The srite sheet drawing function. 
	 *	The drawing function receives the following parameters:
	 *
	 *	<ul>
	 *		<li>ctx - the context of the sprite sheet canvas to draw on</li>
	 *		<li>frame - the number of the frame to draw</li>
	 *	</ul>
	 *
	 *	On top of that 
	 *
	 *	The drawing is called for each frame of the sprite sheet and expects that the 
	 *	implementing code will draw each consecivute frame at each call.
	 *
	 *	The context already comes transformed (translated) onto the current spot
	 *	for the given frame, so just start drawing at 0,0. The center of the sprite
	 *	is at size/2 x size/2.
	 *
	 *	@param {function} callback - the implementation of the drawing function
	 *
	 *	@method draw
	 *	@memberof SQR.SpriteSheet.prototype
	 */
	s.draw = function(callback) {

		if(options && options.bgcolor !== undefined) {
			ctx.fillStyle = options.bgcolor;
			ctx.fillRect(0, 0, cols * size, rows * size);
		} else {
			ctx.fillStyle = 'rgba(0, 0, 0, 0)';
			ctx.fillRect(0, 0, cols * size, rows * size);
		}

		if(!callback) return s;
		for(var y = 0; y < rows; y++) {
			for(var x = 0; x < cols; x++) {
				ctx.save();
				var yp = (options && options.webglFlipY) ? (rows-y-1) * size : y * size;
				ctx.translate(x * size, yp);
				callback.call(this, ctx, y * cols + x);
				ctx.restore();
			}
		}

		return s;
	}

	/**
	 *	Assign the return value of this function to the {@link SQR.Transform2d} shape
	 *	property for rendering. See {@tutorial canvas-rendering} for details.
	 *
	 *	@method run
	 *	@memberof SQR.SpriteSheet.prototype
	 *
	 *	@param {Number} framerate - the frame rate of the animation in ms (default 1000/60, i.e. 60FPS)
	 *	@param {Number} loop - number of times the animation should loop. (default -1, i.e. infinite) 
	 *
	 *	@return {Function} rendering function (renderToCanvas above) that can be used as shape property of {@link SQR.Transform2d} instance. 
	 *	The function has a propeorty called 'stop' which is also a function and can be called anytime to halt the animation.
	 *
	 *	@example
// Assumes the sheet is draw and ready to use (see link to example above)
var sheet = SQR.SpriteSheet();

// Create a host transform
var sprite = new SQR.Transform2d();
sprite.position.set(100, 100);

// Run at 30fps, loop 10 times.
sprite.shape = sheet.run(1000/30, 10);
	 */
	s.run = function(framerate, loop) {
		var f = 0, l = loop || -1;
		console.log(l);
		framerate = framerate || 1000/60;

		var runner = function(ctx) {
			s.renderToCanvas(ctx, f);
		}

		var intervalId = setInterval(function() {
			f++;
			if(f >= s.numFrames) {
				if(l != 0) {
					f = 0;
					l--;
				} else {
					runner.stop();
				}
			}
		}, framerate);

		runner.stop = function(runner) {
			clearInterval(intervalId);
		}

		return runner;
	}

	return s;
}

/* --- --- [extras/TextureGenerator.js] --- --- */

/**
 *  @class TextureGenerator
 *  @memberof SQR
 *
 *  @description Utility to generate procedural textures
 */
 SQR.TextureGenerator = {

 	/**
 	 *	Returns a noise texture
 	 *
 	 *	@param {Number} w - the width of the texture, default 512
 	 *	@param {Number} h - the height of the texture, default 512
 	 *	@param {HTMLCanvasElement} canvas - a canvas to draw the texture on, if omitted a new one is created
 	 *	@param {Number} min - minimum color value for r,g,b channels [0-255], alpha is always 255
 	 *	@param {Number} max - maximum color value for r,g,b channels [0-255], alpha is always 255
 	 */
	noise: function(w, h, canvas, min, max) {

		w = w || 512;
		h = h || w;

		min = min || 0;
		max = max || 255;

		var c = canvas || document.createElement('canvas')
		c.width = w, c.height = h;

		var cx = c.getContext('2d');
		var d = cx.createImageData(w, h);
		var p = d.data;

		for (var i = 0, n = p.length; i < n; i += 4) {
		    p[i+0] = min + (Math.random() * (max - min)) | 0;
		    p[i+1] = min + (Math.random() * (max - min)) | 0; 
		    p[i+2] = min + (Math.random() * (max - min)) | 0;
		    p[i+3] = 255;
		}

		cx.putImageData(d, 0, 0);

		return c;

	},

};




/* --- --- [extras/Trackball.js] --- --- */

/**
 *  @class Trackball
 *  @memberof SQR
 *
 *  @description Trackball controls. Usage:
 *  @example
var trackball = new SQR.Trackball();
var t = new SQR.Transform();
t.useQuaternion = true;
// then, inside render function
t.quaternion.copyFrom(trackball.rotation);
 *
 *  @todo add destroy method to clear listeners
 */
SQR.Trackball = function() {

    var t = {};

    t.rotation = new SQR.Quaternion();

    /**
     *  @private
     *  @description Based on {@link http://www.math.tamu.edu/~romwell/arcball_js/arcball.pde}
     *
     *  @param mx mouse X position in range [ -1 , 1 ]
     *  @param my mouse Y position in range [ -1 , 1 ]
     *  @param radius of the arc ball for interaction. Default value: 0.5
     */
    var mouseToUnitSphereVector = function(mx, my, gr, v) {
        gr = gr || 0.5;
        v = v || new SQR.V3();

        var px = mx / gr;
        var py = my / gr;
        var rl = px * px + py * py;

        if (rl >= 1) {
            v.set(px, py, 0);
        } else {
            v.set(px, py, Math.sqrt(1 - rl));
        }

        v.norm();

        return v;
    }

    var mx = 0, my = 0, isDown = false;
    var lastMV = new SQR.V3(), currMV = new SQR.V3(), deltaR = new SQR.Quaternion();
    var aspect = window.innerWidth / window.innerHeight;

    var normalizeMouseCoords = function(e) {
        e = ('ontouchstart' in document) ? e.targetTouches[0] : e;
        mx = (e.pageX / window.innerWidth * 2 - 1) * aspect;
        my = (e.pageY / window.innerHeight * 2 - 1) * -1;
    }

    var onInteractionStart = function(e) {
        isDown = true;
        normalizeMouseCoords(e);
        mouseToUnitSphereVector(mx, my, 1, lastMV);
    }

    var onInteractionMove = function(e) {
        if (isDown) {

            normalizeMouseCoords(e);
            mouseToUnitSphereVector(mx, my, 1, currMV);

            var a = SQR.V3.dot(lastMV, currMV);
            lastMV.cross(currMV, lastMV);
            deltaR.set(lastMV.x, lastMV.y, lastMV.z, a);
            t.rotation.mul(deltaR);
            lastMV.copyFrom(currMV);
        }
    }

    var onInteractionEnd = function() {
        isDown = false;
    }

    if('ontouchstart' in document) {
        document.addEventListener('touchstart', onInteractionStart, false);
        document.addEventListener('touchmove', onInteractionMove, false);
        document.addEventListener('touchend', onInteractionEnd, false);
    } else {
        document.addEventListener('mousedown', onInteractionStart, false);
        document.addEventListener('mousemove', onInteractionMove, false);
        document.addEventListener('mouseup', onInteractionEnd, false);
    }

    return t;
}






/* --- --- [extras/Triangle.js] --- --- */

/**
 *  @class Triangle
 *  @memberof SQR
 *
 *  @description Represents a triangle composed on 3 vectors. 
 *	Vectors can be of any size, though some of it methods only work with 2-dimensional vectors.
 *
 *	@param v1 Vector {@link SQR.V2} or {@link SQR.V3}
 *
 *	@property {SQR.V2} centroid - the centroid, undef until `calculateCentroid` is called.
 *	@property {Number} circumRadius - the  radius of the 
 *		circum-circle, undef until `calculateCircumCircle` is called.
 *	@property {SQR.V2} circumCenter - the center of the cirsum-circle, 
 *		undef until `calculateCircumCircle` is called.
 *	
 */
SQR.Triangle = function(v0, v1, v2) {

	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;

	/**
	 *	Calculates the centroid for this triangle. Only works with 2d coordinates for now.
	 *	The resulting centroid is stored in the `centroid` property.
	 *
	 *	@memberof SQR.Triangle.prototype
	 *	@method calculateCentroid
	 */
	this.calculateCentroid = function() {
		this.centroid = new SQR.V2();
		this.centroid.x = (this.v0.x + this.v1.x + this.v2.x) / 3;
		this.centroid.y = (this.v0.y + this.v1.y + this.v2.y) / 3;
	}

	/**
	 *	Calculates circumcircle, only works with 2d coordinates.
	 *	<br><br>
	 *	Based on 
	 *	{@link http://jwilson.coe.uga.edu/emat6680/dunbar/assignment4/assignment4_kd.htm this}
	 *	and
	 *	{@link http://www.exaflop.org/docs/cgafaq/cga1.html this}.
	 *
	 *	@memberof SQR.Triangle.prototype
	 *	@method calculateCircumCircle
	 */
	this.calculateCircumCircle = function() {
		var A = this.v1.x - this.v0.x;
		var B = this.v1.y - this.v0.y;
		var C = this.v2.x - this.v0.x;
		var D = this.v2.y - this.v0.y;

		var E = A * (this.v0.x + this.v1.x) + B * (this.v0.y + this.v1.y);
		var F = C * (this.v0.x + this.v2.x) + D * (this.v0.y + this.v2.y);

		var G = 2.0 * (A * (this.v2.y - this.v1.y) - B * (this.v2.x - this.v1.x));

		var dx, dy;

		if (Math.abs(G) < SQR.EPSILON) {
			// Collinear - find extremes and use the midpoint
			var minx = Math.min(this.v0.x, this.v1.x, this.v2.x);
			var miny = Math.min(this.v0.y, this.v1.y, this.v2.y);
			var maxx = Math.max(this.v0.x, this.v1.x, this.v2.x);
			var maxy = Math.max(this.v0.y, this.v1.y, this.v2.y);

			this.circumCenter = new SQR.V2((minx + maxx) / 2, (miny + maxy) / 2);

			dx = this.circumCenter.x - minx;
			dy = this.circumCenter.y - miny;
		} else {
			var cx = (D * E - B * F) / G;
			var cy = (A * F - C * E) / G;

			this.circumCenter = new SQR.V2(cx, cy);

			dx = this.circumCenter.x - this.v0.x;
			dy = this.circumCenter.y - this.v0.y;
		}

		this.circumRadiusSq = dx * dx + dy * dy;
		this.circumRadius = Math.sqrt(this.circumRadiusSq);
	}

	/**
	 *	Test whether the point v is inside the triangles circumcircle. 
	 *	If circum-circle was not calculated, calculateCircumCircle will be called first
	 *	@memberof SQR.Triangle.prototype
	 *	@method vertexInCircumcircle
	 *	@param {SQR.V2} v - vertex to be checked
	 *	@returns {boolean} true is vertex is in circumcircle
	 */
	this.vertexInCircumcircle = function(v) {

		if(!this.circumCenter) this.calculateCircumCircle();

		var dx = this.circumCenter.x - v.x;
		var dy = this.circumCenter.y - v.y;
		var sq = dx * dx + dy * dy;
		return (sq <= this.circumRadiusSq);

	}

};

