SQR.DOMUtil = {

    isElement: function(o) {
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string"
            );
    },

    translate3dCss: function(x, y, z) {
        return ' translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';
    },

    translate2dCss: function(x, y, z) {
        return ' translate(' + x + 'px,' + y + 'px)';
    },

    rotate3dCss: function(x, y, z) {
        return ' rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(' + z + 'deg)';
    },

    setTransformCss: function(element, tx, ty, s, r) {

        tx = tx || 0;
        ty = ty || 0;

        s = s || 1;
        r = r || 0;

        var t =
            'translateZ(0px) ' +
            'translate(' + tx + 'px, ' + ty + 'px) ' +
            'scale(' + s + ') ' +
            'rotate(' + r + 'deg)';

        element.style['-webkit-transform'] = t;

    }
}