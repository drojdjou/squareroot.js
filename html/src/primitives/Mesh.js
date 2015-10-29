/**
 *  @namespace Mesh
 *  @memberof SQR
 *
 *  @description Attempt to create a decorator for a buffer that will be able to process 
 *	the data (position, normals and tangents) as it if was a collection of faces.
 */
SQR.Mesh = function(buffer, quads) {
	var m = {};
	buffer.mesh = m;
	return m;
}



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
