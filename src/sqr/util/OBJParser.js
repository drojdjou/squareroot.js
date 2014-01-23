/**
 *	This is a very basic parser, so use it at your own risk.
 *	It assumes that there is 1 object in the OBJ file and only parses
 *	vertices and elements (v, f).
 *
 *	It doesn't support normals (though is does recalculate all normals), uvs, materials and multiple objects for now.
 */
SQR.OBJParser = (function() {

	var p = {};

	p.parse = function(data, geometry) {

		var lines = data.split("\n");
		var numLines = lines.length;

		var vs = [], ts = [], i;

		for(i = 0; i < numLines; i++) {
			var d = lines[i].split(" ");
			switch (d[0]) {
				case "v":
				vs.push(new SQR.V3(parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3])));
				break;
				case "f":
				var a = parseInt(d[1]) - 1, b = parseInt(d[2]) - 1, c = parseInt(d[3]) - 1;

				ts.push(new SQR.Triangle(vs[a].clone(), vs[c].clone(), vs[b].clone()));
				// ts.push(new SQR.Triangle().setElements(vs, a, c, b));

				break;
			}
		}

		var vsa = [], nsa = [], esa = [];

        for(var i = 0; i < ts.length; i++) {
            ts[i].calculateNormal(true);
            // ts[i].toElements(esa);
            ts[i].toArray(vsa, nsa);
        }

        // for(var i = 0; i < vs.length; i++) {
        //     var v = vs[i];
        //     var n = v.normal;
        //     vsa.push(v.x, v.y, v.z);
        //     if(n) nsa.push(n.x, n.y, n.z);
        //     else nsa.push(0, 0, 1);
        // }

        geometry.vertices = new Float32Array(vsa);
        geometry.normals = new Float32Array(nsa);
        // geometry.elements = new Uint16Array(esa);
	}

	return p;

})();