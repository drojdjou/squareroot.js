SQR.Quad = function(a, b, c, d, color) {

    var that = this;

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;

    this.color = color;

    this.sa = new SQR.V3();
    this.sb = new SQR.V3();
    this.sc = new SQR.V3();
    this.sd = new SQR.V3();

    this.normal = new SQR.V3();

    this.center = new SQR.V3();
    this.depth = 0;

    var calculateNormal = function() {
        var a = SQR.VectorUtil.__tv1;
        var b = SQR.VectorUtil.__tv2;
        var c = SQR.VectorUtil.__tv3;

        a.sub(that.sa, that.sb);
        b.sub(that.sc, that.sb);
        c.sub(that.sc, that.sd);

        a.cross(a, b);
        c.cross(b, c);

        that.normal.add(a, c).norm();
    }

    this.update = function(mvp, centerX, centerY) {
        this.a.copyTo(this.sa);
        this.b.copyTo(this.sb);
        this.c.copyTo(this.sc);
        this.d.copyTo(this.sd);

        mvp.transformVector(this.sa);
        mvp.transformVector(this.sb);
        mvp.transformVector(this.sc);
        mvp.transformVector(this.sd);

        this.center.set(0,0,0).add(this.sa, this.sb).add(this.center, this.sc).mul(1/3);
        this.depth = this.center.z;

        this.sa.x = this.sa.x / this.sa.z * centerX + centerX;
        this.sa.y = this.sa.y / this.sa.z * centerY + centerY;

        this.sb.x = this.sb.x / this.sb.z * centerX + centerX;
        this.sb.y = this.sb.y / this.sb.z * centerY + centerY;

        this.sc.x = this.sc.x / this.sc.z * centerX + centerX;
        this.sc.y = this.sc.y / this.sc.z * centerY + centerY;

        this.sd.x = this.sd.x / this.sd.z * centerX + centerX;
        this.sd.y = this.sd.y / this.sd.z * centerY + centerY;

        calculateNormal();
    }
}