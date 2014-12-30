/**
 *  Face is a triangle or a quad.
 *  If the face is a quad, both triangles composin the quad,
 *  shader the same normal - thanks to this flat shaded materials have quads shaded
 *  the same way which is nicer than havong each triangle have a slightly different normal.
 *
 *  Currently it supports the following attributes: aPosition, aNormal, aUV.
 *
 *  @class Face
 *  @memberof SQR
 *
 */
SQR.Face = function() {

    var t = {};

    var ap = 'aPosition', an = 'aNormal', au = 'aUV';

    /**
     *  Set the vertex positions. For vertices a, b, c, and d is creates a quad as in the example below.
     *
     *  @method setPosition
     *  @memberof SQR.Face.prototype
     *
     *  @param {SQR.V3} a - the first vertex position
     *  @param {SQR.V3} b - the second vertex position
     *  @param {SQR.V3} c - the thrid vertex position
     *  @param {SQR.V3=} d - the optional fourth vertex position
     *
     *  @example
//
// a - b
// | / |
// c - d  
// 
// resulting triangles: `abc, cbd`
// 
     */
    t.setPosition = function(a, b, c, d) {
        t.a = a; 
        t.b = b; 
        t.c = c;
        t.d = d;
        return t;
    }

    /**
     *  Set the normal shared by all the vertices
     *  @method setNormal
     *  @memberof SQR.Face.prototype 
     */
    t.setNormal = function(n) {
        t.normal = n;
        return t;
    }

    /**
     *  Set the texture coordinates for each vertex
     *
     *  @method setUV
     *  @memberof SQR.Face.prototype 
     *
     *  @param {SQR.V2} a - the first vertex texture coordinate
     *  @param {SQR.V2} b - the second vertex texture coordinate
     *  @param {SQR.V2} c - the thrid vertex texture coordinate
     *  @param {SQR.V2=} d - the optional fourth vertex texture coordinate
     */
    t.setUV = function(uva, uvb, uvc, uvd) {
        t.uva = uva;
        t.uvb = uvb;
        t.uvc = uvc;
        t.uvd = uvd;
        return t;
    }

    /** 
     *  Set the vertex color for each vertex
     *  <br><br>
     *  <strong>WARNING! Colors are not passed to the buffer currently (will be added in the future).</strong>
     *
     *  @method setColor
     *  @memberof SQR.Face.prototype 
     *
     *  @param {SQR.V2} a - the first vertex color
     *  @param {SQR.V2} b - the second vertex color
     *  @param {SQR.V2} c - the thrid vertex color
     *  @param {SQR.V2=} d - the optional fourth vertex color
     */
    t.setColor = function(ca, cb, cc, cd) {
        t.ca = ca;
        t.cb = cb;
        t.cc = cc;
        t.cd = cd;
        return t;
    }

    /**
     *  Calculte the normal for this face. Regardless of whether there are 3 or 4 vertices
     *  the normal is calculated for the frst 3 of them an applied to the entire face.
     *  @method calculateNormal
     *  @memberof SQR.Face.prototype
     */
    t.calculateNormal = function() {
        var t1 = SQR.V3.__tv1;
        var t2 = SQR.V3.__tv2;
        t.normal = new SQR.V3();

        t1.sub(t.a, t.b);
        if(t1.isZero()) t1.sub(t.a, t.d);
        t2.sub(t.c, t.a);
        t.normal.cross(t1, t2);

        return t;
    }

    t.addNormalToVertices = function() {
        t.a.addNormal(t.normal);
        t.b.addNormal(t.normal);
        t.c.addNormal(t.normal);
        if(t.d) t.d.addNormal(t.normal);
        return t;
    }

    t.toBuffer = function(geo, position, perVertextNormal, preNormalizeNormal) {
        var c = position;

        if(geo.attributes[ap]) {
            geo.set(ap, c+0, t.a).set(ap, c+1, t.b).set(ap, c+2, t.c);
            if(t.d) geo.set(ap, c+3, t.c).set(ap, c+4, t.b).set(ap, c+5, t.d);
        }

        if(geo.attributes[an] && (t.normal || perVertextNormal)) {
            var v = perVertextNormal, n = t.normal;

            if(preNormalizeNormal && !v) t.normal.norm();

            geo.set(an, c+0, v ? t.a.normal : n)
               .set(an, c+1, v ? t.b.normal : n)
               .set(an, c+2, v ? t.c.normal : n);

            if(t.d) {
                geo.set(an, c+3, v ? t.c.normal : n)
                   .set(an, c+4, v ? t.b.normal : n)
                   .set(an, c+5, v ? t.d.normal : n);
            }
        }

        if(geo.attributes[au] && t.uva) {
            geo.set(au, c+0, t.uva).set(au, c+1, t.uvb).set(au, c+2, t.uvc);
            if(t.d) geo.set(au, c+3, t.uvc).set(au, c+4, t.uvb).set(au, c+5, t.uvd);
        }

        return t.d ? 6 : 3;
    }

    return t;
}