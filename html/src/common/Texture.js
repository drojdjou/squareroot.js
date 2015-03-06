/**
 *  @class Texture
 *  @memberof SQR
 *
 *  @description Represents a WebGL texture created from an Image, Video or Canvas element.
 */
SQR.Texture = function(_source, options) {

    options = options || {};

    

	var t = {};
	var gl = SQR.gl;

	var source;

    t.setSource = function(_source) {

        if(!(_source instanceof HTMLVideoElement || _source instanceof Image || _source instanceof HTMLCanvasElement)) {
            console.error('Invalid source: ' + s);
            throw 'SQR.Texture > provided source is not a valid source for texture';
        }

        source = _source;

        t.isAnimated = (options && options.isAnimated) || (_source instanceof HTMLVideoElement);
        
        return t;
    }

    t.setSource(_source);

	var texture = gl.createTexture();

	

	var isPowerOfTwo = function() {
        var x = source.width, y = source.height;
        return x > 0 && y > 0 && (x & (x - 1)) == 0 && (y & (y - 1)) == 0;
    }

	t.update = function() {
		var gl = SQR.gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
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