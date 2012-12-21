SQR.Polygon = function() {

    var mvp = new SQR.Matrix44();
    var p = new SQR.V3();

    this.culling = false;
    this.useLight = false;

    this.draw = function(transform, uniforms) {
        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.globalMatrix);

        var i, t, tris = geo.polygons.length;

        for (i = 0; i < tris; i++) {
            t = geo.polygons[i];
            t.update(mvp, uniforms.centerX, uniforms.centerY);
        }

        geo.polygons.sort(function(a, b) {
            var ad = a.depth;
            var bd = b.depth;
            if (ad < bd) return 1;
            if (ad > bd) return -1;
            return 0;
        });

        for (i = 0; i < tris; i++) {
            t = geo.polygons[i];

            var f = Math.max(0, SQR.V3.dot(t.normal, SQR.V3.forward));

            if(f > 0 && this.culling) continue;

            var l = Math.max(0, SQR.V3.dot(t.normal, uniforms.lightDirection));

            var c = t.color || geo.color;

            if(this.useLight) ctx.fillStyle = c.applyLight(l);
            else ctx.fillStyle = c.toHSLString();

            if(this.useLight) ctx.strokeStyle = c.applyLight(l);
            else ctx.strokeStyle = c.toHSLString();
            
            ctx.beginPath();
            ctx.moveTo(t.sa.x, t.sa.y);
            ctx.lineTo(t.sb.x, t.sb.y);
            ctx.lineTo(t.sc.x, t.sc.y);
            if(t.sd) ctx.lineTo(t.sd.x, t.sd.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
}