SQR.Particle2D = function(texture) {

    this.transform = new SQR.Matrix2D();
    this.texture = texture;
    this.width = texture.width;
    this.height = texture.height;

    this.position = new SQR.V2(0, 0);
    this.rotation = 0;
    this.scale = new SQR.V2(1, 1);
}

SQR.Particle2D.prototype = {

    render: function(ctx) {
        var p = this.position;
        var r = this.rotation;
        var s = this.scale;

        this.transform.setTRS(p.x, p.y, r, s.x, s.y);

        var t = this.transform.data;
        ctx.setTransform(t[0], t[1], t[3], t[4], t[2], t[5]);
        ctx.drawImage(this.texture, this.width * -0.5, this.height * -0.5);
    }
}