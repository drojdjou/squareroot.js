SQR.Sprite3D = function() {

    var that = this;
    var numTris = 2;

    this.vertexSize = 3;
    this.numVertices = 6;

    this.corners = {};

    var ts = [], vs = [];

    this.biFaced = function() {
        numTris = 4;
        that.numVertices = 12;
        return that;
    }

    this.setSize = function(w, h) {
        ts.length = 0;

        var tl = new SQR.V3(w * -0.5, h * 0.5, 0);
        var tr = new SQR.V3(w * 0.5, h * 0.5, 0);
        var bl = new SQR.V3(w * -0.5, h * -0.5, 0);
        var br = new SQR.V3(w * 0.5, h * -0.5, 0);

        that.corners.tl = tl;
        that.corners.tr = tr;
        that.corners.bl = bl;
        that.corners.br = br;
    
        ts.push(new SQR.Triangle(tl, tr, br));
        ts.push(new SQR.Triangle(tl, br, bl));

        if(numTris == 4) {
            ts.push(new SQR.Triangle(tl, br, tr));
            ts.push(new SQR.Triangle(tl, bl, br));
        }

        that.refresh();

        return that;
    }

    this.refresh = function() {
        vs.length = 0;

        for(var i = 0; i < numTris; i++) {
            ts[i].toArray(vs);
        }

        that.vertices = new Float32Array(vs);
        that.dirty = true;
        return that;
    }        
}