SQR.Sprite = function(width, height) {

        this.vertexSize = 2;
        this.numVertices = 6;

        var that = this;

        this.width = width;
        this.height = height;

        var vs = new Float32Array(12);
        var w = this.width, h = this.height;

        vs[0] = w * -0.5;
        vs[1] = h * 0.5;
        vs[2] = w * 0.5;
        vs[3] = h * 0.5;
        vs[4] = w * 0.5;
        vs[5] = h * -0.5;

        vs[6] = w * -0.5;
        vs[7] = h * 0.5;
        vs[8] = w * 0.5;
        vs[9] = h * -0.5;
        vs[10] = w * -0.5;
        vs[11] = h * -0.5;

        this.vertices = vs;
    }