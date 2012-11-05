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

    rotate3dCss: function(x, y, z) {
        return ' rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(' + z + 'deg)';
    }
}