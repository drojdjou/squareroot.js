/* --- --- [extras/GeometryTools.js] --- --- */

SQR.GeometryTools = (function() {

	var geoTools = {};
	var MAX_BUFFER_SIZE = 65535;

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

		console.log('batched ' + container.numChildren + ' geometries, ' + size + ' vertices, ' + offset + ' elements in array');

		container.removeAll();

		var b = new SQR.Transform();
		b.shader = container.shader;
		b.buffer = cb.update();
		container.add(b);
	}

	return geoTools;

})();

/* --- --- [extras/TextureGenerator.js] --- --- */

SQR.TextureGenerator = {

	noise: function(w, h) {

		w = w || 512;
		h = h || w;

		var c = document.createElement('canvas')
		c.width = w, c.height = h;

		var cx = c.getContext('2d');
		var d = cx.createImageData(w, h);
		var p = d.data;

		for (var i = 0, n = p.length; i < n; i += 4) {
		    p[i+0] = (Math.random() * 255) | 0;
		    p[i+1] = (Math.random() * 255) | 0; 
		    p[i+2] = (Math.random() * 255) | 0;
		    p[i+3] = 255;
		}

		cx.putImageData(d, 0, 0);

		return c;

	},

};




/* --- --- [extras/Trackball.js] --- --- */

/* 

Trackball controls for Three.js

Usage: 


var trackball = new SQR.Trackball();

t.useQuaternion = true;

// then, inside render function
t.quaternion.copyFrom(trackball.rotation);
// ...and apply to an object

*/
SQR.Trackball = function() {

    var t = {};

    t.rotation = new SQR.Quaternion();

    /**
     * Based on http://www.math.tamu.edu/~romwell/arcball_js/arcball.pde
     *
     * @param mx mouse X position in range [ -1 , 1 ]
     * @param my mouse Y position in range [ -1 , 1 ]
     * @param radius of the arc ball for interaction. Default value: 0.5
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






