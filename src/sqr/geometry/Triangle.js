SQR.Triangle = function(a, b, c) {

    var that = this;

    this.a = a;
    this.b = b;
    this.c = c;
    
    this.sa = new SQR.V3();
    this.sb = new SQR.V3();
    this.sc = new SQR.V3();

    var perVertex = false;
    this.normal = new SQR.V3();

    // ?
    this.center = new SQR.V3();
    this.depth = 0;

    this.calculateNormal = function(_perVertex) {
        perVertex = _perVertex;

        var a = SQR.VectorUtil.__tv1;
        var b = SQR.VectorUtil.__tv2;

        a.sub(that.a, that.b);
        b.sub(that.a, that.c);

        that.normal.cross(a, b).norm();

        if(perVertex) {
            saveNormalToVertex(this.a);
            saveNormalToVertex(this.b);
            saveNormalToVertex(this.c);
        }
    }

    var saveNormalToVertex = function(v) {
        if(v.normal) {
            v.normal.add(v.normal, that.normal).norm();
        } else {
            v.normal = that.normal.clone();
        }
    }

    this.toArray = function(vertexArray, normalArray) {
        vertexArray = vertexArray || [];
        vertexArray.push(this.a.x, this.a.y, this.a.z, this.b.x, this.b.y, this.b.z, this.c.x, this.c.y, this.c.z);


        if(normalArray) {
            var n;

            n = (perVertex) ? this.a.normal : that.normal;
            normalArray.push(n.x, n.y, n.z);

            n = (perVertex) ? this.b.normal : that.normal;
            normalArray.push(n.x, n.y, n.z);

            n = (perVertex) ? this.c.normal : that.normal;
            normalArray.push(n.x, n.y, n.z);
        }
    }
}






