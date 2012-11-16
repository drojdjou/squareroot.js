SQR.DOMElement2D = function(element) {

    this.element = element;
    this.matrix2D = new SQR.Matrix2D();

    this.draw = function(transform, uniforms) {

        var p = transform.globalPosition();
        var r = transform.rotation.z;
        var s = 1 / (p.z / uniforms.cssDistance);

        p.x = p.x / p.z * uniforms.centerX;
        p.y = p.y / p.z * uniforms.centerY * uniforms.aspect;

        this.matrix2D.setTRS(p.x, p.y, r, s, s);

        var m = this.matrix2D.getAsCSSProperty(uniforms.supportsCSS3d);

        element.style.zIndex = uniforms.depth;
        element.style['transform'] = m;
        element.style['-webkit-transform'] = m;
        element.style['-moz-transform'] = m;
        element.style['-o-transform'] = m;
        element.style['-ms-transform'] = m;
    }

}