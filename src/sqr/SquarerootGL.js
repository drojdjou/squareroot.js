/**
 * @class
 *
 * The engine.
 *
 * @param canvas
 * @param divContainer
 */
SQR.SquarerootGL = function(canvas) {
	var uniforms = {};

    var gl = canvas.getContext("experimental-webgl");
    var aspect = 1;

    SQR.GL.init(gl);

    this.setClearColor = function(r, g, b, a) {
        gl.clearColor(r, g, b, a);
    }

    this.setProjection = function(matrix) {
        uniforms.projection = matrix;
    }

    this.setSize = function(w, h) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        aspect = canvas.height / canvas.width;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    this.createShader = function() {
        return new SQR.Shader(gl);
    }

    this.createRenderer = function(shader) {
        return new SQR.WebGL(gl, shader);
    }

    this.children = [];
    this.numChildren = 0;
    var renderObjects = [];

    this.add = function() {
        for (var i = 0; i < arguments.length; i++) {
            var t = arguments[i];
            t.parent = null;
            if (this.children.indexOf(t) == -1) this.children.push(t);
        }
        this.numChildren = this.children.length;
    }

    this.remove = function() {
        for (var i = 0; i < arguments.length; i++) {
            var t = arguments[i];
            var j = this.children.indexOf(t);

            if (j == -1) return false;

            t.parent = null;

            this.children.splice(j, 1);
        }

        this.numChildren = this.children.length;
    }

    this.contains = function(t) {
        return this.children.indexOf(t) > -1;
    }

    this.recurse = function(f) {
        for (var i = 0; i < this.numChildren; i++) {
            this.children[i].recurse(f);
        }
    }

    this.removeAll = function() {
        for (var i = 0; i < this.numChildren; i++) {
            var t = this.children[i];
            t.parent = null;
        }

        this.children = [];
        this.numChildren = this.children.length;
    }

    var updateTransform = function(t) {
        t.transformWorld();
        renderObjects.push(t);

        if (t.numChildren > 0) {
            for (var i = 0; i < t.numChildren; i++) {
                updateTransform(t.children[i]);
            }
        }
    }

    this.clear = function() {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CW);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    this.render = function(camera) {
        var i;

        this.clear();

        renderObjects.length = 0;

        for (i = 0; i < this.numChildren; i++) {
            updateTransform(this.children[i]);
        }

        var l = renderObjects.length, c;

        if(camera) {
            uniforms.camera = camera;
            uniforms.viewMatrix = camera.computeInverseMatrix();
        }

        for (i = 0; i < l; i++) {
            c = renderObjects[i];

            if(!c.enabled) continue;

            if (c.renderer) {
                c.renderer.draw(c, uniforms);
            }
        }
    }

    var clearColor = null;
}