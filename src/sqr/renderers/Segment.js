SQR.Segment = function(thickness) {
    var that = this;

    this.culling = false;

    var ps = new SQR.V3();
    var pe = new SQR.V3();
    var mvp = new SQR.Matrix44();

    var front = new SQR.V3(0, 0, 1);
    var dir = new SQR.V3();

    var project = function(a, b, cx, cy) {
        mvp.transformVector(a);
        mvp.transformVector(b);

        if (a.z < 0 || b.z < 0) return false;

        dir.sub(a, b).norm();
        if (SQR.V3.dot(dir, front) < 0 && that.culling) return false;

        a.x = a.x / a.z * cx + cx;
        a.y = a.y / a.z * cy + cy;

        b.x = b.x / b.z * cx + cx;
        b.y = b.y / b.z * cy + cy;

        return true;
    }

    var drawLine = function(ctx, a, b, m, ctn) {

        if (!ctn) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        } else {
            if (m) ctx.moveTo(a.x, a.y);
            else ctx.lineTo(a.x, a.y);
        }
    }


    this.draw = function(transform, uniforms) {

        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.viewMatrix);

        var numVertices = geo.vertices.length;

        if (geo.continous) {
            ctx.beginPath();
        }

        for (var i = 0; i < numVertices; i++) {
            if (
                (!geo.continous && i % 2 == 1)
                    ||
                    (geo.continous && !geo.closed && i == numVertices - 1)
                ) {
                continue;
            }

            var n = (i == numVertices - 1) ? 0 : i + 1;

            geo.vertices[i].copyTo(ps);
            geo.vertices[n].copyTo(pe);

            var c = (geo.colors) ? geo.colors[ i / 2 | 0 ] : geo.color;

            ctx.strokeStyle = c.toHSLString();
            ctx.lineWidth = thickness;

            var canDraw = project(ps, pe, uniforms.centerX, uniforms.centerY);

            if(canDraw) drawLine(ctx, ps, pe, i == 0, geo.continous);
        }

        if (geo.continous) {
            if (geo.closed) ctx.closePath();
            ctx.stroke();
        }
    }
}