/**
 * @class
 *
 * The SQR.DOMElement2D is like a billboard made of a div. It is useful for billboard,
 * but most typically it will be used as replacement for SQR.DOMElement3D for browsers that
 * do not support CSS 3D.
 *
 * @param element
 */
SQR.DOMElement2D = function(element) {

    // Used to identify the type of the renderer instead of using insfanceof
    this.isDom2d = true;

    this.element = element;
    var addedToDom = false;
    var container = null;

    var matrix2D = new SQR.Matrix2D();
    var mvp = new SQR.Matrix44();
	var v3 = new SQR.V3(0, 0, 0);

    /**
     *  Adds te underlying div element to dom.
     *  Do not call this functions directly.
     */
    this.appendToDom = function(c) {
        if (addedToDom && c == container) return;
        container = c;
        container.appendChild(this.element);
        addedToDom = true;
    }

    /**
     *  Removes the underlying div element from dom.
     *  Do not call this functions directly.
     */
    this.removeFromDom = function() {
        if(!addedToDom) return;
        container.removeChild(this.element);
        addedToDom = false;
    }

    /**
     * This function doesn't do anything, but it's here to match the interface of SQR.DOMElement3D.
     */
    this.setBackfaceVisibility = function() {
    }

    /**
     * Draw function in a renderer will take care of drawing the element on screen.
     *
     * This functions role is very similar the shader in WebGL. 
     * Inside draw all the vertices are tranaformed and projected to screen coordinates.
     *
     * For canvas rendering it will invoke the necessary drawing functions, for CSS elements
     * is will update it's style transfom property.
     *
     * @param transform the transform being rendered
     * @param uniforms a collection of objects necessary for rendering (ref to canvas, matrices, misc coordinates, etc...)
     */
    this.draw = function(transform, uniforms) {
        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.viewMatrix);

        var p = v3.set(0, 0, 0);

        mvp.transformVector(p);

        p.x = p.x / p.z * uniforms.centerX;
        p.y = p.y / p.z * uniforms.centerY;

        var s = 1 / (p.z / uniforms.cssDistance);
        var r = transform.rotation.z;

        matrix2D.setTRS(p.x, p.y, r, s, s);

        var t3d = (SQR.supportsCss3d) ? SQR.DOMUtil.translate3dCss(0, 0, 0) : '';
        var m = t3d + matrix2D.getAsCSSProperty(false);

        element.style.zIndex = uniforms.depth;
        element.style['transform'] = m;
        element.style['-webkit-transform'] = m;
        element.style['-moz-transform'] = m;
        element.style['-o-transform'] = m;
        element.style['-ms-transform'] = m;
        element.style['display'] = (p.z <= 0) ? 'none' : 'block';
    }
}