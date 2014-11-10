/**
    Creates a new FrameBuffer

    @class A FrameBuffer is used in render-to-texture, image effects and other advances rendering schemes.

    @params width The width of the frame buffer

    @params height The width of the frame buffer
 */
SQR.FrameBuffer = function(width, height, resolution) {

    resolution = resolution || 1;

    width = (width * resolution) | 0;
    height = (height * resolution) | 0;
    
    var f = {}, gl = SQR.gl;

    f.fbo = gl.createFramebuffer();
    f.texture = gl.createTexture();
    f.depthBuffer = gl.createRenderbuffer();

    // bind fbo
    gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);

    // bind & setup texture
    gl.bindTexture(gl.TEXTURE_2D, f.texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    // bind render buffer
    gl.bindRenderbuffer(gl.RENDERBUFFER, f.depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

    // attach texture and render buffer to fbo
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, f.texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, f.depthBuffer);

    // unbind all
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    f.bind = function() {
        gl.viewport(0, 0, width, height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
    }

    return f;
}
