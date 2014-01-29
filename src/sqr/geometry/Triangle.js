SQR.Triangle = function(a, b, c) {

    var that = this;

    var perVertex = false;
    var indices, elements = false;
    this.normal = new SQR.V3();
    this.depth = 0;

    this.setVertices = function(a, b, c) {
        elements = false;
        this.a = a;
        this.b = b;
        this.c = c;
        this.vertices = [a, b, c];
        return this;
    }

    this.setElements = function(vs, ia, ib, ic) {
        elements = vs;
        indices = [ia, ib, ic];
        that.a = vs[ia];
        that.b = vs[ib];
        that.c = vs[ic];
        return this;
    }

    this.setUV = function(uva, uvb, uvc) {
        that.uva = uva;
        that.uvb = uvb;
        that.uvc = uvc;
        return this;
    }

    this.calculateNormal = function(_perVertex) {
        perVertex = _perVertex;

        var a = SQR.VectorUtil.__tv1;
        var b = SQR.VectorUtil.__tv2;
        var c = SQR.VectorUtil.__tv3;

        a.sub(that.b, that.a);
        b.sub(that.c, that.a);
        that.normal.cross(a, b).norm();

        if(perVertex) {
            saveNormalToVertex(this.a);
            saveNormalToVertex(this.b);
            saveNormalToVertex(this.c);
        }
    }

    var saveNormalToVertex = function(v) {
        if(v.normal) {
            v.normal.add(v.normal, that.normal);
            // console.log("+" + SQR.Stringify.v3(that.normal));
            // console.log("=" + SQR.Stringify.v3(v.normal));
        } else {
            v.normal = that.normal.clone();
        }
    }

    this.toArray = function(vertexArray, normalArray, textureArray) {

        vertexArray = vertexArray || [];
        vertexArray.push(this.a.x, this.a.y, this.a.z, this.b.x, this.b.y, this.b.z, this.c.x, this.c.y, this.c.z);

        if(normalArray) {
            var n;

            if(perVertex) {

                var setTo1 = function(v) {
                    if(v.x > 1) v.x = 1;
                    if(v.x < -1) v.x = -1;

                    if(v.y > 1) v.y = 1;
                    if(v.y < -1) v.y = -1;

                    if(v.z > 1) v.z = 1;
                    if(v.z < -1) v.z = -1;

                    return v;
                }

                setTo1(this.a.normal).norm();
                setTo1(this.b.normal).norm();
                setTo1(this.c.normal).norm();
                
            }

            // console.log("+++");
            // console.log(SQR.Stringify.v3(this.a.normal));
            // console.log(SQR.Stringify.v3(this.b.normal));
            // console.log(SQR.Stringify.v3(this.c.normal));
            // console.log("+++");

            n = (perVertex) ? this.a.normal : that.normal;
            normalArray.push(n.x, n.y, n.z);

            n = (perVertex) ? this.b.normal : that.normal;
            normalArray.push(n.x, n.y, n.z);

            n = (perVertex) ? this.c.normal : that.normal;
            normalArray.push(n.x, n.y, n.z);
        }

        if(textureArray) {
            textureArray.push(this.uva.x, this.uva.y, this.uvb.x, this.uvb.y, this.uvc.x, this.uvc.y);
        }
    }

    this.toElements = function(elementsArray) {
        elementsArray = elementsArray || [];
        elementsArray.push(indices[0], indices[1], indices[2]);
        // Assumes you will create your own vertices and normals arrays (and uv too)
    }

    if(a) this.setVertices(a, b, c);
}






