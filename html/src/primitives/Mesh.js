SQR.Mesh = {

	fromJSON: function(data, name, options) {

		var geo;

		options = options || {};

		if(name) {
			geo = data[name];
		} else if(data.vertices) {
			geo = data;
		} else {
			// Unity exported mesh files can have one or more meshes. 
			// Even if there's only one mesh, it is stored as property
			// where the key is the mesh uuid. This code will attempt
			// to find the first mesh, so that on JS side we don't have to 
			// pass the uuid in the constructor
			for(var d in data) {
				geo = data[d];
				break;
			}
		}

		if(!geo) throw "> SQR.Mesh - mesh not found in data (name: " + name + ")";
	
		var legacyAttribute = {
			aPosition: 'vertices',
			aNormal: 'normals',
			aColor: 'colors',
			aUV: 'uv1',
			aUV2: 'uv2',
			aTangent: 'tangent',
			indices: 'tris'
		};

		var getAttributeData = function(n) {
			var d = geo[n] || geo[legacyAttribute[n]];
			if(d && d.length > 0) return d;
			else return null; 
		}

		var layout = options.layout || data.layout || SQR.v3n3u2();
		var vs = options.vertexSize || layout.aPosition;
		var size = (geo.vertices || geo.aPosition).length / vs;


		var buffer = SQR.Buffer().layout(layout, size);

		for(var a in layout) {
			if(a == 'aNormal' && options.skipNormals) continue;
			var d = getAttributeData(a);
			if(d) buffer.data(a, d);
		}

		var i = getAttributeData('indices');
		if(i) buffer.index(i);

        return buffer.update();
	},

	calculateNormals: function(buffer) {

		var index = buffer.getIndexArray();
		var data = buffer.getDataArray();

		var f = new SQR.Face().setPosition(new SQR.V3(), new SQR.V3(), new SQR.V3());
		f.a.normal = new SQR.V3();
		f.b.normal = new SQR.V3();
		f.c.normal = new SQR.V3();
		var n = new SQR.V3();

		for(var i = 0; i < buffer.indexSize; i += 3) {
			var o0 = index[i+0] * buffer.strideSize;
			var o1 = index[i+1] * buffer.strideSize;
			var o2 = index[i+2] * buffer.strideSize;

			f.a.set(data[o0+0], data[o0+1], data[o0+2]);
			f.b.set(data[o1+0], data[o1+1], data[o1+2]);
			f.c.set(data[o2+0], data[o2+1], data[o2+2]);

			f.a.normal.set(data[o0+3], data[o0+4], data[o0+5]);
			f.b.normal.set(data[o1+3], data[o1+4], data[o1+5]);
			f.c.normal.set(data[o2+3], data[o2+4], data[o2+5]);

			f.calculateNormal();
			f.normal.norm();
			f.addNormalToVertices();

			data[o0+3] = f.a.normal.x;
			data[o0+4] = f.a.normal.y;
			data[o0+5] = f.a.normal.z;

			data[o1+3] = f.b.normal.x;
			data[o1+4] = f.b.normal.y;
			data[o1+5] = f.b.normal.z;

			data[o2+3] = f.c.normal.x;
			data[o2+4] = f.c.normal.y;
			data[o2+5] = f.c.normal.z;
		}

		buffer.iterate('aNormal', function(i, data, c) {
			n.set(data[i+0], data[i+1], data[i+2]).norm();

			data[i+0] = n.x;
			data[i+1] = n.y;
			data[i+2] = n.z;
		});

		buffer.update();
	} 
}