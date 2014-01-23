SQR.Polygon = function(color) {

    var mvp = new SQR.Matrix44();
    var viewForward = new SQR.V3();

    this.culling = true;
    this.useLight = false;

    var update = function(tri, mvp, centerX, centerY) {

        if(!tri.sa) tri.sa = tri.a.clone();
        else tri.a.copyTo(tri.sa);

        if(!tri.sb) tri.sb = tri.b.clone();
        else tri.b.copyTo(tri.sb);

        if(!tri.sc) tri.sc = tri.c.clone();
        else tri.c.copyTo(tri.sc);

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

        viewForward.copyFrom(uniforms.camera.forward);

        for (i = 0; i < tris; i++) {
            t = geo.polygons[i];
            t.calculateNormal();
            transform.normalMatrix.transformVector(t.normal);

            var f = Math.max(0, SQR.V3.dot(t.normal, viewForward));

            if(f < 0 && this.culling) {
                // console.log(SQR.Stringify.v3(viewForward), SQR.Stringify.v3(t.normal), f);
                // continue;
            }

            var l = Math.max(0, SQR.V3.dot(t.normal, uniforms.lightDirection));
            var c = color;
            var lc = SQR.Color.hsl(c.hue, c.saturation, c.lightness - 60 + 50 * l, c.alpha);

            if(this.useLight) {
                ctx.fillStyle = lc;
                ctx.strokeStyle = (f < 0) ? "#00f" : lc;
            } else {
                ctx.fillStyle = c.toHSLString();
                ctx.strokeStyle = (f < 0) ? "#00f" : c.toHSLString();
            }

            ctx.beginPath();
            ctx.moveTo(t.sa.x, t.sa.y);
            ctx.lineTo(t.sb.x, t.sb.y);
            ctx.lineTo(t.sc.x, t.sc.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
}