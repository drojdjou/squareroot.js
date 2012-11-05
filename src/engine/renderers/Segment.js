SQR.Segment = function(thickness) {

    var ps = new SQR.V3();
    var pe = new SQR.V3();
    var mvp = new SQR.Matrix44();

    var front = new SQR.V3(0, 0, 1);
    var dir = new SQR.V3();

    this.draw = function(transform, uniforms) {
        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.globalMatrix);

        //var r = 0;

        for (var i = 0; i < geo.vertices.length; i += 2) {
            geo.vertices[i].copyTo(ps);
            geo.vertices[i + 1].copyTo(pe);

            mvp.transformVector(ps);
            mvp.transformVector(pe);

            if (ps.z < 0 || pe.z < 0) continue;

            dir.sub(ps, pe).norm();
            if (SQR.V3.dot(dir, front) < 0.25) continue;
            
            //r++;

            ps.x = ps.x / ps.z * uniforms.centerX + uniforms.centerX;
            ps.y = ps.y / ps.z * uniforms.centerY + uniforms.centerY;

            pe.x = pe.x / pe.z * uniforms.centerX + uniforms.centerX;
            pe.y = pe.y / pe.z * uniforms.centerY + uniforms.centerY;

            //console.log(ctx, ps.x, ps.y, pe.x, pe.y, geo.vertexColors[ i/2 | 0 ], thickness);

            ctx.strokeStyle = geo.colors[ i / 2 | 0 ];
            ctx.lineWidth = thickness;
            ctx.beginPath();
            ctx.moveTo(ps.x, ps.y);
            ctx.lineTo(pe.x, pe.y);
            // ctx.closePath();
            ctx.stroke();
        }

        //document.getElementById('debug').innerHTML = "Lines rendered: " + r;
    }
}