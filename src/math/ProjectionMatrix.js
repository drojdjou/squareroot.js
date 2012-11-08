/**
 * Creates a new 4x4 Matrix
 *
 * @class The 4x4 matrix is used mostly for perspective and orthographic projection.
 */
SQR.ProjectionMatrix = function() {
    if (typeof Float32Array !== 'undefined') Float32Array = Array;
    this.data = new Float32Array(16);

    this.copyTo = function(m) {
        var a = this.data, b = m.data || m;
        for(var i = 0; i < 16; i++) b[i] = a[i];
        return m;
    }

    this.identity();
}

SQR.ProjectionMatrix.prototype.identity = function() {
    var m = this.data;
    m[0] = 1,m[1] = 0,m[2] = 0,m[3] = 0;
    m[4] = 0,m[5] = 1,m[6] = 0,m[7] = 0;
    m[8] = 0,m[9] = 0,m[10] = 1,m[11] = 0;
    m[12] = 0,m[13] = 0,m[14] = 0,m[15] = 1;
}

SQR.ProjectionMatrix.prototype.perspective = function(fov, aspect, near, far) {
    var m = this.data;
    var t = near * Math.tan(fov * Math.PI / 360);
    var n = far - near;

    m[0] =   near / (t * aspect);
    m[4] =   0;
    m[8] =   0;
    m[12] =   0;

    m[1] =   0;
    m[5] =   near / t;
    m[9] =   0;
    m[13] =   0;

    m[2] =   0;
    m[6] =   0;
    m[10] = -(far + near) / n;
    m[14] = -(2 * far * near) / n;

    m[3] =  0;
    m[7] =  0;
    m[11] = -1;
    m[15] =  0;

//	this.n11 = near / (t * aspect);
//	this.n22 = near / t;
//	this.n33 = -(far + near) / n;
//	this.n34 = -(2 * far * near) / n;
//	this.n43 = -1;
//	this.n44 = 0;
}

SQR.ProjectionMatrix.prototype.transformVector = function(v, pv) {
    var x = v.x, y = v.y, z = v.z, w = v.w;
    var m = this.data;
    pv = pv || v;

    pv.x = m[0] * x + m[4] * y + m[8]  * z + m[12] * w;
    pv.y = m[1] * x + m[5] * y + m[9]  * z + m[13] * w;
    pv.z = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
//  pv.w = d[3] * x + d[7] * y + d[11] * z + d[15] * w;

    return pv;
}
