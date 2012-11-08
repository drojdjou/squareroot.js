/**
 * Based on http://www.math.tamu.edu/~romwell/arcball_js/arcball.pde
 *
 * @param mx mouse X position in range [ -1 , 1 ]
 * @param my mouse Y position in range [ -1 , 1 ]
 * @param radius of the arc ball for interaction. Default value: 0.5
 */
SQR.MathUtil = {
    mouseToUnitSphereVector: function(mx, my, gr, v) {
        gr = gr || 0.5;
        v = v || new SQR.V3();

        var px = mx / gr;
        var py = my / gr;
        var rl = px * px + py * py;

        if (rl >= 1) {
            v.set(px, py, 0);
        } else {
            v.set(px, py, Math.sqrt(1 - rl));
        }

        v.norm();

        return v;
    }
}