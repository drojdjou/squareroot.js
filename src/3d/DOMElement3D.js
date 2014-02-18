/**
 * @class
 *
 * The SQR.DOMElement3D represents a div transformed using CSS 3D.
 * For browsers that do not support CSS 3D, the SQR.DOMElement2D renderer should can used instead.
 *
 * @param element
 */
SQR.DOMElement3D = function(element) {

    // Used to identify the type of the renderer instead of using insfanceof
    this.isDom3d = true;

    this.element = element;
    var addedToDom = false;
    var container = null;

    this.setBackfaceVisibility = function(visible) {
        var p = (visible) ? 'visible' : 'hidden';
        element.style['backface-visibility'] = p;
        element.style['-webkit-backface-visibility'] = p;
        element.style['-moz-backface-visibility'] = p;
        element.style['-ms-backface-visibility'] = p;
        element.style['-o-backface-visibility'] = p;
    }

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
        if (!addedToDom) return;
        container.removeChild(this.element);
        addedToDom = false;
    }

    /**
     * Draw function in a renderer will take care of drawing the element on screen.
     *
     * This functions role is very similar the shader in WebGL.
     * Inside draw all the vertices are transformed and projected to screen coordinates.
     *
     * For canvas rendering it will invoke the necessary drawing functions, for CSS elements
     * is will update it's style transform property.
     *
     * @param transform the transform being rendered
     * @param uniforms a collection of objects necessary for rendering (ref to canvas, matrices, misc coordinates, etc...)
     */
    this.draw = function(transform, uniforms) {
        var t3d = SQR.DOMUtil.translate3dCss(0, 0, uniforms.cssDistance);
        var ps = 'perspective(' + uniforms.cssDistance + 'px)';
        var p = t3d + ' ' + transform.viewMatrix.getAsCSSProperty();

        element.style['transform'] = p;
        element.style['-webkit-transform'] = p;
        element.style['-moz-transform'] = p;
        element.style['-ms-transform'] = ps + p;
        element.style['-o-transform'] = ps + p; // TODO: to ps or not ps in Opera?
    }
}