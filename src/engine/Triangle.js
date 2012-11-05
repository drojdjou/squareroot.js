SQR.Triangle = function(a, b, c, color) {

    this.a = a;
    this.b = b;
    this.c = c;
    this.color = color;

    this.sa = new SQR.V3();
    this.sb = new SQR.V3();
    this.sc = new SQR.V3();

    this.center = new SQR.V3();
    this.depth = 0;

    this.update = function(mvp, centerX, centerY) {
        this.a.copyTo(this.sa);
        this.b.copyTo(this.sb);
        this.c.copyTo(this.sc);

        mvp.transformVector(this.sa);
        mvp.transformVector(this.sb);
        mvp.transformVector(this.sc);

        this.center.set(0,0,0).add(this.sa, this.sb).add(this.center, this.sc).mul(1/3);
        this.depth = this.center.z;

        this.sa.x = this.sa.x / this.sa.z * centerX + centerX;
        this.sa.y = this.sa.y / this.sa.z * centerY + centerY;

        this.sb.x = this.sb.x / this.sb.z * centerX + centerX;
        this.sb.y = this.sb.y / this.sb.z * centerY + centerY;

        this.sc.x = this.sc.x / this.sc.z * centerX + centerX;
        this.sc.y = this.sc.y / this.sc.z * centerY + centerY;
    }
}