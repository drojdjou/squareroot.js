SQR.Geometry = function() {

    /**
     * Array of SQR.2D or SQR.3D used as vertices
     */
    this.vertices = null;

    /**
     * Array of SQR.Face used to secribe a triangle mesh
     */
    this.triangles = null;

    /**
     * Array or numbers or color strings used to define color per-vertex
     */
    this.colors = null;

    /**
     * Array or <img> or <canvas> elements use as texture per-vertex
     */
    this.particleTextures = null;

    /**
     * Array of normals per polygon or per vertex
     */
    this.normals = null;

    /**
     * Array of tangents per vertex or point (ex in case of curves)
     */
    this.tangents = null;

    /**
     * Use for segments. If continous = true it will draw lines
     * from vertices[0] to vertices[1], vertices[1] to vertices[2], etc...
     *
     * Otherwise, by default, lines are draw using pairs of vertices
     * vertices[0] to vertices[1], vertices[2] to vertices[3], etc...
     */
    this.continous = false;

    /**
     * Instead of using per vertex colors from the color array,
     * the renderer can use a single color defined in this variable.
     *
     * Note: colors array override the single color setting, in order for this to be used
     * colors must be null.
     */
    this.color = null
}

SQR.Geometry.prototype.addTriangle = function(a, b, c, color) {
    if(!this.triangles) this.triangles = [];
    this.triangles.push(new SQR.Triangle(a, b, c, color));
}

SQR.Geometry.prototype.addSegment = function(a, b, color) {
    if(!this.vertices) this.vertices = [];
    this.vertices.push(a, b);

    if(color) {
        if(!this.colors) this.colors = [];
        this.colors.push(color);
    }
}