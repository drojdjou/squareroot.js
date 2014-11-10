SQR.Triangle = function() {

    var t = {};
    
    t.setPosition = function(a, b, c) {
        t.a = a, t.b = b, t.c = c;
        return t;
    }

    t.setNormal = function(n) {
        t.normal = n;
        return t;
    }

    t.setNormalVertex = function(na, nb, nc) {

    }

    t.setUV = function(uva, uvb, uvc) {
        t.uva = uva, t.uvb = uvb, t.uvc = uvc;
        return t;
    }

    t.setCustom = function(name, data) {

    }

    t.calculateNormal = function() {
        var t1 = SQR.V3.__tv1;
        var t2 = SQR.V3.__tv2;
        t.normal = new SQR.V3();

        t1.sub(t.b, t.a);
        t2.sub(t.c, t.a);
        t.normal.cross(t1, t2).norm();
        return t;
    }

    t.toBuffer = function(geo, position) {
        var c = position * 3;

        if(geo.attributes['aPosition']) {
            geo.set('aPosition', c+0, t.a);
            geo.set('aPosition', c+1, t.b);
            geo.set('aPosition', c+2, t.c);
        }

        if(geo.attributes['aNormal'] && t.normal) {
            geo.set('aNormal', c+0, t.normal);
            geo.set('aNormal', c+1, t.normal);
            geo.set('aNormal', c+2, t.normal);
        }

        if(geo.attributes['aUV'] && t.uva) {
            geo.set('aUV', c+0, t.uva);
            geo.set('aUV', c+1, t.uvb);
            geo.set('aUV', c+2, t.uvc);
        }

        return t;
    }

    return t;
}