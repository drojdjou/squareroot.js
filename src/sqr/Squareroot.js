SQR.Squareroot = function(canvas, divContainer) {

    var uniforms = {};
    if(canvas) uniforms.context = canvas.getContext("2d");
    uniforms.projection = new SQR.ProjectionMatrix();
    uniforms.container = divContainer;

    uniforms.supportsCSS3D = (typeof(Modernizr) != "undefined" && Modernizr.csstransforms3d) ? true : false;

    uniforms.lightDirection = new SQR.V3(0, 1, 0.1).norm();

    var clearColor = null;

    this.setBackground = function(c) {
        if(canvas) canvas.style.backgroundColor = c;
    }

    this.setClearColor = function(c) {
        clearColor = c;
    }

    this.setProjection = function(fov) {
        uniforms.cssDistance = 0.5 / Math.tan(fov * Math.PI / 360) * uniforms.height;
        uniforms.projection.perspective(fov, uniforms.width / uniforms.height, 0.1, 1000);

        if (divContainer) {
            divContainer.style['perspective'] = uniforms.cssDistance + 'px';
            divContainer.style['-webkit-perspective'] = uniforms.cssDistance + 'px';
            divContainer.style['-moz-perspective'] = uniforms.cssDistance + 'px';
            divContainer.style['-o-perspective'] = uniforms.cssDistance + 'px';
        }
    }

    this.cssDistance = function() {
        return uniforms.cssDistance;
    }

    this.setSize = function(w, h) {
        uniforms.width = w;
        uniforms.height = h;

        if(canvas) {
            canvas.width = w;
            canvas.height = h;
        }
        
        uniforms.aspect = w / h;
        uniforms.centerX = w * 0.5;
        uniforms.centerY = h * 0.5;
    }

    this.children = [];
    this.numChildren = 0;

    var renderObjects = [];

    this.add = function() {
        for (var i = 0; i < arguments.length; i++) {
            var t = arguments[i];
            if (this.children.indexOf(t) == -1) this.children.push(t);
        }
        this.numChildren = this.children.length;
    }

    this.removeAll = function() {
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

    this.render = function(camera) {

        SQR.Time.tick();

        renderObjects.length = 0;

        if(!!uniforms.context) {
            uniforms.context.setTransform(1, 0, 0, 1, 0, 0);

            if (clearColor != null) {
                uniforms.context.fillStyle = clearColor;
                uniforms.context.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                uniforms.context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        for (var i = 0; i < this.numChildren; i++) {
            var t = this.children[i];
            updateTransform(t);
        }

        var l = renderObjects.length, c;

        uniforms.camera = camera;
        uniforms.viewMatrix = camera.computeInverseMatrix();

        for (var i = 0; i < l; i++) {
            c = renderObjects[i];
            c.transformView(uniforms.viewMatrix);
        }

        renderObjects.sort(function(a, b) {
            var ad = a.depth();
            var bd = b.depth();
            if (ad < bd) return -1;
            if (ad > bd) return 1;
            return 0;
        });

        for (var i = 0; i < l; i++) {
            c = renderObjects[i];

            if (c.renderer) {
                uniforms.depth = i;
                c.renderer.draw(c, uniforms);
            }
        }
    }
}