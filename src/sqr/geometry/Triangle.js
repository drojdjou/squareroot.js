SQR.Triangle = function(a, b, c) {

    var that = this;

    this.a = a;
    this.b = b;
    this.c = c;
    
    this.sa = new SQR.V3();
    this.sb = new SQR.V3();
    this.sc = new SQR.V3();
    this.normal = new SQR.V3();

    // ?
    this.center = new SQR.V3();
    this.depth = 0;

    this.calculateNormal = function() {
        var a = SQR.VectorUtil.__tv1;
        var b = SQR.VectorUtil.__tv2;

        a.sub(that.a, that.b);
        b.sub(that.a, that.c);

        that.normal.cross(a, b).norm();
    }

    this.toArray = function(vertexArray, normalArray) {
        vertexArray = vertexArray || [];
        vertexArray.push(this.a.x, this.a.y, this.a.z, this.b.x, this.b.y, this.b.z, this.c.x, this.c.y, this.c.z);

        if(normalArray) {
            var n = that.normal;
            normalArray.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
        }
    }
}