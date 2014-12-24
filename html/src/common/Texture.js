SQR.Texture = function(s, options) {

    options = options || {};

    if(!(s instanceof HTMLVideoElement || s instanceof Image || s instanceof HTMLCanvasElement)) {
        console.error('Invalid source: ' + s);
        throw 'SQR.Texture > provided source is not a valid source for texture';
    }

	var t = {};
	var gl = SQR.gl;
	var source = s;
	var texture = gl.createTexture();

	t.isAnimated = (options && options.isAnimated) || (s instanceof HTMLVideoElement);

	var isPowerOfTwo = function() {
        var x = source.width, y = source.height;
        return x > 0 && y > 0 && (x & (x - 1)) == 0 && (y & (y - 1)) == 0;
    }

	t.update = function() {
		var gl = SQR.gl;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        return t;
	}

    var wrapS = options.wrapS || options.wrap || gl.CLAMP_TO_EDGE;
    var wrapT = options.wrapT || options.wrap || gl.CLAMP_TO_EDGE;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

    var mif, mgf;

    if(isPowerOfTwo()) {
        gl.generateMipmap(gl.TEXTURE_2D);
        mif = gl.LINEAR_MIPMAP_LINEAR, mgf = gl.LINEAR;
    } else {
        mif = mgf = gl.LINEAR;
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mgf);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mif);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.bindTexture(gl.TEXTURE_2D, null);

    t.tex = texture;

	return t;

}