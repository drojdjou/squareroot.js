/**
 *  @namespace Mesh
 *  @memberof SQR
 *
 *  @description <p>A higher level wrapper for buffers designed 
 *	to make management of 3d solid objects easier.</p>
 */

/*
 *	<h3>Some theory about meshesh</h3>
 *
 *	<p>A buffer is an array composed of an abritrary number of attributes. Their names and size can express anything 
 *	- somtimes position, but also angle, radius, size, speed, velocity, mass... you name it. It will all work ok as long as there 
 *	we write a shader that can interpret those attributes and translate them into a vertex position. 
 *	This is great for for particle systems and other fancy shapes.</p>
 *
 *	<p>However, there are cases where we simply need to draw a mesh that is a solid object.
 *	These meshes are not as diverse in their structure. They typically all have the same set of attributes. 
 *	These inlude:</p>
 *
 *	<ol>
 *		<li>aPosition - the 3d position of the vertex</li>
 *		<li>aNormal - the normal of the vertex</li>
 *		<li>aUV - the texture coordinate of the vertex</li>
 *		<li>aUV2 - secondary texture coordinate of the vertex (for lightmapping or whatever)</li>
 *		<li>aTangent - the tangent of the vertex for normal mapping</li>
 *		<li>aBinormal - the binomal of the vertex for normal mapping 
 *			(not sure if this is actually useful, maybe can be computer in the shader?)</li>
 *		<li>aWeight - the bone weights</li>
 *		<li>aIndex - the bone indices</li>
 *		<li>aColor - the vertex color</li>
 *	</ol>
 *
 *	<p>Now, a lot of meshes will come from the Unity exporter and they will have some or all of the above attributes. With things like
 *	boneWieght and boneIndices it would be insane to try to create them in code (I tried).
 *	So most cases it is best to take the exported data, push it into a buffer and not have a Mesh at all. Expect in two cases:
 *	</p>
 *
 *	<ul>
 *		<li>The mesh is supposed to be animated per-vertex in Javascript (not in shader)</li>
 *		<li>The mesh lacks normal, tangent or binormal data and these need to be calculated before rendering</li>
 *	</ul>
 *
 *	<p>So moving vertex positions around and recalculating normals (or tangents and binormals, which is similar) are the two 
 *	most important features that the Mesh class should deal with. It's worth noting that after the vertices positions are moved, 
 *	recalculating the normals is the necessary next step in most cases anyway - so the two are tied together. Attributes such as UVs
 *	will almost never be animated (I can't think of a scenario where this would make sense). A color attribute can be animated, but usually
 *	this one is very rarely used.</p>
 *
 *	<p>Meshes are often indexed but it's not as staightforward as it may seem. Indexing vertex positions is simple and elegant, but often 
 *	we need to have one vertex position to have more than one different texture coordinates because every face the vertex is attached 
 *	to will have it's own texture mapping. Same goes for normals - if we need to have 100% flat shading, every face needs to have it's 
 *	own vertices and not share it with any other face.</p>
 *
 *	<p>This can get pretty involved to figure out ex. how to break the vertices based on the angle between the faces. We could implement it 
 *	some day, but given that Unity handles this already it seems a bit overkill. Instead we can opt for calculating averaged normals for 
 *	each vertex that is shared by more than one face for meshes imported from Unity.</p>
 *
 *	<p>Another category are realtime primitives (cubes, spheres, planes) and other realtime generated meshes. This is where the Mesh
 *	class is going to be most useful. The idea here is to be able to create faces (tris or quads) based on vertex position and 
 *	add other attributes - either manually or by some kind of computation.</p>
 *
 *	<p>When it comes to adding attributes based on some algorithm - in most cases it means it will be derived from vertex positions.
 *	The most basic example is of course calculating normals, but other good example is calculating texture coordinates based on some
 *	mapping system (cubic, spherical etc...) or vertex color also based on some sort of mapping.</p>
 *
 *	<p>Manually adding attributes in code seems impractical. For example it is far easier to perform a custom texture mapping in a
 *	3d software such as C4D than to try to add the mapping in code. So let's just forget about it and focus on what code is 
 *	good at - computation.</p>
 *
 *	<p>Let's examine 3 simple cases and 2 more complex ones.</p>
 *
 *	<p>Case 1: a plane. A plane is trivial. The normals are all the same and all point up from the surface of the plane. The UV mapping
 *	is trivial as well - each vertex UV coordinate is based on it's porportional position in the plane and the entire plane is mapped to
 *	texture coords going from 0 to 1 on both u and c axes. This kind of mesh could actually be indexed on the buffer level and draw using 
 *	drawElements.</p>
 *
 *	<p>Case 2: a sphere. Sphere is also pretty simple - normals are basically normalized vertex positions and UV mapping is derived from 
 *	the latitude and longitude of each vertex. Typically the vertex positions themselves are calculated from angle during the creation of
 *	the mesh.</p>
 *
 *	<p>Case 3: a cube. A cube is composed of six planes, so same rules apply. Actuall the entire cube creation code can consist of creating
 *	six planes and merging them together.</p>
 *
 *	<p>Case 4: a plane with a height map or vertex animation (cloth, water, terrain). It starts with a plane that is subdivided. The UV mapping is the same.
 *	Then the vertex positions can be moved around (typically for a XZ plane, we move the Y position up and down) and normals (tangents etc)
 *	can be recalculated. Since the plane is subdivided anbd not flat we can either average normals and make it smooth or 
 *	make them flat shaded.</p>
 *
 *	<p>Case 5: pyramid, cylinder or cone, or any other primitive shape. The positions for those shapes can be generated with code and normals
 *	can be derived from these positions. However, there is no obvious way to come up with UV coordinates. Texture mapping algorithms can be helpful
 *  in this case, or, if we go with a low poly esthetic we can skip UVs entirely.</p>
 *
 *	<p>Except for Case 1, all the other meshes do not lend themselves easily to indexing. It can be done, but it will result in complex code and 
 *	we're not sure if it is worth the effort. Instead, we can load all the vertices to the buffer separately. However, it makes total sense to keep
 *	a list of vertices shared by faces but not duplicated for each face. This will make it possible to modulate their position without having the
 *	mesh break and also it will make it possible to calculate smooth normals.</p>
 *
 *	<p>This leads to the conclusion that realtime meshes should not be indexed at all on the buffer level, but reusing vertex objects on the JS side
 *	is a good idea.</p>
 *
 *	<p>PS. This about <a href='http://marcinignac.com/blog/fast-dynamic-geometry-in-webgl/'>this</a>. Honestly
 *	it sounds very resnoable, but code tests I did now do not prove that this is the best way (not to mention
 *	the resulting code complexity...)</p>
 */
SQR.Mesh = function() {

	if(!(this instanceof SQR.Mesh)) return new SQR.Mesh();

	var m = this;

	m.polys = [];
	m.vertices = [];
	m.uvs = [];
	m.size = 0;

	m.addVertex = function(x, y, z) {
		var v = new SQR.Vertex(x, y, z);
		m.vertices.push(v);
		return m.vertices.length - 1;
	};

	m.addUV = function(u, v) {
		var v = new SQR.V2(u, v);
		m.uvs.push(v);
		return m.uvs.length - 1;
	}

	m.addFace = function() {
		var p = new SQR.Poly(m);
		p.V.apply(p, arguments);
		m.polys.push(p);
		m.size += p.triangles.length;
		return p;
	};

	
	m.calculateNormals = function(s) {

		m.smooth = s;

		for(var i = 0, l = m.polys.length; i < l; i++) {
			m.polys[i].calculateNormal();
		}

		if(m.smooth) {
			for(var i = 0, l = m.vertices.length; i < l; i++) {
				if(m.vertices[i].polys) m.vertices[i].calculateNormal();
			}
		}

		return m;
	};

	m.flip = function() {
		for(var i = 0, l = m.polys.length; i < l; i++) {
			m.polys[i].flip();
		}

		return m;
	}

	m.calculateTangents = function() {
		console.log('SQR.Mesh.calculateTangents is not implemented yet!');
	};

	var createBuffer = function() {

		var p = m.polys[0];

		var s = m.size;

		var l = { aPosition: 3 };
		if(p.normal) l.aNormal = 3;
		if(p.uvs.length > 0) l.aUV = 2;

		m.buffer = SQR.Buffer().layout(l, s);
		return m.buffer;
	}

	m.update = function() {

		if(m.polys.length == 0) {
			console.warn('> SQR.Mesh.update > no polys found to create buffer from.');
			return;
		}

		var b = m.buffer || createBuffer();

		var p = b.attributes.aPosition, c = 0;

		var transport = [];
		
		for(var i = 0, ml = m.polys.length; i < ml; i++) {

			var pl = m.polys[i];

			for(var j = 0, vl = pl.triangles.length; j < vl; j++) {

				var ti = pl.triangles[j];

				var v = m.vertices[pl.vertices[ti]];

				var p = v.position;
				var n = m.smooth ? v.normal : pl.normal;
				var t = m.uvs[pl.uvs[ti]];

				transport.length = 0;
				transport.push(p.x, p.y, p.z, n.x, n.y, n.z, t.x, t.y);
				b.set(null, c, transport);

				c++;
			}
		}


		b.update();

		if(!b.mesh) b.mesh = m;

		return b;
	}

	// Aliases
	m.V = m.addVertex;
	m.F = m.addFace;
	m.T = m.addUV;
};



/**
 *	@method fromJSON
 *	@memberof SQR.Mesh
 *
 *	@param {Object | string} data - the mesh data or an object containing a named list of meshes 
 *	(which is how meshes get exported from unity by default - the names are the uuids of the object)
 *
 *	@param {string=} name - the name of the mesh in the list. 
 *	If data is a list of meshes and name is omitted, the function will pick the first mesh on the list.
 *	If data is the mesh data itself, this argument will be ignored.
 *
 *	@param {Object=} options - advanced options for mesh construction
 *
 *	@description <p>Utility to load meshes from JSON files in the 
 *	format as exported from the Unity exporter.</p>
 *
 *	<p>Parses the J3D JSON mesh data format and creates an instance SQR.Buffer out of it.</p>
 *
 *	<p>This is the best way to work with 3d models, since SQR doesn't have native support for OBJ files or Collada 
 *	(though it's perfectly possible to create an OBJ or Collada importer if you need to).</p>
 */	
SQR.Mesh.fromJSON = function(data, name, options) {

	var geo;

	options = options || {};

	if(name) {
		// data is a list of meshesh from Unity and we provide a name
		geo = data[name];
	} else if(data.vertices) {
		// data is the mesh itself
		geo = data;
	} else {
		// data is a list of meshes from Unity but we didn't provide a name

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

	// This is to be able to work with old JSON format. Needs to go away at some point.
	var legacyAttribute = {
		aPosition: 'vertices',
		aNormal: 'normals',
		aColor: 'colors',
		aUV: 'uv1',
		aUV2: 'uv2',
		aTangent: 'tangent',
		aWeight: 'boneWeights',
		aIndex: 'boneIndices',
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
		var d = getAttributeData(a);
		if(d) buffer.data(a, d);
	}

	var i = getAttributeData('indices');
	if(i) buffer.index(i);

	SQR.Mesh(buffer);

    return buffer.update();
};
