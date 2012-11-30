SQR.Segment = function(thickness) {
    var that = this;

    this.culling = false;

    var ps = new SQR.V3();
    var pe = new SQR.V3();
    var mvp = new SQR.Matrix44();

    var front = new SQR.V3(0, 0, 1);
    var dir = new SQR.V3();

    var drawLine = function(ctx, a, b, cx, cy) {
        mvp.transformVector(a);
        mvp.transformVector(b);

        if (a.z < 0 || b.z < 0) return;

        dir.sub(a, b).norm();
        if (SQR.V3.dot(dir, front) < 0 && that.culling) return;

        a.x = a.x / a.z * cx + cx;
        a.y = a.y / a.z * cy + cy;

        b.x = b.x / b.z * cx + cx;
        b.y = b.y / b.z * cy + cy;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }


    this.draw = function(transform, uniforms) {

        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.globalMatrix);

        var numVertices = geo.vertices.length;

        for (var i = 0; i < numVertices; i++) {
            if( (!geo.continous && i % 2 == 1) || (geo.continous && i == numVertices - 1) ) continue;

            geo.vertices[i].copyTo(ps);
            geo.vertices[i + 1].copyTo(pe);

            ctx.strokeStyle = (geo.colors) ? geo.colors[ i / 2 | 0 ] : geo.color;
            ctx.lineWidth = thickness;

            ctx.beginPath();

            drawLine(ctx, ps, pe, uniforms.centerX, uniforms.centerY);
            ctx.stroke();
        }
    }
}