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

        a.sub(that.sa, that.sb);
        b.sub(that.sa, that.sc);

        that.normal.cross(a, b).norm();
    }
}