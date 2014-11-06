/**
 * @class
 *
 * A matrix that implements 2D affine transformations.
 *
 * @todo Make it column major
 */
SQR.Matrix2D = function() {

    this.data = new Float32Array(9);

    var a, b, d, x, y;

    /**
     * Resets the matrix to identity values.
     */
    this.identity = function(d) {
        d = d || this.data;
        d[0] = 1,d[3] = 0,d[6] = 0;
        d[1] = 0,d[4] = 1,d[7] = 0;
        d[2] = 0,d[5] = 0,d[8] = 1;

        return this;
    }

    /**
     * Multiplies the vector by the matrix
     * @param v vector to multiply
     * @returns the same vector as passed in the parameter, multiplied by this matrix
     */
    this.transformVector = function(v) {
        d = this.data;
        x = v.x,y = v.y;
        v.x = d[0] * x + d[1] * y + d[2];
        v.y = d[3] * x + d[4] * y + d[5];
        return v;
    }

    /**
     *  Sets the translation values.
     *  @param tx x translation
     *  @param ty y translation
     *  @param m the matrix to set translation to, applies to this if ommited
     */
    this.setTranslation = function(tx, ty, m) {
        d = m || this.data;
        d[0] = 1,d[3] = 0,d[6] = tx;
        d[1] = 0,d[4] = 1,d[7] = ty;
        d[2] = 0,d[5] = 0,d[8] = 1;
        return this;
    }

    /**
     *  Returns the translation value as 2d vector.
     *  @param v {@link SQR.V2}, if ommited a new vector object is returned
     *  @returns a {@link SQR.V2} with translation values
     */
    this.getTranslation = function(v) {
        d = this.data;
        v = v || new SQR.V2();
        v.x = d[2];
        v.y = d[5];
        return v;
    }

    /**
     *  Sets the scale values.
     *  @param sx x scale
     *  @param sy y scale
     *  @param m the matrix to set scale to, applies to this if ommited
     */
    this.setScale = function(sx, sy, m) {
        d = m || this.data;
        d[0] = sx,d[3] = 0, d[6] = 0;
        d[1] = 0, d[4] = sy,d[7] = 0;
        d[2] = 0, d[5] = 0, d[8] = 1;
        return this;
    }

    this.setShear = function(sx, sy, m) {
        d = m || this.data;
        d[0] = 1, d[3] = sx,d[6] = 0;
        d[1] = sy,d[4] = 1, d[7] = 0;
        d[2] = 0, d[5] = 0, d[8] = 1;
        return this;
    }

    this.setRotation = function(a, m) {
        d = m || this.data;
        var r0 = Math.cos(a);
        var r1 = Math.sin(a);
        d[0] = r0,d[3] = -r1,d[6] = 0;
        d[1] = r1,d[4] = r0, d[7] = 0;
        d[2] = 0, d[5] = 0,  d[8] = 1;
        return this;
    }

    this.setTRS = function(tx, ty, a, sx, sy) {
        d = this.data;
        var r0 = Math.cos(a);
        var r1 = Math.sin(a);
        d[0] = r0 * sx,d[3] = -r1 * sy,d[6] = tx;
        d[1] = r1 * sx,d[4] = r0 * sy, d[7] = ty;
        d[2] = 0,      d[5] = 0,       d[8] = 1;
        return this;
    }

    this.translate = function(tx, ty) {
        this.identity(SQR.Matrix2D.__temp);
        this.setTranslation(tx, ty, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    this.rotate = function(a) {
        this.identity(SQR.Matrix2D.__temp);
        this.setRotation(a, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    this.scale = function(sx, sy) {
        this.identity(SQR.Matrix2D.__temp);
        this.setScale(sx, sy, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    this.shear = function(sx, sy) {
        this.identity(SQR.Matrix2D.__temp);
        this.setRotation(sx, sy, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    var a11, a12, a13, a21, a22, a23, a31, a32, a33;
    var b11, b12, b13, b21, b22, b23, b31, b32, b33;

    this.multiply = function(m) {
        a = this.data, b = m.data || m;

        a11 = a[0],a12 = a[3],a13 = a[6];
        a21 = a[1],a22 = a[4],a23 = a[7];
        a31 = a[2],a32 = a[5],a33 = a[8];

        b11 = b[0],b12 = b[3],b13 = b[6];
        b21 = b[1],b22 = b[4],b23 = b[7];
        b31 = b[2],b32 = b[5],b33 = b[8];

        a[0] = a11 * b11 + a12 * b21 + a13 * b31;
        a[3] = a11 * b12 + a12 * b22 + a13 * b32;
        a[6] = a11 * b13 + a12 * b23 + a13 * b33;

        a[1] = a21 * b11 + a22 * b21 + a23 * b31;
        a[4] = a21 * b12 + a22 * b22 + a23 * b32;
        a[7] = a21 * b13 + a22 * b23 + a23 * b33;

        //a[6] = a31 * b11 + a32 * b21 + a33 * b31;
        //a[7] = a31 * b12 + a32 * b22 + a33 * b32;
        //a[8] = a31 * b13 + a32 * b23 + a33 * b33;

        return this;
    }

    this.copyTo = function(m) {
        a = this.data,b = m.data || m;

        b[0] = a[0],b[1] = a[1],b[2] = a[2];
        b[3] = a[3],b[4] = a[4],b[5] = a[5];
        b[6] = a[6],b[7] = a[7],b[8] = a[8];

        return m;
    }

    this.copyFrom = function(m) {
        a = m.data || m,b = this.data;

        b[0] = a[0],b[1] = a[1],b[2] = a[2];
        b[3] = a[3],b[4] = a[4],b[5] = a[5];
        b[6] = a[6],b[7] = a[7],b[8] = a[8];

        return this;
    }

    this.identity();
}

SQR.Matrix2D.__temp = new Float32Array(9);














