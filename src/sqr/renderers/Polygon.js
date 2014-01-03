SQR.Polygon = function() {

    var mvp = new SQR.Matrix44();
    var p = new SQR.V3();

    this.culling = false;
    this.useLight = false;

    var update = function(tri, mvp, centerX, centerY) {
        tri.a.copyTo(tri.sa);
        tri.b.copyTo(tri.sb);
        tri.c.copyTo(tri.sc);

        mvp.transformVector(tri.sa);
        mvp.transformVector(tri.sb);
        mvp.transformVector(tri.sc);

        tri.center.set(0,0,0).add(tri.sa, tri.sb).add(tri.center, tri.sc).mul(1/3);
        tri.depth = tri.center.z;

        tri.sa.x = tri.sa.x / tri.sa.z * centerX + centerX;
        tri.sa.y = tri.sa.y / tri.sa.z * centerY + centerY;

        tri.sb.x = tri.sb.x / tri.sb.z * centerX + centerX;
        tri.sb.y = tri.sb.y / tri.sb.z * centerY + centerY;

        tri.sc.x = tri.sc.x / tri.sc.z * centerX + centerX;
        tri.sc.y = tri.sc.y / tri.sc.z * centerY + centerY;

        tri.calculateNormal();
    }

    this.draw = function(transform, uniforms) {
        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.viewMatrix);

        var i, t, tris = geo.polygons.length;

        for (i = 0; i < tris; i++) {
            t = geo.polygons[i];
            update(t, mvp, uniforms.centerX, uniforms.centerY);
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