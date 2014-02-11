SQR.Pyramid = function(options) {

    options = options || {};
    options.offset = options.offset || new SQR.V3();

    var faces = [], vertices = [], normals = [];
    var geo = new SQR.Geometry().quickSetup('v3n3');
    var options;

    var addFace = function(v1, v2, v3, t1, t2, t3) {
        var f = new SQR.Triangle(options);
        f.setVertices(v1, v2, v3);
        f.setAttribute(SQR.Geometry.TEXCOORD, t1, t2, t3);
        faces.push(f);
    }

    geo.create = function(baseSize, heightUp, heightDown, segments, offset) {
        var b = baseSize || 1;

        var hu = heightUp || 5;
        var s = segments || 4;
        var hd  = heightDown || 0;
        
        var of = options.offset;

        var peak =   new SQR.V3(0,  hu,  0);
        var bottom = new SQR.V3(0, -hd,  0);

        var peakTex =   new SQR.V2(0.5, 1);

        var base = [], baseTex = [], i;

        offset = offset || Math.PI * 0.25;

        for(i = 0; i < s; i++) {
            var cos = Math.cos(i / s * SQR.twoPI + offset);
            var sin = Math.sin(i / s * SQR.twoPI + offset);
            base.push(new SQR.V3(cos * b, 0, sin * b));
        }

        for(i = 0; i < s; i++) {
            var n = i + 1
            if(n >= s) n = 0;
            addFace(peak, base[i], base[n]);
        }

        if(!options.noCap) {
            for(i = 0; i < s; i++) {
                var n = i + 1
                if(n >= s) n = 0;
                addFace(bottom, base[n], base[i]);
            }
        }

        geo.peak = peak;
        geo.base = base;
        geo.bottom = bottom;

        return geo.refresh();
    }

    geo.refresh = function() {
        var numTris = faces.length;

        for(var i = 0; i < numTris; i++) {
            faces[i].calculateNormal();
        }

        vertices.length = 0;
        normals.length = 0;

        for(var i = 0; i < numTris; i++) {
            faces[i].toArray(SQR.Geometry.VERTEX, vertices);
            faces[i].toArray(SQR.Geometry.NORMAL, normals);
        }

        geo.data(SQR.Geometry.VERTEX, vertices);
        geo.data(SQR.Geometry.NORMAL, normals);
        
        return geo;
    }  

    return geo;
}
