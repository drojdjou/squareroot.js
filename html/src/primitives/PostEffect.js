/**
 *  @function createPostEffect
 *  @memberof SQR.Primitives
 *
 *  @description Creates a post-processing effect (such as SAO or depth-of-field). It creates
 *	an instance of SQR.Transform with a full screen quad buffer and the shader build from the provided source.
 *	Please read the {@tutorial post-effects} tutorial to see how it works. 
 *
 *	@param {string} shaderSource - the source of the shader for this post effect
 *	@param {Object=} shaderOptions - options for the shader. Same as in the {@link SQR.Shader} constructor
 *
 *	@returns {SQR.Transform} a transform representing this post effect
 */
SQR.Primitives.createPostEffect = function(shaderSource, shaderOptions) {
    SQR.fullScreenQuad = SQR.fullScreenQuad || SQR.Buffer()
        .layout(SQR.v2u2(), 6)
        .data('aPosition', -1, 1,   1, 1,   1, -1,   -1, 1,   1, -1,   -1, -1)
        .data('aUV',        0, 1,   1, 1,   1,  0,    0, 1,   1,  0,    0,  0)
        .update();

    var pe = new SQR.Transform('post-effect');
    pe.buffer = SQR.fullScreenQuad;
    pe.shader = SQR.Shader(shaderSource, shaderOptions);

    return pe;
}


SQR.Primitives.createImage = function(img, mode, shaderSource, shaderOptions) {

	if(!shaderSource && !SQR.GLSL) throw '> SQR.Primitives.createImage > sqr-glsl.js package is required to use this feature.';
    shaderSource = shaderSource || SQR.GLSL['post/image.glsl'];

	var pe = new SQR.Transform();

    pe.buffer = SQR.Buffer()
        .layout(SQR.v2u2(), 6)
        .data('aPosition', -1, 1,   1, 1,   1, -1,   -1, 1,   1, -1,   -1, -1)
        .data('aUV',        0, 1,   1, 1,   1,  0,    0, 1,   1,  0,    0,  0)
        .update();

    var image = img;
    var texture = SQR.Texture(image);
    pe.shader = SQR.Shader(shaderSource, shaderOptions);

    pe.setImage = function(img) {
        image = img;
        texture.setSource(img).update();
        pe.shader.use().setUniform('uTexture', texture);
    }

    pe.setImage(image);

    pe.size = function(w, h) {

        var xl = -1, yt = 1, xr = 1, yb = -1;
        var iw = image.width, ih = image.height;

        var fw = iw / ih * h;
        var fh = ih / iw * w;

        if(mode == 'fit') {
            if(fw > w) {
                yb = -(fh / h);
                yt =  (fh / h);
            }

            if(fh > h) {
                xl = -(fw / w);
                xr =  (fw / w);
            }
        } else if(mode == 'cover') {    
            if(fw > w) {
                xl = -(fw / w);
                xr =  (fw / w);
            }

            if(fh > h) {
                yb = -(fh / h);
                yt =  (fh / h);
            }
        }

        pe.buffer.data('aPosition', 
            xl, yt,
            xr, yt,
            xr, yb,

            xl, yt,
            xr, yb,
            xl, yb
        ).update();

        return pe;
    }

	return pe;
}








