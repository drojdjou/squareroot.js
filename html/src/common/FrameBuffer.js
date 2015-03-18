/**
 *  @class FrameBuffer
 *  @memberof SQR
 *  
 *  @description A FrameBuffer is used in render-to-texture, image effects and other advances rendering schemes.
 *
 *  @params width The width of the frame buffer
 *  @params height The height of the frame buffer
 */
SQR.FrameBuffer = function(width, height, resolution, isCubemap) {

    resolution = resolution || 1;
    width = width || window.innerWidth;
    height = height || window.innerHeight;

    var f = {}, gl = SQR.gl;

    f.texture = gl.createTexture();
    f.depthBuffer = gl.createRenderbuffer();

    // bind & setup texture
    if(!isCubemap) {
        f.fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
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
    } else {
        // based on http://jsperf.com/webgl-cubemap-fbo-change-face-test
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, f.texture);

        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        for (var i = 0; i < 6; i++) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
    
        gl.bindRenderbuffer(gl.RENDERBUFFER, f.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        
    
        var makeFace = function(index) {
            var fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, f.texture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, f.depthBuffer);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return fbo;
        };

        f.faces = {
            right: makeFace(0),
            left: makeFace(1),
            up: makeFace(2),
            down: makeFace(3),
            front: makeFace(4),
            back: makeFace(5),
        };

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    f.bind = function(name) {
        var fbo = (f.faces) ? f.faces[name] : f.fbo;
        gl.viewport(0, 0, width, height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    }

    f.resize = function(w, h) {
        width = (w * resolution) | 0;
        height = (h * resolution) | 0;

        gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
        gl.bindTexture(gl.TEXTURE_2D, f.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        gl.bindRenderbuffer(gl.RENDERBUFFER, f.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    return f;
}
