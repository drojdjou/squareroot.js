SQR.Particle2D = function(r, f, s, prerender) {
    this.radius = r;

    this.transform = new SQR.Matrix2D();

    this.fill = f;
    this.stroke = s;
    this.prerender = false;

    this.setup = function() {
        if (!prerender) return;
        this.prerender = document.createElement('canvas');
        this.prerender.width = this.prerender.height = r * 2;
        var pctx = this.prerender.getContext('2d');
        pctx.clearRect(0, 0, r * 2, r * 2);
        if (f) pctx.fillStyle = f;
        if (s) pctx.strokeStyle = s;
        pctx.beginPath();
        pctx.arc(r, r, r, 0, SQR.twoPI);
        if (f) pctx.fill();
        if (s) pctx.stroke();
    }

    this.setup();
}

SQR.Particle2D.prototype = {

    depth: function() {
        return 0;
    },

    update: function() {

    },

    render: function(engine) {
        var ctx = engine.context;
        var t = this.transform.data;
        var r = this.radius;

        ctx.setTransform(t[0], t[1], t[3], t[4], t[2], t[5]);

        if (this.prerender) {
            ctx.drawImage(this.prerender, -r, -r);
        } else {
            if (this.fill) ctx.fillStyle = this.fill;
            if (this.stroke) ctx.strokeStyle = this.stroke;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, SQR.twoPI);
            ctx.closePath();
            if (this.fill) ctx.fill();
            if (this.stroke) ctx.stroke();
        }
    }
}