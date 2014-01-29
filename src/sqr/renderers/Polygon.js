SQR.Polygon = function(color) {

    var mvp = new SQR.Matrix44();
    var viewForward = new SQR.V3();

    this.culling = true;
    this.useLight = false;
    this.wireframe = false;
    this.lightIntensity = function(l) { return l; }

    this.calculateDepth = function(face) {
        var c = SQR.Quaternion.__tv1;
        var v = face.vertices.length;
        c.set(0,0,0).add(this.sa, this.sb).add(c, this.sc).mul(1/3);
        this.depth = c.z;
    }

    var updateVertex = function(face, index, mvp, centerX, centerY) {
        var v = face.vertices[index];
        var sv = face.screenVertices[index] || v.clone();
        var c = SQR.Quaternion.__tv1;

        if(!sv) sv = v.clone();
        else sv.copyFrom(v);

        mvp.transformVector(sv);

        sv.x = sv.x / sv.z * centerX + centerX;
        sv.y = (centerY * 2) - (sv.y / sv.z * centerY + centerY);

        face.screenVertices[index] = sv;
    }

    var update = function(face, mvp, centerX, centerY) {

        if(!face.screenVertices) face.screenVertices = [];
        var fvl = face.vertices.length;

        updateVertex(face, 0, mvp, centerX, centerY);
        updateVertex(face, 1, mvp, centerX, centerY);
        updateVertex(face, 2, mvp, centerX, centerY);
        if(fvl > 3) updateVertex(face, 3, mvp, centerX, centerY);

        var z = face.screenVertices[0].z;
        z += face.screenVertices[1].z;
        z += face.screenVertices[2].z;
        if(fvl > 3) z += face.screenVertices[3].z;

        face.depth = z / fvl;
    }

    this.draw = function(transform, uniforms) {
        var ctx = uniforms.context;
        var geo = transform.geometry;

        uniforms.projection.copyTo(mvp);
        mvp.multiply(transform.viewMatrix);

        var i, t, tris = geo.faces.length;

        for (i = 0; i < tris; i++) {
            t = geo.faces[i];
            update(t, mvp, uniforms.centerX, uniforms.centerY);
        }

        geo.faces.sort(function(a, b) {
            var ad = a.depth;
            var bd = b.depth;
            if (ad < bd) return 1;
            if (ad > bd) return -1;
            return 0;
        });

        viewForward.copyFrom(uniforms.camera.forward);

        for (i = 0; i < tris; i++) {
            t = geo.faces[i];
            t.calculateNormal();
            transform.normalMatrix.transformVector(t.normal);

            var f = Math.max(0, SQR.V3.dot(t.normal, viewForward));

            if(f < 0 && this.culling) {
                // console.log(SQR.Stringify.v3(viewForward), SQR.Stringify.v3(t.normal), f);
                continue;
            }

            var l = Math.max(0, SQR.V3.dot(t.normal, uniforms.lightDirection));
            var c = color;
            var lc = SQR.Color.hsl(c.hue, c.saturation, c.lightness * this.lightIntensity(l), c.alpha);

            if(this.useLight) {
                ctx.fillStyle = lc;
                ctx.strokeStyle = (f < 0) ? "#00f" : lc;
            } else {
                ctx.fillStyle = c.toHSLString();
                ctx.strokeStyle = (f < 0) ? "#00f" : c.toHSLString();
            }

            var sv = t.screenVertices;

            ctx.beginPath();
            ctx.moveTo(sv[0].x, sv[0].y);
            ctx.lineTo(sv[1].x, sv[1].y);
            ctx.lineTo(sv[2].x, sv[2].y);
            if(sv.length > 3) ctx.lineTo(sv[3].x, sv[3].y);
            ctx.closePath();
            if(!this.wireframe) ctx.fill();
            ctx.stroke();
        }
    }
}