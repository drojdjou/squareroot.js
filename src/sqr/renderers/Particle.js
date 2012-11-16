SQR.Particle = function(radius, fill, stroke) {

    var p = new SQR.V3();
    var mvp = new SQR.Matrix44();

    this.draw = function(transform, uniforms) {
        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.globalMatrix);

        for (var i = 0; i < geo.vertices.length; i++) {
            geo.vertices[i].copyTo(p);

            mvp.transformVector(p);

            if(p.z < 0) continue;

            p.x = p.x / p.z * uniforms.centerX + uniforms.centerX - radius;
            p.y = p.y / p.z * uniforms.centerY + uniforms.centerY - radius;

            ctx.drawImage(geo.particleTextures[i], p.x, p.y);
        }
    }

}