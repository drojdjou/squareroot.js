SQR.Div3D = function(e) {
    this.element = e;
    this.matrix = new SQR.Matrix44();
    this.world = new SQR.Matrix44();
    this.position = new SQR.V3();
    this.rotation = new SQR.V3();
    this.style = this.element.style;
}

SQR.Div3D.prototype = {

    depth: function() {
        return this.world.data[14];
    },

    setDepth: function(i) {
        this.style.zIndex = i;
    },

    update: function(m, p) {
        var p = this.position;
        var r = this.rotation;
        this.matrix.setTRS(p.x, p.y, p.z, r.x, r.y, r.z, 1, 1, 1);
        m.copyTo(this.world);
        this.world.multiply(this.matrix);
    },

    render: function(engine) {

        var t3d = SQR.DOMUtil.translate3dCss;

        this.element.style['-webkit-transform'] =
            t3d(0, 0, engine.cssDistance) + this.world.getAsCSSProperty();

        //console.log(this.world.getAsCSSProperty());
    }
}