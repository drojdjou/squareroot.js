SQR.Texture = function(s) {

	var t = {};
	var gl = SQR.gl;
	var source = s;
	var texture = gl.createTexture();

	t.isAnimated = false;

	var isPowerOfTwo = function() {
        var x = source.width, y = source.height;
        return x > 0 && y > 0 && (x & (x - 1)) == 0 && (y & (y - 1)) == 0;
    }

	t.update = function() {
		var gl = SQR.gl;
		gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return t;
	}

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    if(isPowerOfTwo()) gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    t.tex = texture;

	return t;

}