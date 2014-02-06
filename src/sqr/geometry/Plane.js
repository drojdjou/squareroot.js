/*

w = width
h = height
wd = segmetns height
wh = segments width
wo = width offset
wh = height offset 
yup = if true object is on xz plane, if flase - on xy, defaults to false

*/
SQR.Plane = function(options) {

    var vectors = [];
    var faces = [], vertices = [], normals = [], texcoords = [];

    var geo = new SQR.Geometry().quickSetup('v3n3t2');
    var options = options || {};
    
    
    geo.create = function(w, h, wd, hd, wo, ho) {
        geo.width = w;
        geo.height = h;

        var w = w * 0.5;
        var h = h * 0.5;

        var wo = wo || 0;
        var ho = ho || 0;

        var wd = wd || 1;
        var hd = hd || 1;

        faces.length = [];

        var wStart = -w + wo;
        var hStart = -h + ho;

        var wb = geo.width / wd;
        var hb = geo.height / hd;

        var i, j;

        var vCols = [], uvCols = [];

        for (i = 0; i < wd+1; i++) {
            vCols[i] = [];
            uvCols[i] = [];

            for (j = 0; j < hd+1; j++) {
                var bvStart = wStart + i * wb;
                var bhStart = hStart + j * hb;

                uvCols[i][j] = new SQR.V2(i/wd, j/hd);

                if (!options.zUp) {
                    vCols[i][j] = new SQR.V3(bvStart, 0, bhStart);
                } else {
                    vCols[i][j] = new SQR.V3(bvStart, bhStart, 0);
                }

                vectors.push(vCols[i][j]);
            }
        }

        for (i = 0; i < wd; i++) {
            for (j = 0; j < hd; j++) {

                var bvStart = wStart + i * wb;
                var bvEnd = bvStart + wb;
                var bhStart = hStart + j * hb;
                var bhEnd = bhStart + hb;

                var va = vCols[i][j], vb = vCols[i+1][j], vc = vCols[i+1][j+1], vd = vCols[i][j+1];
                var uva = uvCols[i][j], uvb = uvCols[i+1][j], uvc = uvCols[i+1][j+1], uvd = uvCols[i][j+1];

                if(options.quads) {
                    var q = new SQR.Quad(va, vb, vc, vd).setUV(uva, uvb, uvc, uvd);
                    faces.push(q);
                } else {

                    var t1 = new SQR.Triangle();
                    t1.setVertices(va, vb, vc);
                    t1.setAttribute(SQR.Geometry.TEXCOORD, uva, uvb, uvc);

                    var t2 = new SQR.Triangle();
                    t2.setVertices(va, vc, vd);
                    t2.setAttribute(SQR.Geometry.TEXCOORD, uva, uvc, uvd);

                    faces.push(t1, t2);
                }
            }
        }

        return geo.refresh();
    }

    geo.displaceVertices = function(f) {
        var vl = vectors.length;
        for(var i = 0; i < vl; i++) {
            f(vectors[i]);
        }

        return geo.refresh();
    }


    geo.refresh = function() {
        var numTris = faces.length;

        vertices.length = 0;
        normals.length = 0;
        texcoords.length = 0;

        for(var i = 0; i < numTris; i++) {
            faces[i].calculateNormal(options.perVertextNormals);
        }

        for(var i = 0; i < numTris; i++) {
            faces[i].toArray(SQR.Geometry.VERTEX, vertices);
            faces[i].toArray(SQR.Geometry.NORMAL, normals);
            faces[i].toArray(SQR.Geometry.TEXCOORD, texcoords);
        }

        geo.data(SQR.Geometry.VERTEX, vertices);
        geo.data(SQR.Geometry.NORMAL, normals);
        geo.data(SQR.Geometry.TEXCOORD, texcoords);
        
        return geo;
    }  

    return geo;
}



















