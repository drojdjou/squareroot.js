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

    // Do not call this functions directly
    this.appendToDom = function(c) {
        if (addedToDom && c == container) return;
        container = c;
        container.appendChild(this.element);
        addedToDom = true;
    }

    this.removeFromDom = function() {
        container.removeChild(this.element);
    }

    this.setBackfaceVisibility = function() {
        //empty function just to prevent needing logic for 2d/3d
    }

    this.draw = function(transform, uniforms) {
        var t3d = (transform.cssPreserve3dMode) ? '' : SQR.DOMUtil.translate3dCss(0, 0, uniforms.cssDistance);
        var ps = 'perspective(' + uniforms.cssDistance + 'px)';

        var p = t3d + ' ' + transform.globalMatrix.getAsCSSProperty();

        element.style.zIndex = uniforms.depth;
        element.style['transform'] = ps + p;
        element.style['-webkit-transform'] = p;
        element.style['-moz-transform'] = ps + p;
        element.style['-ms-transform'] = ps + p;
        element.style['-o-transform'] = ps + p; // TODO: to ps or not ps in Opera?

    }
}