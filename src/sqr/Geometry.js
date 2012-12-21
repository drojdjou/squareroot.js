SQR.Geometry = function() {

    /**
     * Array of SQR.V2 or SQR.V3 used as vertices
     */
    this.vertices = null;

    /**
     * Array of SQR.Triangle or SQR.Quad used to define a mesh
     */
    this.polygons = null;

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
     * Use for segments. If a geometry is continous, and closed is true a line will be drawn betwee the last and the first point
     */
    this.closed = false;

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
    if(!this.polygons) this.polygons = [];
    this.polygons.push(new SQR.Triangle(a, b, c, color));
}

SQR.Geometry.prototype.addQuad = function(a, b, c, d, color) {
    if(!this.polygons) this.polygons = [];
    this.polygons.push(new SQR.Quad(a, b, c, d, color));
}

SQR.Geometry.prototype.addSegment = function(a, b, color) {
    if(!this.vertices) this.vertices = [];
    this.vertices.push(a, b);

    if(color) {
        if(!this.colors) this.colors = [];
        this.colors.push(color);
    }
}