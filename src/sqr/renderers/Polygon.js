SQR.Polygon = function() {


    var mvp = new SQR.Matrix44();
    var p = new SQR.V3();

    this.draw = function(transform, uniforms) {
        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.globalMatrix);

        var i, t, tris = geo.triangles.length;

        for (i = 0; i < tris; i++) {
            t = geo.triangles[i];
            t.update(mvp, uniforms.centerX, uniforms.centerY);
        }

        geo.triangles.sort(function(a, b) {
            var ad = a.depth;
            var bd = b.depth;
            if (ad < bd) return 1;
            if (ad > bd) return -1;
            return 0;
        });

        for (i = 0; i < tris; i++) {
            t = geo.triangles[i];

            var l = Math.max(0, SQR.V3.dot(t.normal, uniforms.lightDirection));
            var c = t.color.applyLight(l);

            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.moveTo(t.sa.x, t.sa.y);
            ctx.lineTo(t.sb.x, t.sb.y);
            ctx.lineTo(t.sc.x, t.sc.y);
            ctx.closePath();
            ctx.fill();
        }


    }

}