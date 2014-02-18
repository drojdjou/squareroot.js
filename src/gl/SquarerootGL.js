/**
 * @class
 *
 * The engine for GL rendering.
 *
 * @param canvas
 */
SQR.SquarerootGL = function(canvas) {
	var uniforms = {};

    var gl = canvas.getContext(SQR.GL.contextString);
    var currentFrameBuffer, currentClearColor;

    SQR.GL.init(gl);

    /**
     *  Set the clear color.
     *  @param r {number} red component 0-1
     *  @param g {number} green component 0-1
     *  @param b {number} blue component 0-1
     *  @param a {number} alpha component 0-1
     *  @todo set the parameter to {SQR.Color}
     */
    this.setClearColor = function(r, g, b, a) {
        currentClearColor = [r, g, b, a];
        gl.clearColor(r, g, b, a);
    }

    /**
     *  Set the projection matrix. 
     *  @param matrix {@link SQR.ProjectionMatrix}
     */
    this.setProjection = function(matrix) {
        uniforms.projection = matrix;
    }

    /**
     *  Sets the size of the underlying canvas element.
     */
    this.setSize = function(w, h) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    /**
     *  Returns an instance of {SQR.Texture}
     *  @param source {string} path to the image
     *  @param params {object} texture parameters
     */
    this.createTexture = function(source, params) {
        return new SQR.Texture(gl, source, params);
    }

    /**
     *  Returns an instance of {SQR.Cubemap}
     *  @param source {string} path to the image
     *  @param params {object} texture parameters
     */
    this.createCubemap = function(source, params) {
        return new SQR.Cubemap(gl, source, params);
    }

    /**
     *  Returns an instance of {SQR.Shader}
     */
    this.createShader = function() {
        return new SQR.Shader(gl);
    }

    /**
     *  Returns an instance of {SQR.WebGL}
     *  @param shader {SQR.Shader} the shader to use with this renderer
     */
    this.createRenderer = function(shader) {
        return new SQR.WebGL(gl, shader);
    }

    /**
     *  Returns an instance of {SQR.FrameBuffer}
     *  @param w the width of the frame buffer
     *  @param h the height of the frame buffer
     */
    this.createFrameBuffer = function(w, h) {
        return new SQR.FrameBuffer(gl, w || window.innerWidth, h || window.innerHeight);
    }

    var opaqueObjects = [], transparentObjects = [];

    var updateTransform = function(t) {
        t.transformWorld();

        if(t.renderer && t.enabled) {
            if(t.renderer.transparent) transparentObjects.push(t);
            else opaqueObjects.push(t);
        }
        

        if (t.numChildren > 0) {
            for (var i = 0; i < t.numChildren; i++) {
                updateTransform(t.children[i]);
            }
        }
    }

    /**
     *  Clear the engine before rendering the next screen.
     */
    this.clear = function(options) {
        if(options.region) {
            var r = options.region;
            gl.viewport(r.x, r.y, r.w, r.h);
            gl.scissor(r.x, r.y, r.w, r.h);
            gl.enable(gl.SCISSOR_TEST);
        } else {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.disable(gl.SCISSOR_TEST);
        }

        if(!options.target || (currentFrameBuffer && currentFrameBuffer != options.target)) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            currentFrameBuffer = null;
        }

        if(options.target) {
            currentFrameBuffer = options.target;
            gl.bindFramebuffer(gl.FRAMEBUFFER, options.target.fbo);
        }

        if (options.clearColor) {
            var c = options.clearColor;
            gl.clearColor(c[0], c[1], c[2], c[3]);
        }

        (options.dontClear) ? '' : gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        (options.culling) ? gl.enable(gl.CULL_FACE) : gl.disable(gl.CULL_FACE);
        (options.reverseFace) ? gl.frontFace(gl.CCW) : gl.frontFace(gl.CW);

        if (options.clearColor) {
            var c = currentClearColor;
            this.setClearColor(c[0], c[1], c[2], c[3]);
        }
    }

    var defaultOptions = {
        region: null,
        dontClear: false,
        culling: true,
        reverseFace: false
    }

    /**
     *  Render the scene.
     *  @param scene {SQR.Transform} the scene to render
     *  @param camera {SQR.Transform} the transform that represents the camera. That transform doesn't have to be anything special - any transform will do.
     *  @param options {Object} options to the renderer
     *  @param options.region {SQR.RenderRegion} the region in which to render the scene. Defaults to full screen
     *  @param options.dontClear {boolean} if set to true will not clear the previous content. Defaults to false.
     *  @param options.culling {boolean} if set to true will to cull triangles. Defaults to true
     *  @param options.reverseFace {boolean} if set to true will render faces counterclockwise. Defaults to false and render clockwise. 
     *      Effect is only visible if culling is set to true. 
     *  @param options.replacementShader {SQR.Shader} the shader to use as replacement for all shaders in the scene.
     *
     */
    this.render = function(scene, camera, options) {
        var i, l, c;

        options = options || defaultOptions;

        this.clear(options);

        opaqueObjects.length = 0, transparentObjects.length = 0;

        updateTransform(scene);

        if(camera) {
            uniforms.camera = camera;
            uniforms.viewMatrix = camera.computeInverseMatrix();
        }

        uniforms.replacementShader = options.replacementShader || null;

        l = opaqueObjects.length;

        gl.enable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        
        for (i = 0; i < l; i++) {
            c = opaqueObjects[i];
            c.renderer.draw(c, uniforms);
        }

        l = transparentObjects.length;

        if(l == 0) return;

        gl.enable(gl.BLEND);

        for (i = 0; i < l; i++) {
            c = transparentObjects[i];

            var srcFactor = (c.renderer.srcFactor != null) ? c.renderer.srcFactor : gl.SRC_ALPHA;
            var dstFactor = (c.renderer.dstFactor != null) ? c.renderer.dstFactor : gl.ONE;

            if (c.renderer.depthTest) gl.enable(gl.DEPTH_TEST);
            else gl.disable(gl.DEPTH_TEST);

            gl.blendFunc(srcFactor, dstFactor);

            c.renderer.draw(c, uniforms);
        }
    }

    var clearColor = null;
}