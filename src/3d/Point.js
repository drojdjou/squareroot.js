/**
 * @class
 *
 * Draws a collection of particles on the canvas.
 * The texture of the particle is taken from the geometry.particleTexture[i]
 *
 * @param radius
 */
SQR.Point = function(radius) {

    var p = new SQR.V3();
    var mvp = new SQR.Matrix44();

    /**
     * Draw function in a renderer will take care of drawing the element on screen.
     *
     * This functions role is very similar the shader in WebGL.
     * Inside draw all the vertices are transformed and projected to screen coordinates.
     *
     * For canvas rendering it will invoke the necessary drawing functions, for CSS elements
     * is will update it's style transform property.
     *
     * @param transform the transform being rendered
     * @param uniforms a collection of objects necessary for rendering (ref to canvas, matrices, misc coordinates, etc...)
     */
    this.draw = function(transform, uniforms) {
        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.viewMatrix);

        for (var i = 0; i < geo.vertices.length; i++) {
            geo.vertices[i].copyTo(p);

            mvp.transformVector(p);

            if (p.z < 0) continue;

            p.x = p.x / p.z * uniforms.centerX + uniforms.centerX - radius;
            p.y = p.y / p.z * uniforms.centerY + uniforms.centerY - radius;

            ctx.drawImage(geo.particleTextures[i], p.x, p.y);
        }
    }
}