SQR.Quad = function(t1, t2) {

    var that = this;

    this.normal = t1.a.clone();

    var perVertex = false;

    this.calculateNormal = function(_perVertex) {
        perVertex = _perVertex;
        t1.calculateNormal(_perVertex);
        t2.calculateNormal(_perVertex);
        that.normal.add(t1.normal, t2.normal).norm();
    }

    this.toArray = function(vertexArray, normalArray) {
        if(perVertex) {
            t1.toArray(vertexArray, normalArray);
            t2.toArray(vertexArray, normalArray);
        } else {
            t1.toArray(vertexArray);
            t2.toArray(vertexArray);

            if(normalArray) {
                var n = that.normal;
                var c = 6;
                while(c-- > 0) normalArray.push(n.x, n.y, n.z);
            }
        }
    }
}

SQR.Quad.fullscreen = function() {
    var c = {}
    c.vertexSize = 2;
    c.numVertices = 6;
    c.vertices = new Float32Array([-1, 1,     1, 1,     1, -1,     -1, 1,     1, -1,     -1, -1]);
    c.textureCoord = new Float32Array([0, 1,     1, 1,     1, 0,     0, 1,     1, 0,    0, 0]);
    return c;
}





