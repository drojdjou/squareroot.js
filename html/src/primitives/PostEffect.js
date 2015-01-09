/**
 *  @function createPostEffect
 *  @memberof SQR.Primitives
 *
 *  @description Creates a post-processing effect (such as SAO or depth-of-field). It creares
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

    var pe = new SQR.Transform();
    pe.buffer = SQR.fullScreenQuad;
    pe.shader = SQR.Shader(shaderSource);

    return pe;
}