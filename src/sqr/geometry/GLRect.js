SQR.GLRect = function(width, height) {

	var that = this;

	this.width = width;
	this.height = height;

	this.vertexSize = 2;
	this.numVertices = 6;

	var vertices = new Float32Array(12);

	this.getVertices = function(x, y) {
		var w = this.width, h = this.height;

		vertices[0] = w * -0.5;
		vertices[1] = h * 0.5;
		vertices[2] = w * 0.5;
		vertices[3] = h * 0.5;
		vertices[4] = w * 0.5;
		vertices[5] = h * -0.5;

		vertices[6] = w * -0.5;
		vertices[7] = h * 0.5;
		vertices[8] = w * 0.5;
		vertices[9] = h * -0.5;
		vertices[10] = w * -0.5;
		vertices[11] = h * -0.5;

		return vertices; 
	}
}