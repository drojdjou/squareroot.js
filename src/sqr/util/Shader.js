SQR.Shader = function(gl) {

	var that = this;

	this.program = null;

	this.compile = function(vertex, fragment) {
		var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertex);
        gl.compileShader(vs);
         
        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragment);
        gl.compileShader(fs);
         
        this.program = gl.createProgram();
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);

        if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) console.error("SHADER COMPILE ERROR", gl.getShaderInfoLog(vs));
        if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) console.error("SHADER COMPILE ERROR", gl.getShaderInfoLog(fs));
        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) console.error("SHADER LINKING ERROR", gl.getProgramInfoLog(this.program));
	}

	this.isReady = function() {
		return this.program !== null;
	}

	this.load = function(src, callback) {
		SQR.Loader.loadShader(src, function(vertex, fragment) {
	        that.compile(vertex, fragment);
	        that.program.uColor = gl.getUniformLocation(that.program, "uColor");
	        that.program.uMatrix = gl.getUniformLocation(that.program, "uMatrix");
	        that.program.uProjection = gl.getUniformLocation(that.program, "uProjection");
	        if(callback) callback();
		});
	}
}