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
     * Array of normals per polygon
     */
    this.normals = null;

}

SQR.Geometry.prototype.addTriangle = function(a, b, c, color) {
    if(!this.triangles) this.triangles = [];
    this.triangles.push(new SQR.Triangle(a, b, c, color));
}

SQR.Geometry.prototype.addSegment = function(a, b, color) {
    if(!this.vertices) this.vertices = [];
    if(!this.colors) this.colors = [];

    this.vertices.push(a, b);
    this.colors.push(color);
}