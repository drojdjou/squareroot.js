/**
 *  @class Texture
 *  @memberof SQR
 *
 *  @description Represents a WebGL texture created from an Image, Video or Canvas element.
 */
SQR.Texture = function(_source, _options) {

	var t = {};
	var gl = SQR.gl;
	var source, options = _options || {};

	t.setSource = function(_source, _options) {
		
		if(!(
			_source instanceof HTMLVideoElement || 
			_source instanceof Image || 
			_source instanceof HTMLCanvasElement || 
			('ImageBitmap' in window && _source instanceof window.ImageBitmap)
		)) {
			console.error('Invalid source: ' + _source);
			throw 'SQR.Texture > provided source is not a valid source for texture';
		}

		source = _source;
		options = _options || options;
		
		var wrapS = options.wrapS || options.wrap;
		var wrapT = options.wrapT || options.wrap;

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, options.flip !== undefined ? options.flip : true);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlpha !== undefined ? options.premultiplyAlpha : false);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

		var mif, mgf;

		if(isPowerOfTwo()) {
			if(options.mipmap) gl.generateMipmap(gl.TEXTURE_2D);
			mif = options.mipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR;
			mgf = gl.LINEAR;
			// if(!wrapS) wrapS = gl.REPEAT;
			// if(!wrapT) wrapT = gl.REPEAT;
		} else {
			// if(options.mipmap) console.warn('Only power-of-2 texture can use mipmaps\n', _source);
			mif = mgf = gl.LINEAR;
			// if(!wrapS) wrapS = gl.CLAMP_TO_EDGE;
			// if(!wrapT) wrapT = gl.CLAMP_TO_EDGE;
		}

		if(!wrapS) wrapS = gl.CLAMP_TO_EDGE;
		if(!wrapT) wrapT = gl.CLAMP_TO_EDGE;

		if(options.aniso) {
			var aniso = (
				gl.getExtension('EXT_texture_filter_anisotropic') ||
				gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
				gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
			);

			if(aniso) {
				var m = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
				var v = options.anisoLevel || 16;
				v = Math.min(m, v);
				gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, v);
			}
		}

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, options.magFilter || options.filter || mgf);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options.minFilter || options.filter || mif);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
		gl.bindTexture(gl.TEXTURE_2D, null);

		t.isAnimated = (options && options.isAnimated) || (_source instanceof HTMLVideoElement);
		return t;
	}

	var isPowerOfTwo = function() {
		var x = source.width, y = source.height;
		return x > 0 && y > 0 && (x & (x - 1)) == 0 && (y & (y - 1)) == 0;
	}

	t.getSource = function() {
		return source;
	}

	t.setParameter = function(key, value) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, key, value);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	t.update = function() {
		var gl = SQR.gl;
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, options.flip !== undefined ? options.flip : true);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlpha !== undefined ? options.premultiplyAlpha : false);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
		return t;
	}

	t.destroy = function() {
		gl.deleteTexture(t.tex);
	}

	var texture = gl.createTexture();
	t.tex = texture;

	if(_source) {
		t.setSource(_source, _options);
	}

	return t;

}