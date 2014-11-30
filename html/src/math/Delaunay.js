/**
*  Based on: 
*  
*  http://paulbourke.net/papers/triangulate/
*  http://www.travellermap.com/tmp/delaunay.htm (original code)
*  https://github.com/ironwallaby/delaunay/blob/master/delaunay.js
*  http://www.amazon.com/Computational-Geometry-Applications-Mark-Berg/dp/3642096816
*/
SQR.Delaunay = (function() {

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

	var triangulate = function(vertices) {
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

	return {
		triangulate: triangulate
	}

})();